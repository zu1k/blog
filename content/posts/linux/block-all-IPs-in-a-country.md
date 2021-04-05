---
title: 屏蔽一个国家所有IP
date: 2018-12-03 17:55:28
tags:
    - ipset
    - iptables
    - linux
    - shell
categories:
    - coding
---

搭建了一个MTProxy，分享出去，最后发现网速跑满，连接ip数高达600多，并且还在不断增加。
查看ip来源后发现九成以上是伊朗人，后来知道原来tg在他们国家被封了，所以才导致如此。

所以想办法屏蔽这些ip，准确的说是一整个国家的ip,或者说是一堆ip

## 使用iptables添加规则

方法如下：
1.下载一个国家的ip段，网址：[http://www.ipdeny.com/ipblocks/][1]

`wget http://www.ipdeny.com/ipblocks/data/countries/ir.zone`

2.使用脚本批量添加iptables规则

```shell
#!/bin/bash
# Block traffic from a specific country

COUNTRY="ir"
IPTABLES=/sbin/iptables
EGREP=/bin/egrep

if [ "$(id -u)" != "0" ]; then
    echo "you must be root" 1>&2
    exit 1
fi

resetrules() {
$IPTABLES -F
$IPTABLES -t nat -F
$IPTABLES -t mangle -F
$IPTABLES -X
}

resetrules

for c in $COUNTRY
do
        country_file=$c.zone

        IPS=$($EGREP -v "^#|^$" $country_file)
        for ip in $IPS
        do
            echo "blocking $ip"
            $IPTABLES -A INPUT -s $ip -j DROP
        done
done
iptables-save
exit 0
```

## 使用ipset添加ip集合

发现用iptables直接添加ip实在低效，可以用其扩展ipset直接添加一个集合。

什么是IP集?

这时候就是IP集登场了。IP集是一个内核特性，它允许多个（独立）IP地址、MAC地址或者甚至是端口号被编码和有效地存储在位图/哈希内核数据结构中。一旦IP集创建之后，你可以创建一条iptables规则来匹配这个集合。

你马上就会看见IP集合的好处了，它可以让你用一条iptable规则匹配多个ip地址！你可以用多个IP地址和端口号的方式来构造IP集，并且可以动态地更新规则而没有性能影响。
在Linux中安装IPset工具

为了创建和管理IP集，你需要使用称为ipset的用户空间工具。

要在Debian、Ubuntu或者Linux Mint上安装：

`$ sudo apt-get install ipset`

Fedora或者CentOS/RHEL 7上安装：

`$ sudo yum install ipset`

使用IPset命令禁止IP

让我通过简单的示例告诉你该如何使用ipset命令。

首先，让我们创建一条新的IP集，名为banthis（名字任意）：

`$ sudo ipset create banthis hash:net`

第二个参数(hash:net)是必须的，代表的是集合的类型。IP集有多个类型。hash:net类型的IP集使用哈希来存储多个CIDR块。如果你想要在一个集合中存储单独的IP地址，你可以使用hash:ip类型。

一旦创建了一个IP集之后，你可以用下面的命令来检查：

`$ sudo ipset list`

这显示了一个可用的IP集合列表，并有包含了集合成员的详细信息。默认上，每个IP集合可以包含65536个元素（这里是CIDR块）。你可以通过追加"maxelem N"选项来增加限制。

`$ sudo ipset create banthis hash:net maxelem 1000000`

现在让我们来增加IP块到这个集合中：

`$ sudo ipset add banthis 1.1.1.1/32`
`$ sudo ipset add banthis 1.1.2.0/24`
`$ sudo ipset add banthis 1.1.3.0/24`
`$ sudo ipset add banthis 1.1.4.10/24`

这一步可以使用shell脚本自动添加

你会看到集合成员已经改变了。

`$ sudo ipset list`

现在是时候去创建一个使用IP集的iptables规则了。这里的关键是使用"-m set --match-set "选项。

现在是时候去创建一个使用IP集的iptables规则了。这里的关键是使用"-m set --match-set "选项。

现在让我们创建一条让之前那些IP块不能通过80端口访问web服务的iptable规则。可以通过下面的命令：

`$ sudo iptables -I INPUT -m set --match-set banthis src -p tcp --destination-port 80 -j DROP`

如果你愿意，你可以保存特定的IP集到一个文件中，以后可以从文件中还原：

`$ sudo ipset save banthis -f banthis.txt`
`$ sudo ipset destroy banthis`
`$ sudo ipset restore -f banthis.txt`

## 自用脚本

```shell
#!/bin/bash
EGREP=/bin/egrep

con_file=$1.zone
ipset=$1ip
wget http://www.ipdeny.com/ipblocks/data/countries/$con_file
ipset creat $ipset hash:net    
IPS=$($EGREP -v "^#|^$" $con_file)
for ip in $IPS
do
    ipset add $ipset $ip
done
rm $con_file
iptables -I INPUT -m set --match-set $ipset src -p tcp --destination-port 6666 -j DROP
iptables-save

exit 0
```

## 参考文章：

[在Linux下实现批量屏蔽IP地址的方法][2]

  [1]: http://www.ipdeny.com/ipblocks/
  [2]: https://www.jb51.net/LINUXjishu/339309.html