---
title: 给git设置代理
tags:
  - proxy
  - github
  - git
categories:
  - coding
date: 2020-03-27 15:45:02
---

近期，Github的直连速度一直不理想，甚至被墙或者MITM，最好的解决办法就是挂代理

Git 可以使用四种不同的协议来传输资料：本地协议（Local），HTTP 协议，SSH（Secure Shell）协议及 Git 协议

而我们平时使用github一般使用两种协议，一种是http协议，另一种是ssh协议，针对这两种协议有两种不同的代理设置办法

## http协议

通常使用的链接形如：`https://github.com/git/git.git`

针对这种协议，代理设置比较简单

```bash
# http或https代理
git config --global https.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## ssh协议

通常使用的链接形如：`git@github.com:git/git.git` 或者 `ssh://[<username>@]<server>[:<port>]/path/repo.git`

对于使用ssh协议的库，上面的代理设置办法就失效了，需要给ssh设置socks代理

在 `~/.ssh/config` 文件中添加下面内容， 如果没有这个文件就新建

```bash
Host github.com
ProxyCommand nc -X 5 -x 127.0.0.1:1080 %h %p
```

这里使用的是nc命令，linux需要安装netcat(一般自带了)，windows需要单独下载

windows如果安装了`mingw`也可以使用`connect`命令来替代`nc`命令

```bash
Host github.com
ProxyCommand connect -S 127.0.0.1:1080 %h %p
```

> 补充： 详见 https://blog.lgf.im/2020/use-ucloud-globalssh-to-speedup-server-ssh.html
> 可以通过 GlobalSSH 的海外加速服务来加速github的访问，经过我的尝试效果还不错，可以跑到10Mbps
> 我用的域名为 `zll.us` ，大家可以拿去用，使用方法如下：

```bash
原命令
git clone git@github.com:moby/moby.git

替换后
git clone git@zll.us:moby/moby.git
```
