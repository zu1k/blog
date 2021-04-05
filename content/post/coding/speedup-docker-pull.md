---
title: 加速docker pull
tags:
  - docker
  - proxy
categories:
  - docker
date: 2020-03-08 21:16:07
---

## 为docker设置代理

环境是在centos下，如果没有新建下面这个文件夹

```shell
sudo mkdir -p /etc/systemd/system/docker.service.d
```

之后新建下面这个文件走http代理

```shell
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

填入

```shell
[Service]
Environment="HTTP_PROXY=http://192.168.88.10:7890/"
```

编辑下面这个文件走https代理

```shell
vim /etc/systemd/system/docker.service.d/https-proxy.conf
```

修改为

```shell
[Service]
Environment="HTTPS_PROXY=https://proxy.example.com:443/"
```

之后你使用docker pull的时候就可以pull gcr.io上的镜像了

https://juejin.im/post/5cc7b53c51882525124126f1  
https://docs.docker.com/config/daemon/systemd

## 换国内源

创建或修改 `/etc/docker/daemon.json`

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://u8rbddql.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://mirror.ccs.tencentyun.com",
        "https://registry.docker-cn.com"
    ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

https://juejin.im/post/5cd2cf01f265da0374189441
