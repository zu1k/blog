# Linux Shell中的重定向


经常会看到别人的shell脚本后面有一个 `2>&1` ，一直没去深究，今天这个话题就以这个为出发点进行展开，学习一下linux shell中重定向的话题。

## 特殊的东西

先来看一点linux中特殊的东西，为后面的内容打下基础

### 特殊的文件

- `/dev/null` 空，可以将垃圾内容导入其中，就会消失
- `/dev/zero` 零，可以从中读出无穷无尽的0
- `/dev/urandom` 随机数，可以从中读出无穷无尽的随机数
- `/dev/stdin` 标准输入流
- `/dev/stdout` 标准输出流
- `/dev/stderr` 标准错误输出流

我们可以看到后三个文件其实是个链接，指向内核的文件描述符 0\1\2

```bash
lrwxrwxrwx 1 root root         15 Mar 24 16:20 stderr -> /proc/self/fd/2
lrwxrwxrwx 1 root root         15 Mar 24 16:20 stdin -> /proc/self/fd/0
lrwxrwxrwx 1 root root         15 Mar 24 16:20 stdout -> /proc/self/fd/1
```

### 特殊的文件描述符

在Linux shell中有三个特殊的文件描述符（`File descriptor` or `fd`）:

- fd`0` 是标准输入: `stdin`
- fd`1` 是标准输出: `stdout`
- fd`2` 是标准错误输出: `stderr`

通过这三个特殊的文件描述符我们可以控制输入输出流

## 重定向

我们经常会接触到 `>` 这个符号，叫做重定向，其实还有另一个符号 `>>` 有着类似的功能，他们之间有一点小区别：

- `>` 是覆盖的方式
- `>>` 是追加的方式

> 下面的内容将全部以 `>` 为例，`>>` 除了内容是追加之外没有其他区别，就不赘述

## 使用重定向

### 重定向到文件

先来看一下最基本的重定向的使用方法，我们将 `echo` 命令的输出重定向到一个文件中

`echo "hello" > a.txt`

执行结果：

```bash
root@ubuntu:~# echo "hello" > a.txt
root@ubuntu:~# cat a.txt
hello
```

这里是将 **stdout** 重定向到文件 **a.txt** 中，与下面的命令等价

`echo "hello" 1> a.txt`

执行结果：

```bash
root@ubuntu:~# rm a.txt
root@ubuntu:~# echo "hello" 1> a.txt
root@ubuntu:~# cat a.txt
hello
```

这里我们看到重定向符号 `>` 默认是将 `stdout` 也就是 fd`1` 重定向到别处

如果我们想要将标准错误输出`stderr`进行重定向，只需要将上面命令中的文件描述符`1`修改为标准错误输出的文件描述符`2`即可

### 重定向到文件描述符

有些情况下 `stderr` 是会被程序控制写入错误日志的，如果我们想要在命令运行的时候将错误显示在屏幕上，就需要将错误输出重定向到标准输出流中

我们先来尝试一下, 这里我们没有找到一个合适的命令，就拿 `ls` 命令查看一个不存在的目录，这样会产生错误输出

>这里错误默认是会被输出到屏幕的，只是我暂时没有找到一个更好的程序，我们先假设他不会输出到屏幕

`ls error 2>1`

这里我们的猜想是将 `stderr` 重定向到 `stdout`, 所以写了 `2>1`, 我们来看一下会不会成功？

```bash
root@ubuntu:~# ls error 2>1
root@ubuntu:~#
root@ubuntu:~# ls
1
root@ubuntu:~# cat 1
ls: cannot access 'error': No such file or directory
```

我们看到了，并没有输出，而是在当前目录下生成了一个文件 `1`, 这说明如果我们只写 `>1` 会被当做重定向到文件 `1` 中

此时，我们的 `&` 就要上场了

`>&` 是将一个流重定向到一个文件描述符的语法，所以刚刚我们应该指明要重定向到 fd`1`, 也就是 `&1`

`ls error 2>&1`

执行结果：

```bash
root@ubuntu:~# ls error 2>&1
ls: cannot access 'error': No such file or directory
```

> 到这里我们就可以自主发挥了

将标准输出重定向到标准错误输出

`echo "hello" 1>&2` or `echo "hello" >&2`

甚至我们可以玩点复杂的

`(echo "hello" >&9) 9>&2 2>&1`

```bash
root@ubuntu:~# (echo "hello" >&9) 9>&2 2>&1
hello
```

这里的文件描述符`9`会自动生成，但是去除括号就会提示错误了

```bash
root@ubuntu:~# echo "hello" >&9 9>&2 2>&1
bash: 9: Bad file descriptor
```

在 bash >4.0 的版本中，又出了新的重定向语法

```bash
$ ls -ld /tmp /tnt 2> >(sed 's/^/E: /') > >(sed 's/^/O: /')
O: drwxrwxrwt 17 root root 28672 Nov  5 23:00 /tmp
E: ls: cannot access /tnt: No such file or directory
```

> 这种写法我还没有学习，等我后面学会了再进行更新

### 格式化输出

来点高端点的用法

用于格式化输出, 将标准输出和错误输出两个流重定向到不同的处理中，最后汇总

`((ls -ld /tmp /tnt |sed 's/^/O: /' >&9 ) 2>&1 |sed 's/^/E: /') 9>&1| cat -n`

```bash
root@ubuntu:~# ((ls -ld /tmp /tnt |sed 's/^/O: /' >&9 ) 2>&1 |sed 's/^/E: /') 9>&1| cat -n
     1  O: drwxrwxrwt 1 root root 4096 Mar 22 18:59 /tmp
     2  E: ls: cannot access '/tnt': No such file or directory
```

相同作用的新版语法

`cat -n <(ls -ld /tmp /tnt 2> >(sed 's/^/E: /') > >(sed 's/^/O: /'))`

```bash
root@ubuntu:~# cat -n <(ls -ld /tmp /tnt 2> >(sed 's/^/E: /') > >(sed 's/^/O: /'))
     1  O: drwxrwxrwt 1 root root 4096 Mar 22 18:59 /tmp
     2  E: ls: cannot access '/tnt': No such file or directory
```

### 合并文件

将输出文件 m 和 n 合并: `n >& m`

将输入文件 m 和 n 合并: `n <& m`

### 输入边界

将开始标记 tag 和结束标记 tag 之间的内容作为输入: `<< tag`

例如：

```bash
root@ubuntu:~# wc -l << EOF
    document line 1
    document line 2
    document line 3
EOF
3 //表明收到3行输入
```

它的作用是将两个 EOF 之间的内容(document) 作为输入传递给 command。

> 注意：
>
> - 结尾的delimiter 一定要顶格写，前面不能有任何字符，后面也不能有任何字符，包括空格和 tab 缩进
> - 开始的delimiter前后的空格会被忽略掉

## 有关覆盖

如果我们用 `set -o noclobber` 设置bash，那bash将不会覆盖任何已经存在的文件，但是我们可以通过 `>|` 绕过这个限制

**先来看一下默认的情况**

```bash
root@ubuntu:~# testfile=$(mktemp /tmp/testNoClobberDate-XXXXXX)
root@ubuntu:~# date > $testfile ; cat $testfile
Tue 24 Mar 2020 05:05:53 PM CST
root@ubuntu:~# date > $testfile ; cat $testfile
Tue 24 Mar 2020 05:05:56 PM CST
root@ubuntu:~# date > $testfile ; cat $testfile
Tue 24 Mar 2020 05:06:13 PM CST
```

如预期的一样，每一次重定向都覆盖了原文件

**下面我们设置 `noclobber` 标志**

`set -o noclobber`

然后重复上面的操作试一下

```bash
root@ubuntu:~# date > $testfile ; cat $testfile
bash: /tmp/testNoClobberDate-yKVkaY: cannot overwrite existing file
Tue 24 Mar 2020 05:06:13 PM CST
root@ubuntu:~# date > $testfile ; cat $testfile
bash: /tmp/testNoClobberDate-yKVkaY: cannot overwrite existing file
Tue 24 Mar 2020 05:06:13 PM CST
```

我们看到了bash的提示，不能覆盖已存在的文件，实际结果也是一样

如何进行绕过呢? 我们来试一下用 `>|` 代替 `>`

```bash
root@ubuntu:~# date >| $testfile ; cat $testfile
Tue 24 Mar 2020 05:10:45 PM CST
root@ubuntu:~# date >| $testfile ; cat $testfile
Tue 24 Mar 2020 05:10:49 PM CST
```

我们发现此时可以覆盖已经存在的文件，我们查看一下目前的设置

```bash
root@ubuntu:~# set -o | grep noclobber
noclobber       on
```

`noclobber` 的确是开启的，所以 `>|` 的确可以绕过这一限制

使用 `set +o noclobber` 关闭这个限制，防止对我们后面的使用造成影响

```bash
root@ubuntu:~# set +o noclobber
root@ubuntu:~# set -o | grep noclobber
noclobber       off
root@ubuntu:~# rm $testfile
```

## 其他的小点

### 重定向到一处

如果我们要将 `stdout` 和 `stderr` 重定向到同一个地方，该怎么写呢？

下面两种哪种是对的？

1. `ls -ld /tmp /tnt 2>&1 1>a.txt`
2. `ls -ld /tmp /tnt 1>b.txt 2>&1`

验证一下

**第一种写法**

```bash
root@ubuntu:~# ls -ld /tmp /tnt 2>&1 1>a.txt
ls: cannot access '/tnt': No such file or directory
root@ubuntu:~# cat a.txt
drwxrwxrwt 1 root root 4096 Mar 24 17:15 /tmp
```

**第二种写法**

```bash
root@ubuntu:~# ls -ld /tmp /tnt 1>b.txt 2>&1
root@ubuntu:~# cat b.txt
ls: cannot access '/tnt': No such file or directory
drwxrwxrwt 1 root root 4096 Mar 24 17:15 /tmp
```

我们可以看到第二种写法是正确的

同理，下面这种写法也正确

`ls -ld /tmp /tnt 2>b.txt 1>&2`

### 套个娃a

来点奇葩的，如果我们将 `stderr` 重定向到 `stdout`, 同时又将 `stdout` 重定向到 `stderr` 会发生什么？

如此套娃会不会导致回环卡死？

试一下

```bash
root@ubuntu:~# ls -ld /tmp /tnt 2>&1 1>&2  | sed -e s/^/++/
++ls: cannot access '/tnt': No such file or directory
++drwxrwxrwt 1 root root 4096 Mar 24 17:15 /tmp
```

我们发现都会从标准输出出来

反过来呢？

```bash
root@ubuntu:~# ls -ld /tmp /tnt 1>&2 2>&1  | sed -e s/^/++/
ls: cannot access '/tnt': No such file or directory
drwxrwxrwt 1 root root 4096 Mar 24 17:15 /tmp
```

我们发现都没有从标准输出出来，都是从标准错误输出出来的

> 也就是说 `a>&b b>&a` 这种套娃写法中， b才是出口

## 阅读更多内容

如果你想了解功能，通过下面的命令查看官方文档吧

`man -Len -Pless\ +/^REDIRECTION bash`

本文的参考资料： [stack overflow](https://stackoverflow.com/questions/818255/in-the-shell-what-does-21-mean)

