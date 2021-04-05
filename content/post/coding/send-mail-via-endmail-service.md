---
title: 通过Sendmail服务发送邮件
date: 2018-12-03 17:59:48
tags:
    - mail
    - php
categories:
    - coding
---

通过Sendmail服务发送邮件

系统centos7

需要开启25端口

<!--more-->

### 安装sendmail

```shell
yum  -y  install sendmail  sendmail-cf
```

### 安装MTA功能测试用软件

```shell
yum -y install  mailx   php
```

### 切换系统的邮件发送接口

```shell
alternatives --config mta
```

画面显示：

```shell
There are 2 programs which provide 'mta'.

Selection    Command
-----------------------------------------------
+ 1           /usr/sbin/sendmail.postfix
*  2           /usr/sbin/sendmail.sendmail

Enter to keep the current selection[+], or type selection number: 2
```

输入2后回车即把MTA功能切换到sendmail上，+号会显示在sendmail的行头。

### 配置sendmail

```shell
vi /etc/mail/sendmail.mc

DAEMON_OPTIONS(\`Port=smtp,Addr=127.0.0.1, Name=MTA\')dnl

把Addr的值从127.0.0.1修改为0.0.0.0，不限制使用MTA的IP。

m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf
生成正式的配置文件。
```

### 重启并测试功能

`reboot -f`

重启完成后确认MTA程序已经切换到sendmail

```shell
ps aux | grep sendmail

      root       1003  0.0  0.2  88688  2280 ?        Ss   10:40   0:00 sendmail: accepting connections
      smmsp      1018  0.0  0.1  84120  1912 ?        Ss   10:40   0:00 sendmail: Queue runner@01:00:00 for /var/spool/clientmqueue
      root       1141  0.0  0.0 112660   968 pts/1    R+   10:51   0:00 grep --color=auto sendmail

      sendmail的相关进程已经启动

ps aux | grep postfix

      root       1161  0.0  0.0 112660   968 pts/1    R+   11:04   0:00 grep --color=auto postfix

      postfix的相关进程都没有开启
```

### 用PHP函数发送邮件

```php
php -a

在PHP的交互界面下输入以下函数

mail('test@sohu.com', "Test email content", "sendmail title", null, "-f testname@sendmail.com");
```

* 使用PHP接口做测试的好处是可以随意指定发送方的邮件地址，即mail函数的最后一个参数。

即使系统的hostname未设置也可以正常发送出邮件。

### 使用linux的mail命令发送邮件

mail命令就没有使用自定义的邮件发送地址，而是使用HOSTNAME。

安装系统时由于没有对hostname做特别设置，HOSTNAME的值是默认的 localhost.localdomain

这样的邮件域名会被大多数邮箱如163，QQ拒收。

查看邮件发送log会发现以下错误

```shell
cat /var/log/maillog

      dsn=4.1.8, stat=Deferred: 450 4.1.8 <root@localhost.localdomain>: Sender address rejected: Domain not found
```

修改HOSTNAME

`vi  /etc/hosts`

在最后加上一行

`192.168.2.108  intest.com`

这里的IP地址是我跑sendmail虚拟机的IP，需根据实际情况设置

* 其实这个文件hosts只是用来设置本地路由表，但填上本机IP时，系统在启动初始化中查到本机IP在hosts中，就会用hosts文件中对应的域名来设置HOSTNAME。

重新启动

`reboot -f`

重启后发现本地的DNS配置文件etc/resolv.conf 已经被自动更新。

内容变成  `nameserver 192.168.2.1`

执行mail命令发送邮件

`echo "test mail content"|mail -s "Mail title" test@sohu.com`

----------

## 补充

### 切换系统的邮件发送接口

`alternatives --config mta`

* Postfix是Centos7系统默认自带。 也可以用命令 yum list installed | grep postfix 确认

选择postfix所在行的编号后回车

### 重启并测试功能

`reboot -f`

重启后查看进程看到postfix相关的进程已经启动

```shell
ps aux | grep postfix

      root       1093  0.0  0.2  89544  2172 ?        Ss   08:55   0:00 /usr/libexec/postfix/master -w
      postfix    1094  0.0  0.4  89648  4016 ?        S    08:55   0:00 pickup -l -t unix -u
      postfix    1095  0.0  0.4  89716  4044 ?        S    08:55   0:00 qmgr -l -t unix -u
      postfix    1237  0.0  0.4  89796  4072 ?        S    09:08   0:00 cleanup -z -t unix -u
      postfix    1238  0.0  0.4  89652  4024 ?        S    09:08   0:00 trivial-rewrite -n rewrite -t unix -u
      postfix    1239  0.0  0.4  89856  4272 ?        S    09:08   0:00 smtp -t unix -u
      root       1274  0.0  0.0 112660   972 pts/1    R+   09:09   0:00 grep --color=auto postfix
```


系统的hostname已经在sendmail配置的第六步中完成了配置，这里就直接使用PHP与mail命令

两种方法做测试。

```shell
php -a

mail('test@sohu.com', "Test email No1", "postfix mail", null, "-f test@ccfst.com");
* php的mail函数可以随意指定发送地址

echo "test mail"|mail -s "postfix mail title" test@sohu.com
```
