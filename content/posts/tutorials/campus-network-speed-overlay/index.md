---
title: "垃圾校园网，我忍不了了"
date: 2021-04-10 23:50:00+0800
description: "校园网被限速了，受不了垃圾网速，动手搞了单线多拨网速叠加"
tags:
- Linux
- 多拨
categories:
- 教程
draft: true
---

## Linux下手工操作

以下所有操作都需要root权限

### 利用macvlan获取多个IP

首先要创建多个虚拟网络接口，利用不同的Mac地址进行DHCP获取多个不同的IP地址

在Linux下，内核提供的macvlan就可以实现我们的需求，从Linux Kernel 3.9开始就支持了貌似，所以只要不是安装非常老的系统都是支持的

查看一下你的系统是否支持：

```
# modprobe macvlan
# lsmod | grep macvlan
macvlan                24576  0
```

如果显示类似上面的内容就表示支持

添加一个macvlan类型的网络接口：

```shell
ip link add link <physical-network-interface-name> <new-network-interface-name> type macvlan
```

例如，通过 `ip addr` 或者 `ifconfig` 查看到物理网卡名为 `eth0`，新网络接口名我们用 `vmac0` `vmac1` 这样的表示，命令如下：

```shell
ip link add link eth0 vmac0 type macvlan
ip link add link eth0 vmac1 type macvlan
```

这样就创建了两个新的网络接口，依附于物理接口 `eth0`，两个新网络接口的mac地址是自动分配的，每一次新建都会随机生成。

如果想要手动指定mac地址，可以使用下面的命令:

```shell
ip link add link <physical-network-interface-name> <new-network-interface-name> address <mac-address> type macvlan
例如：
ip link add link eth0 vmac0 address 11:22:33:44:55:66 type macvlan
```

{{< admonition tip >}}
更加详细的命令通过 `ip link help` 和 `man ip link` 查看
{{< /admonition >}}

经过上面这一步，就就可以通过 `ip link` 看到多了两个网络接口

```shell
4: vmac0@eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 5a:5d:f9:1e:b8:19 brd ff:ff:ff:ff:ff:ff
5: vmac1@eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 66:50:b5:23:d8:ce brd ff:ff:ff:ff:ff:ff
```

然后需要获取到多个IP，直接执行 `dhclient` 即可

### 进行联网认证

我们学校用的是深澜的认证系统，对其认证流程分析后，写了一个小工具:[多账号登录认证工具](sdu-srun.zip)

在启动前先修改配置文件，username为学号，password为上网认证的密码，ip分别写刚刚 macvlan 获取到的IP

学校限制的每个人最多5台设备同时在线，新登录的设备会把前面的设备顶下去，所以最好联合舍友用多个人的账号进行认证

```yaml
login:
 - username: 201700301111
   password: user1-password
   ip: 10.0.0.1
 - username: 201700301111
   password: user1-password
   ip: 10.0.0.2
 - username: 201700302222
   password: user2-password
   ip: 10.0.0.3
```

{{< admonition >}}
认证成功后即可进行下面的步骤，如果认证失败需要检查账号密码是否正确，本工具也不能保证后续系统更新后仍能使用，必要时可登录认证后台手工添加mac认证白名单
{{< /admonition >}}

### 进行路由级别的分流

经过上面的步骤，其实现在已经有多个可以上网的接口了，每一个接口都限速30Mbps，可以通过修改路由表验证，但是测速发现还是总速度还是30Mbps，速度并没有叠加

这其实是因为你的主机只有一个默认网关，流量实际上只走了一条线，所以还是受单接口限速的限制

我们的目的是让流量能够分别走多个接口，从而达到速度叠加的效果，也就是常说的负载均衡。这里主要用到负载均衡的轮询模式，让数据包一个走1号线，下一个走2号线，不断切换流量出口，反复循环。

#### 配置策略路由

首先创建多个路由表，刚刚创建了多少虚拟网络接口，这里就要增加几个路由表，我按照2个接口来演示

编辑 `/etc/iproute2/rt_tables` 文件，在文件末尾增加两个路由表

```shell
# 新增的路由表
100      vmac0
101      vmac1
```

保证新路由表中没有条目，先清空一下

```shell
ip route flush table vmac0
ip route flush table vmac1
```

分别为两个路由表增加默认路由项，分别走不同的网络接口

```shell
ip route add 0/0 dev vmac0 table vmac0
ip route add 0/0 dev vmac1 table vmac1
```

下面需要配置策略路由，根据我们设置的策略，流量分别由多个路由表进行路由，所以就可以走多个网络接口了

我们让防火墙标记为``0x100`的用`vmac0`路由表，标记为`0x101`流量的用`vmac1`路由表

```shell
ip rule add fwmark 0x100 table vmac0
ip rule add fwmark 0x101 table vmac1
```

此时会出现一个问题，就是从外部发起的连接在进来后并没有打上防火墙标记，所以返回的包只能走默认的路由表。假如我们的默认路由表的默认路由是走`vmac0`，那来自`vmac1`的请求的响应包也会走`vmac0`出去，因为不属于同一个连接，这个包就会被丢掉。

我们的解决方法是再增加两条规则，来自哪个网卡的包的响应就从该网卡出

```shell
ip rule add from <vmac0-ip> table vmac0
ip rule add from <vmac1-ip> table vmac1
```

#### 配置iptables

分别创建多个新的链

```shell
# 新建 VMAC0 链
iptables -t mangle -N VMAC0
iptables -t mangle -A VMAC0 -j MARK --set-mark 0x100
iptables -t mangle -A VMAC0 -j CONNMARK --save-mark

# 新建 VMAC1 链
iptables -t mangle -N VMAC1
iptables -t mangle -A VMAC1 -j MARK --set-mark 0x101
iptables -t mangle -A VMAC1 -j CONNMARK --save-mark
```

应用至 OUTPUT 链

```shell
iptables -t mangle -A OUTPUT -o vmac+ -p  tcp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A OUTPUT -o vmac+ -p  tcp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A OUTPUT -o vmac+ -p  tcp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark
iptables -t mangle -A OUTPUT -o vmac+ -p  udp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A OUTPUT -o vmac+ -p  udp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A OUTPUT -o vmac+ -p  udp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark
iptables -t mangle -A OUTPUT -o vmac+ -p icmp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A OUTPUT -o vmac+ -p icmp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A OUTPUT -o vmac+ -p icmp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark
```

应用至 PREROUTING 链

```shell
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  tcp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  tcp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  tcp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  udp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  udp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p  udp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p icmp -m state --state NEW -m statistic --mode nth --every 2 --packet 0 -j VMAC0
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p icmp -m state --state NEW -m statistic --mode nth --every 2 --packet 1 -j VMAC1
iptables -t mangle -A PREROUTING -s 192.168/16 ! -d 192.168/16 -p icmp -m state --state ESTABLISHED,RELATED -j CONNMARK --restore-mark


对内网流量进行SNAT

```shell 
iptables -t nat -A POSTROUTING -o vmac+ -j MASQUERADE
```

## 使用OpenWRT+mvan3

{{< admonition tip >}}
mwan3代码在：https://github.com/openwrt/packages/tree/master/net/mwan3  
是纯shell写的，可以学习
{{< /admonition >}}

## 爱快，分流很强大

