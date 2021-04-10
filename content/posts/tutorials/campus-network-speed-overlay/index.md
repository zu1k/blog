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

### 利用MacVlan获取多个IP

首先要创建多个虚拟网络接口，利用不同的Mac地址进行DHCP获取多个不同的IP地址

在Linux下，内核提供的MacVlan就可以实现我们的需求，从Linux Kernel 3.9开始就支持了貌似，所以只要不是安装非常老的系统都是支持的

```shell
sudo ip link add link <physical-network-interface-name> <new-network-interface-name> type macvlan
```

例如，通过 `ip addr` 或者 `ifconfig` 查看到物理网卡名为 `eth0`，新网络接口名我们用 `vmac0` `vmac1` 这样的表示，命令如下：

```shell
sudo ip link add link eth0 vmac0 type macvlan
sudo ip link add link eth0 vmac1 type macvlan
```

这样就创建了两个新的网络接口，依附于物理接口 `eth0`，两个新网络接口的mac地址是自动分配的，每一次新建都会随机生成。

如果想要手动指定mac地址，可以使用下面的命令:

```shell
sudo ip link add link <physical-network-interface-name> <new-network-interface-name> address <mac-address> type macvlan
例如：
sudo ip link add link eth0 vmac0 address 11:22:33:44:55:66 type macvlan
```

{{< admonition tip >}}
更加详细的命令通过 `ip link help` 和 `man ip link` 查看
{{< /admonition >}}

