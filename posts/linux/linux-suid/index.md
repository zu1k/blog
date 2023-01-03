# 学习Linux中的SUID机制


## 什么是SUID

SUID简称位，英文全称是Set owner User ID up on execution，它是一种特殊的文件权限，能够让用户(如Bob)用其他用户(如root用户)的权限运行一个程序，而不需要用sudo进行临时提权

同一类的还有SGID，就不详细说了，原理与SUID一样，就以SUID为例

在一个程序执行的时候会有三个ID状态，在深入学习SUID之前必须能够区分下面三种ID：

- Real User ID
- Effective User ID
- Saved User ID

`Real User ID` 是执行这个程序的用户的真实ID，是已用户login时候的ID为准

`Effective User ID` 是程序执行过程中使用权限时真正起作用的用户ID，操作系统在检查一个程序有没有某个权限的时候会看这个ID

`Saved User ID` 是程序临时提权时需要保存的先前的用户ID，等提权结束后需要回退到这个用户ID

## SUID的作用

如果用户user2有另一个用户user1的程序的执行权限，并且user1给这个程序设置了SUID位，那么user2就可以用user1的权限来执行这个程序

简单来说，SUID能够让用户(如Bob)用其他用户(如root用户)的权限运行一个程序，而不需要用sudo进行临时提权

举个例子：

所有用户的密码保存在 `/etc/shadow` 文件中，但是这个文件只有root用户能够进行写操作

```bash
root@kali:~# ls -l /etc/shadow
-rw-r----- 1 root shadow 1639 Jan 27 12:50 /etc/shadow
```

那如果普通用户想要修改自己的密码，是否需要让root用户帮着修改呢？

显然不需要，修改密码用到了 `/usr/bin/passwd` 这个程序，我们来看一下它的权限

```bash
root@kali:~# ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 63944 Dec 20 10:39 /usr/bin/passwd
```

可以看到，这个程序的所有者是root用户，但是所有用户都有执行权限，并且设置了s位（怎么看出来的后面会说）

这样SUID机制就会在程序执行的时候发生作用，让普通用户可以用root权限修改`/etc/shadow`文件

SUID机制的存在使程序权限的控制更加方便，用户可以执行某个程序而不需要登录到程序拥有者的账号

## 如何使用SUID

### 查看SUID

通过命令 `ls -l` 即可看到文件的详细信息，包括权限表 `-rwxrwxrwx`

```bash
-   rwx   rwx   rwx

第一位是文件类型，-就是普通文件，d代表目录，l代表链接文件，还有一些其他类型的文件不详细说了

后面的9位可以分成三组，分别表示所有者权限、同组内用户权限，组外其他用户权限

每一组都有三位，r 代表有读取权限，w 代表有写入权限，x 代表有执行权限，如果是 _ 就代表没有相应的权限

如果文件所有者权限的 x 换成 s 就代表设置了SUID

同理如果组内用户权限的 x 换成了 s 就代表设置了SGID
```

### 设置SUID

使用 `chmod 4000 filename` 可以设置SUID位

使用 `chmod 2000 filename` 可以设置SGID位

使用 `chmod 6000 filename` 可以同时设置SGID和SUID位

> 注意: 2000\4000\6000都是不完整的权限，正常使用应该将000替换为相应的权限，例如 4755

### 取消SUID

使用 `chmod 755 filename` 可以取消SGID和SUID位

或者 `chmod u-s filename` or `chmod g-s filename` 也可以

## SUID提权

因为SUID位让程序在执行的时候有了所有者的权限，所以可以利用这点来提权

示例：

```bash
# 进入nmap的交互模式
nmap --interactive
# 执行sh，提权成功
!sh
```

详细介绍见： https://www.leavesongs.com/PENETRATION/linux-suid-privilege-escalation.html

## SUID在脚本中失效

假如user1用 `chmod 4777 /home/user1/script.sh` 命令给`script.sh`脚本设置SUID位，登录user2后执行这个脚本提示没有权限

这是因为SUID位只对编译过的可执行程序起作用，sh脚本的实际执行程序是sh或者bash之类，如果它们在执行的时候并不会检查脚本文件的SUID位，那就不会起作用了

Perl执行器会检查perl脚本的suid位，所以可以给pl脚本设置suid位

