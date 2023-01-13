---
title: "使用 TUN 的模式"
date: 2022-03-22T22:01:18+08:00
summary: TUN 是内核提供的三层虚拟网络设备，被众多 VPN 和 代理软件采用。本文介绍代理软件处理 TUN 数据的两种模式，并介绍如何避免产生路由环路。
tags:
- coding
- tun
- proxy
categories:
- coding
keywords:
- coding
- tun
- proxy
- cgroup
- route
toc: true
mermaid: true
---

**TUN** 是内核提供的三层虚拟网络设备，由软件实现来替代真实的硬件，相当于在系统网络栈的三层(网络层)位置开了一个口子，将符合条件(路由匹配)的三层数据包交由相应的用户空间软件来处理，用户空间软件也可以通过TUN设备向系统网络栈注入数据包。可以说，TUN设备是用户空间软件和系统网络栈之间的一个通道。

> **TAP** 是二层(以太网)虚拟网络设备，处理的是以太帧，更加底层可以拿到更多信息，但不在本文的讨论范围。

我们想要利用TUN来做一些事情，实际上就是要编写一个用户态程序，拿到 TUN 设备句柄，向其写入序列化的IP数据包，从中读取数据并还原成IP数据包进行处理，必要时需要取出其payload继续解析为相应传输层协议。

通常使用 TUN 技术的是 VPN 和代理程序，然而这两类程序在对待 TUN 中传递的 IP 数据包时通常有不同的行为：

- **VPN** 通常做**网络层**的封装：将拿到的 IP 包进行加密和封装，然后通过某个连接传输到另一个网络中，在解封装和解密后，将 IP 包发送到该网络。在这个过程中，对 IP 包本身的修改是非常小的，不会涉及到整体结构的变动，通常仅会修改一下源 IP 和目标 IP ，做一下 NAT。

- **代理程序** 通常是**传输层**的代理：在从 TUN 设备拿到 IP 包后，需要继续解析其 payload，还原出 TCP 或者 UDP 结构，然后加密和封装传输层 (TCP或UDP) 的 payload。网络层的 IP 和传输层的端口信息通常会作为该连接的元数据进行处理，使用额外的加密和封装手段。

简单来说，VPN 不需要解析 IP 包的 payload，而代理程序需要解析出传输层信息并处理，特别是像 TCP 这样复杂的协议，对其处理更是需要非常小心和严谨。对于代理程序这样的需求，如果我们使用 TUN 技术，通常有两种模式：在用户态实现网络栈，或者直接利用操作系统网络栈实现。

## 用户态网络栈

第一种选择是在用户态实现网络栈，这是不小的工程啊，特别是实现 TCP 协议，因为其协议非常复杂，实现起来有很多细节需要注意，所以自己实现非常容易犯错。所以我们一般会直接找现成的实现来用，现有不少比较成熟且高效的实现，我相信肯定比我自己写的要好几个数量级。

### 网络栈实现

- 如果使用 **C** 语言，[**lwIP**](https://savannah.nongnu.org/projects/lwip/) 是一个非常不错的选择，由瑞典计算机科学研究所科学院开源，这是一个轻量级的 TCP/IP 栈实现，在占用超少内存的情况下，实现了完整的 TCP，被广泛应用到嵌入式设备中，稳定性有保证。同时，lwIP 有很多其他语言的绑定，包括 go 和 rust，这使我们在使用其他语言开发时也可以选择 lwIP 作为用户态网络栈实现。

- 如果选择使用 **Go** 语言开发 TUN 的用户态程序(其实这也是大多数人的选择)，可以选择 Google 开源的 [**gVisor**](https://github.com/google/gvisor/tree/master/pkg/tcpip) 中的实现，gVisor项目目的是为容器提供自己的应用程序内核，其中 tcpip 的实现有 Google 背书，质量有保证。

- 如果选择使用 **Rust** 进行开发，我们的选择就会困难一点，并没有一个饱经风霜、经过时间检验的实现，在广泛对比之后我推荐 [**smoltcp**](https://github.com/smoltcp-rs/smoltcp)，这是为裸机实时系统开发的独立的、事件驱动的 TCP/IP 栈，其设计目标是简单和健壮，应该可以信任吧。

- 当然，我觉得还有一个可以期待的实现，就是 Google 为 Fuchsia 操作系统开发的 [**Netstack3**](https://cs.opensource.google/fuchsia/fuchsia/+/master:src/connectivity/network/netstack3/)，之前是由 Go 实现的，不过现在 Google 用 Rust 重新实现了一个新的，谷歌背书，可以期待。

### 使用流程

在看完可供选择的实现后，我们来看一下在用户空间实现的网络栈如何使用。虽然不同在不同实现下，各个库有不同的编程接口和使用方法，但基本的思路都是一致的，这里我们便仅讨论基本使用流程。

#### 基本思路

从原理上来讲，用户态网络栈就是要不断通过协议解析，从 IPv4 数据包中不断解析出 TCP 流中的载荷数据；将传输层载荷通过不断的协议封装，拿到最终的 IPv4 数据包。

**从 TUN 往外读**

从 TUN 设备所对应的句柄中读出了一段字节序列，便是需要处理的IP数据包，一般是 IPv4 协议，不过还是需要先根据字节序列的第一个字节进行判断。

如果判断为 IPv4 包，就将整个字节序列扔到 IPv4 的 Packet Parser 实现中，还原出 IPv4 数据包结构。根据 IPv4 Header 中的 protocol 字段，判断 payload 应该使用哪个上层协议解析。[rfc791](https://datatracker.ietf.org/doc/html/rfc791#page-11)

一般仅需要处理 ICMP、TCP、UDP 这三种协议，拿 TCP 为例，只需要将 IPv4 的 payload 扔到 TCP 的 Parser 中，即可取出我们想要的传输层载荷。（实际情况当然没有说的这么简单）

**向 TUN 写数据**

写的过程其实就是读的过程反过来，拿到的是某个传输层协议的 payload，就拿UDP为例，根据该数据报的元信息，构建出完整的 UDP Header，然后将 payload 内容拼接进去。

接下来构建 IPv4 Header，然后将 UDP 报文拼接进 IPv4 payload 中。在拿到 IPv4 数据包后，即可序列化为字节序列，写入 TUN 句柄了。

#### 实际使用

上面的读、写过程看起来简单，但实际需要考虑的东西非常多，包括但不限于分片、丢包、重传、流量控制等等，TCP 作为一个极其复杂的传输层协议，有巨多情况需要考虑，很明显用上面的基本思路是非常繁琐并且难以使用的。

众多用户态网络栈肯定考虑到了这一点，实现都提供了非常友好且直接的接口，可以直接创建一个 TCP/IP 网络栈实例，拿到两个句柄，一端负责读取和写入网络层 IP 数据包，另一端负责接收和写入传输层载荷，中间的复杂转换关系和特殊情况都被内部屏蔽掉了。

## 操作系统网络栈

根据我们的需求，实际就是在 IPv4 和 TCP payload 之间进行转换，而操作系统的网络栈正好就有这个功能，我们无法简单的直接使用操作系统的网络栈代码，但是可以想办法复用操作系统网络栈提供的功能。TUN 在网络层已经打开了一个口子，还需要在传输层也打开一个口子，其实可以利用操作系统提供的 socket。

我们使用操作系统提供的 Socket 创建一个传输层的 Listener，将某个 IPv4 数据包的目标 IP 和目标端口修改为我们监听的 IP 和端口，然后通过 TUN 将该 IPv4 数据包注入到操作系统的网络栈中，操作系统就会自动的进行相应的解析，并将所需要的传输层 payload 通过前面创建的 Socket 发送给 Listener，由此便利用操作系统网络栈完成了 “往外读” 的操作。

对于“向里写”的操作，只需要向刚刚创建的传输层连接句柄写入即可，操作系统的网络栈同样会进行相应的封包，最后形成 IPv4 数据包。很明显，需要考虑反向的数据包，当向传输层连接的句柄中写入数据、操作系统的网络栈封包时，源 IP 和源端口会被视为新的目标 IP 和目标端口，因为我们需要使返回的 IPv4 数据包能够被 TUN 接口捕获到，在上面步骤中就不能只修改目标 IP 和目标端口，同时还要修改源 IP 和源端口，源 IP 应该限制为 TUN 网段中的 IP。

### 工作流程

在利用操作系统网络栈时，通常是以下步骤，这里拿 TCP 协议举例。

在我们的例子中， TUN网络的配置为 `198.10.0.1/16`，主机IP为 `198.10.0.1`，代理客户端监听 `198.10.0.1:1313`，App想要访问 `google.com:80`，自定义的DNS服务返回`google.com`的 Fake IP `198.10.2.2`。

**1. Proxy 创建 TCP Socket Listener**

这里首先要在系统网络栈的传输层开个口子，创建一个 TCP Socket Listener，监听 `198.10.0.1:1313`

**2. 某 App 发起连接**

当某需要代理的App发起连接，访问 `google.com:80`，我们通过自定义的 DNS 服务返回一个 Fake IP (`198.10.2.2`)，使流量被路由到 TUN 设备上。

> 当然这里也可以不使用 Fake IP 方式来捕获流量，通过配置路由规则或者流量重定向也可以将流量导向 TUN 设备，不过 Fake IP 是最常用的方法，所以这里以此举例。

{{< mermaid >}}
sequenceDiagram
    App->>Kernel: TCP connect( 198.10.2.2:80 )<br>198.10.0.1:34567 -> 198.10.2.2:80
{{< /mermaid >}}


**3. 将 TUN 读取到的 IPv4 解析为 TCP 载荷数据**

TUN 设备捕获到流量，也就是 IPv4 数据包，在读取出来后，需要利用系统网络栈解析出 TCP 载荷数据。

这一步，需要将读取到的IPv4数据包进行修改，也就是我们上面说的 源IP、源端口，目标IP和目标端口，还有相应的 checksum 也需要重新计算。修改的目的是让 IPv4 数据包通过 TUN 注入到操作系统网络栈后，能够被正确路由并通过一开始监听的TCP Socket将最里层的 TCP payload 返还给我们。

{{< mermaid >}}
sequenceDiagram
    autonumber
    participant Proxy
    participant Kernel
    Kernel->>Proxy: TUN read IPv4
    Note left of Proxy: 198.10.0.1:34567 -> 198.10.2.2:80
    Proxy->>Proxy: Modify src_ip:src_port, dst_ip:dst_port
    Note left of Proxy: 198.10.2.2:80 -> 198.10.0.1:1313
    Proxy->>+Kernel: TUN write IPv4
    Note right of Kernel: System NetStack process
    Kernel->>-Proxy: TCP Socket read<br>198.10.0.1:1313
    Note left of Proxy: Got TCP payload<br>And peer_addr as src_ip:src_port
{{< /mermaid >}}

这里为了方便，直接将源 IP 和源端口设置为初始的目标 IP 和目标端口，在实际编程时，有更多的设置策略，也就是 NAT 策略。

**4. 代理客户端请求代理服务器**

此时代理客户端已经拿到了请求的真实 TCP 载荷，并且可以通过获取 TCP 连接的 peer 信息得到在第3步修改的源 IP 和源端口，通过这些信息可以通过查 NAT 表得到 App 真正想要访问的 IP 和 端口（甚至可以通过查 DNS 请求记录拿到域名信息），因此代理客户端可以根据自己的协议进行加密和封装等操作，然后发送给代理服务端，由代理服务端进行真实的请求操作。

{{< mermaid >}}
sequenceDiagram
    participant Proxy Client
    participant Proxy Server
    participant Google
    Note left of Proxy Client: Wrap request<br> with connection meta info
    Proxy Client->>Proxy Server: Wrapped Request
    Proxy Server->>Google: Request
    Google->>Proxy Server: Response
    Proxy Server->>Proxy Client: Wrapped Response
    Note left of Proxy Client: Unwrap response
{{< /mermaid >}}

**5. 将返回数据封包回 IPv4 并写入 TUN**

通过代理客户端与代理服务端、代理服务端与谷歌的通信，拿到谷歌真正的返回数据，现在需要重新封装回 IPv4 数据包，还是利用系统网络栈：将数据写入 TCP Socket (`198.10.0.1:1313`) 中，便可以在 TUN 侧拿到封装好的 IPv4，就是这么轻松。

{{< mermaid >}}
sequenceDiagram
    participant Proxy
    participant Kernel
    Proxy->>+Kernel: TCP Socket write payload<br>198.10.0.1:1313
    Note right of Kernel: System NetStack process
    Kernel->>-Proxy: TUN read IPv4
    Note left of Proxy: 198.10.0.1:1313 -> 198.10.2.2:80
    Proxy->>Proxy: Restore src_ip:src_port, dst_ip:dst_port
    Note left of Proxy: 198.10.2.2:80 -> 198.10.0.1:34567
    Proxy->>Kernel: TUN write IPv4
{{< /mermaid >}}

**6. App 拿到返回数据**

{{< mermaid >}}
sequenceDiagram
    participant App
    participant Kernel
    Note left of Kernel: 198.10.0.1:34567 <- 198.10.2.2:80
    Kernel->>App: TCP read payload
{{< /mermaid >}}

上面的过程便是利用操作系统网络栈完成 IPv4 到 TCP 载荷数据及其反方向转变的过程。通过这种办法，可以充分利用操作系统的实现，都是饱经检验，质量可靠，且满足各种复杂情况。但是也有缺点，数据需要拷贝多次，增加了性能损耗和延迟。

### NAT 策略

> 我这里想说的 NAT 策略不是指常说的那四种 NAT 类型，当然你可以去实现不同的NAT类型来满足各种各样的需求，但那是更深入的话题，不在本文讨论。

在刚刚的流程的第3步中，你应该发现对源 IP 和源端口的修改是有限制的，我们需要将 IP 限定为 TUN 网段，从而使返回的数据包可以重新被 TUN 设备捕获。但是这种限制是非常宽松的，在我们的例子对 TUN 设备网段的配置中，你有 2^16 个 IP 可供选择，每一个 IP 又有 2^16 个端口可供选择。

但是如果你仔细观察，你会发现上面的例子并没有充分利用这些资源，我们仅仅是将 Fake IP 作为源 IP、真实目标端口作为源端口，而这个 IP 的其他端口都被闲置了。同时我也在其他人写的某些程序中发现，他们仅选择一个 IP 设置为源 IP，通过合理的分配该 IP 的端口作为源端口，在这种情况下， TUN 网段中其余的 IP 资源就被浪费了。

以上两种 NAT 策略在个人电脑上没啥问题，但是如果代理客户端运行在网关上，网络中访问的 IP 数量超过网段中 IP 数量上限，或者 hash(ip:port) 数量超过端口总数(2^16)，就会难以继续分配 NAT 项。因此我们应该专门编写一个 NAT 管理组件，合理分配 IP 和端口资源，争取做到利用最大化。

## 防止环路

抛开事实不谈，如果我们想要代理全部流量，就是要通过路由规则将所有流量导向我们的 TUN 设备，这是很直观且朴素的想法，就像下面的命令一样单纯：

```
sudo route add -net 0.0.0.0/0 dev tun0
```

如果你真的这么写，你就会发现你上不了网了。这是因为出现了环路。

如果稍微思考一下，你就会发现，虽然我们想要代理所有流量，但是代理客户端与代理服务端的流量却是需要跳过的，如果用上面的路由，就会导致代理客户端发出的流量经过路由然后从 TUN 重新回到了代理客户端，这是一个死环，没有流量可以走出去。流量只近不出，来回转圈，你的文件打开数爆炸，操作系统不再给你分配更多的句柄，数据来回拷贝，你的CPU风扇猛转，电脑开始变卡。

这是我们不想看到的，需要采取一些措施避免环路的产生。在实践中有不少方法可以避免这种情况的发生，例如通过合理的配置路由规则，使连接代理服务器的流量可以顺利匹配到外部网络接口。只不过这种方法不够灵活，如果代理服务器 IP 发生变化则需要及时改变路由规则，非常麻烦，所以我们接下来介绍其他的方法。

### Fake IP

Fake IP 就是我们上面例子中用到的方法，这是一种限制进入流量的方法。基本思路是自己实现一个 DNS 服务器，对用户的查询返回一个假的 IP 地址，我们可以将返回的 IP 地址限制为 TUN 设备的网络段，这样应用发起的流量其实便是发给 TUN 网络的流量，自然的被路由匹配，而无需像前面那样路由全部的流量，其余的流量包括代理客户端发起的请求便不会被路由，可以保证不产生环路。

当代理客户端需要知道应用真正想要请求的地址时，就通过一些接口向自己实现的 DNS 服务器进行反向查询即可。

### 策略路由

通过前面的分析，可以发现产生环路是因为代理客户端本身发出的流量被系统路由到 TUN 设备导致的，因此我们可以想办法让代理客户端本身发起的流量不走 TUN 而是从真实的物理网络接口出去。

在 (类)Unix 系统中，可以对代理客户端的流量打上 fwmark 防火墙标记，然后通过策略路由使带有标记的流量走单独的路由表出去，从而绕过全局的流量捕获。

**cgroup**

`cgroup` 是 Linux 内核的功能，可以用来限制、隔离进程的资源，其中 `net_cls` 子系统可以限制网络的访问。在网络控制层面，可以通过 `class ID` 确定流量是否属于某个 cgroup，因此可以对来自特定 cgroup 的流量打上 fwmark，使其能够被策略路由控制。

我们可以创建一个用于绕过代理的 cgroup ，对该 cgroup 下进程的流量使用默认的路由规则，而不在该 cgroup 的其余进程的流量都要路由到 TUN 设备进行代理。

## 一些其他的知识

### TUN 与 TAP 的区别

TAP 在2层，读取和写入的数据需要是以太帧结构

TUN 在3层，读取和写入的数据需要是IP数据包结构

### IP 等配置

在给网卡配置IP时，其实是修改内核网络栈中的某些参数，而不是修改网卡。虽然网卡也会有一些可供修改的配置项，但一般情况是通过其他方法进行修改的(驱动程序)。

### 物理网卡与虚拟网卡的区别

物理网卡会有 **DMA** 功能，在启用 DMA 时网卡和网络栈(内存中的缓冲区)的通讯由 DMA 控制器管理，因此性能更高延迟也更低。

### 如何创建 TUN 设备

在Linux下一切皆文件，`/dev/net/tun` 是特殊的字符(char)设备文件，通过打开这个文件获得一个文件句柄，然后通过 `ioctl()` 系统调用对其进行配置。在这里可以选择打开TUN设备还是TAP设备，可以设置设备名称。

详见：[Network device allocation](https://www.kernel.org/doc/html/latest/networking/tuntap.html#network-device-allocation)

### 与 BPF 的关系

BPF 是一种高级数据包过滤器，可以附加到现有的网络接口，但其本身不提供虚拟网络接口。 TUN/TAP 驱动程序提供虚拟网络接口，可以将 BPF 附加到该接口。

## 扩展阅读

- https://www.kernel.org/doc/html/latest/networking/tuntap.html
- https://github.com/xjasonlyu/tun2socks
- https://github.com/eycorsican/go-tun2socks
- https://github.com/gfreezy/seeker
- https://github.com/shadowsocks/shadowsocks-rust
- https://www.wintun.net/
