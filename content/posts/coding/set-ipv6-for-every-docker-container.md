---
title: 给docker里的每一个容器一个独立的ipv6地址
tags:
  - docker
  - ipv6
categories:
  - docker
date: 2019-08-31 14:39:03
---

ipv6不断普及，ipv6地址多的数不胜数，机房给单台机器分配的ipv6段达到了可怕的64位长度的子网主机号。

那我不禁在想，能不能给docker下的每个容器独立的ipv6地址，这样就不需要映射端口号了。

所以就有了以下实践：

首先，给docker engine开启ipv6支持, 参考： https://docs.docker.com/config/daemon/ipv6/

配置/etc/docker/daemon.json文件如下。

```json
{
    "ipv6": true,
    "fixed-cidr-v6": "2001:1234:5001:1234::/64"
}
```

执行 `systemctl reload docker` 重载Docker Engine的配置文件

这样docker默认的bridge网络就会给容器分配随机的ipv6地址了。

但是我们通常需要固定的ipv6地址，所以需要添加自定义网桥网络

```shell
docker network create \
    -d bridge --ipv6 \
    --subnet "2001:1234:5001:1234:6666::/80" \
    --gateway="2001:1234:5001:1234:6666::1" \
    --subnet=172.28.0.0/16 \
    --gateway=172.28.0.1 ipv6
```

然后启动docker容器时候指定ipv6网桥和ipv6地址

```shell
docker run -itd -P --ip=172.28.0.101 \
    --ip6="2001:1234:5001:1234:6666::101" \
    --network=ipv6 \
    --name=ipv6test \
    ubuntu:18.04 /bin/bash
```

此时容器已经有独立的ipv6地址了，我们发现向外访问可以访问，但是外界访问不到docker后面隐藏的container
这是因为ipv6使用NDP协议，我们需要在容器的宿主机上设置 ndp代理

```shell
sysctl net.ipv6.conf.ens3.proxy_ndp=1
```

> ens3是我的宿主机外网网卡，这里需要替换成你自己的

这里每一个docker分配的ipv6地址都需要添加这样一条规则

```shell
ip -6 neigh add proxy 2001:1234:5001:1234:6666::101 dev ens3
```
