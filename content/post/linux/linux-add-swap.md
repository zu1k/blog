---
title: Linux添加swap
tags:
  - linux
  - swap
categories:
  - coding
date: 2020-04-12 20:38:26
---

给 linux 服务器添加swap做了好几次了，每一次都没记住，临时去网上查命令，这里特地记录一下

## 查看当前swap

```bash
sudo swapon --show
```

如果没有输出说明没有swap

也可以通过free命令来查看

```bash
free -h
```

## 添加swap

添加swap基本步骤： 创建一个大文件 -> 初始化文件为swap交换文件格式 -> 启用这个文件

### 创建大文件

先找一个剩余空间大点的地方创建一个大文件，这里以1G的大小为例，一般swap空间大小以真实物理内存1-2倍大小

```bash
# 我喜欢用的方法，速度快
sudo fallocate -l 1G /swapfile
# 如果没有安装可以用dd命令，比较慢
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
```

修改文件的权限

```bash
sudo chmod 600 /swapfile
```

### 初始化文件

创建完文件后需要将文件进行初始化，标记为swap文件格式

```bash
sudo mkswap /swapfile
```

### 启用swap

接下来使用 命令启用这个swap交换文件

```bash
sudo swapon /swapfile
```

要让创建好的 swap 分区永久生效，可以将 swapfile 路径内容写入到 `/etc/fstab` 文件当中：

```bash
/swapfile swap swap defaults 0 0
```

### 检查

用一开始的命令检查一下swap是否启用正常

## 移除SWAP分区

根据添加的顺序反着来就行： 取消swap -> 删除swap分页文件

### 取消swap

首先输入以下命令停用 SWAP 空间：

```bash
sudo swapoff -v /swapfile
```

在 `/etc/fstab` 文件中删除有效 swap 的行。

### 删除文件

最后执行以下命令删除 swapfile 文件：

```bash
sudo rm /swapfile
```

## 调整Swappiness值

Swappiness 是一个 Linux 内核属性，用于定义 Linux 系统使用 SWAP 空间的频率。Swappiness 值可以从 0 至 100，较低的值会让内核尽可能少的使用 SWAP 空间，而较高的值将让 Linux Kernel 能够更加积极地使用 SWAP 分区。

Ubuntu 18.04 默认的 Swappiness 值为 60，您可以使用如下命令来查看：

```bash
cat /proc/sys/vm/swappiness
```

值为 60 对于 Ubuntu 18.04 桌面还算行，但对于 Ubuntu Server 来说，SWAP 的使用频率就比较高了，所以您可能需要设置较低的值。例如，要将 swappiness 值设置为 40，请执行：

```bash
sudo sysctl vm.swappiness=40
```

如果要让设置在系统重启后依然有效，则必要在 /etc/sysctl.conf 文件中添加以下内容：

```bash
vm.swappiness=40
```

最佳 swappiness 值取决于您系统的工作负载以及内存的使用方式，您应该以小增量的方式来调整此参数，以查到最佳值。
