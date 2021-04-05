# 编译gcc


> 一直用gcc编译各种东西，第一次研究如何编译gcc
> 这就是一个鸡生蛋与蛋生鸡的问题

## 依赖

编译gcc需要gmp、mpfr和mpc，还需要预先有一个已经能用的gcc

### 首先安装gmp

从 http://ftp.gnu.org/gnu/gmp/ 下载一个符合要求的稳定版本的gmp的源码  
这里我下载的是 http://ftp.gnu.org/gnu/gmp/gmp-5.0.1.tar.bz2

解压后从源码编译安装

```shell
tar jxf gmp-5.0.1.tar.bz2
cd gmp-5.0.1
sudo ./configure --prefix=/opt/gmp
sudo make
sudo make install
```

### 安装mpfr

从 http://ftp.gnu.org/gnu/mpfr/ 下载一个稳定版本  
我选择的是 http://ftp.gnu.org/gnu/mpfr/mpfr-3.1.4.tar.bz2

```shell
tar jxf mpfr-3.1.4.tar.bz2
cd mpfr-3.1.4
sudo ./configure --prefix=/opt/mpfr \
      --with-gmp-lib=/opt/gmp/lib \
      --with-gmp-include=/opt/gmp/include
sudo make
sudo make install
```

### 安装mpc

从 http://ftp.gnu.org/gnu/mpc/mpc-1.0.3.tar.gz 下载  
我选择的是http://ftp.gnu.org/gnu/mpc/mpc-1.0.3.tar.gz

```shell
tar zxf mpc-1.0.3.tar.gz
cd mpc-1.0.3
sudo ./configure --prefix=/opt/mpc \
      --with-gmp-lib=/opt/gmp/lib \
      --with-gmp-include=/opt/gmp/include \
      --with-mpfr-lib=/opt/mpfr/lib \
      --with-mpfr-include=/opt/mpfr/include
sudo make
sudo make install
```

> 上面依赖安装顺序不能错

后来听曹老师说可以用 apt 直接安装，血亏

```shell
sudo apt install libmpc-dev libmpfr-dev libgmp-dev libgmp3-dev
```

> 又一个后来，发现 gcc 源码中有脚本可以一键下载安装这些依赖

```shell
sh ./contrib/download_prerequisites
```

## 编译

然后进入gcc目录

配置编译配置

```shell
./configure \
  --enable-checking=release \
  --enable-languages=c,c++ \
  --disable-multilib
```

执行 `make -j8` 然后去喝功夫茶

