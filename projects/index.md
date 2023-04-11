# 我的项目


此页面介绍我做的一些项目和工具

## GitHub Trending 项目

我的以下 7 个项目曾进入过 GitHub Trending 排行榜

- [Nali](#nali): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fnali&type=code)
- [Book Searcher](#book-searcher): [archive 1](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+book-searcher-org%2Fbook-searcher&type=code)、[archive 2](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fzlib-searcher&type=code)
- [Copy Translator](#copy-translator): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fcopy-translator&type=code)
- [Good MITM](#good-mitm): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fgood-mitm&type=code)
- [ProxyPool](#proxypool): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fproxypool&type=code)
- [Telegram Keyword Bot](#telegram-keyword-bot): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Ftg-keyword-reply-bot&type=code)
- [Xray Cracker](#xray-cracker): [archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fxray-crack&type=code)

---

## Nali

<p>
  <a href="https://github.com/zu1k/nali/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/nali?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/nali/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/nali?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/nali/releases">
    <img src="https://img.shields.io/github/release/zu1k/nali?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/nali/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/nali?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/nali/releases">
    <img src="https://img.shields.io/github/downloads/zu1k/nali/total?style=flat-square">
  </a>
</p>

一个查询 IP 地理信息和 CDN 服务提供商的离线终端工具。

这个工具是受 nali 原版 C 版和 nali-cli Javascript 版本启发而开发的，在原有功能的基础上，完全重写了 wry IP 数据库解析模块，增加了更多 IP 数据库的支持，并添加了例如彩色输出等更多实用功能。

目前该工具已经上架 macOS Homebrew 和 Arch Aur 仓库，总下载量超过 20k 次。

此项目曾多次进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fnali&type=code)。

- 支持多种数据库
  - 纯真 IPv4 离线数据库
  - ZX IPv6 离线数据库
  - Geoip2 城市数据库 (可选)
  - IPIP 数据库 (可选)
  - ip2region 数据库 (可选)
  - DB-IP 数据库 (可选)
  - IP2Location DB3 LITE 数据库 (可选)
- CDN 服务提供商查询
- 支持管道处理
- 支持交互式查询
- 同时支持IPv4和IPv6
- 支持多语言
- 查询完全离线
- 全平台支持
- 支持彩色输出

https://github.com/zu1k/nali

---

## Book Searcher

<p>
  <a href="https://github.com/book-searcher-org/book-searcher/stargazers">
    <img src="https://img.shields.io/github/stars/book-searcher-org/book-searcher?style=flat-square">
  </a>
    <a href="https://github.com/book-searcher-org/book-searcher/network/members">
    <img src="https://img.shields.io/github/forks/book-searcher-org/book-searcher?style=flat-square">
  </a>
  <a href="https://github.com/book-searcher-org/book-searcher/releases">
    <img src="https://img.shields.io/github/release/book-searcher-org/book-searcher?style=flat-square">
  </a>
  <a href="https://github.com/book-searcher-org/book-searcher/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/book-searcher-org/book-searcher?style=flat-square">
  </a>
</p>

简单快速(最快)的图书搜索器，创建和搜索您的私人图书馆。性能极强，可以在一分钟内为超过 1000 万本书的元数据编制索引，并在 30µs 内进行搜索，同时保持极低的内存占用。

这个项目是在 zLibrary 域名被封杀的那段时间开发的，初衷是为 Anna 在 IPFS 中分享的书籍提供便捷快速的搜索功能。此项目原型我在一周之内完成，包括初期基于 tantivy 的索引程序、搜索后端和使用 Vue + Antd 开发的前端。项目开源后迅速得到社区反馈，并吸引了一批优秀的开发者参与进来，他们为该项目提供了各种改进和贡献，包括 CI\CD, 新的基于 React + Chakra UI 开发的前端, 基于 Tauri 实现的桌面版程序等重要贡献。此项目曾在一天以内登顶 Hacker News 热榜第一并吸引了众多讨论，曾登顶 GitHub Trending 全球排行榜第一名，并持续多日位列 GitHub Trending 排行榜首屏。该项目月活曾近百万人，月请求总数超 1500 万，全球部署实例超过 500 个。

此项目曾多次进入 GitHub Trending 排行榜，[archive 1](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+book-searcher-org%2Fbook-searcher&type=code)、[archive 2](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fzlib-searcher&type=code)。

https://github.com/book-searcher-org/book-searcher

Demo: https://zbook.lol/

---

## Copy Translator

<p>
  <a href="https://github.com/zu1k/copy-translator/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/copy-translator?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/copy-translator/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/copy-translator?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/copy-translator/releases">
    <img src="https://img.shields.io/github/release/zu1k/copy-translator?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/copy-translator/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/copy-translator?style=flat-square">
  </a>
</p>

使用Rust编写的，简单、轻量、好用的划词翻译软件，利用 DeepL 进行翻译。

该项目产生的原因是我在阅读论文时，发现现有的翻译器程序臃肿并体验不佳，便萌生了开发自己的划词翻译器的想法。我基于 egui 库开发了这个翻译器，得益于我之前逆向 DeepL 接口的经验，我的翻译器支持免费的 DeepL 翻译。在开发过程中，我发现 egui 库中的多个性能问题，向 egui 社区提起 issue 和 PR 协助他们进行完善。

此项目曾多次进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fcopy-translator&type=code)。

- 程序大小12MB，极其轻量
- 自动去除多余的换行和断句，优化PDF翻译体验
- 选中即翻译(划词翻译)，专注论文阅读
- 使用DeepL进行翻译，翻译效果极佳

https://github.com/zu1k/translator

---

## Good MITM

<p>
  <a href="https://github.com/zu1k/good-mitm/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/good-mitm?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/good-mitm/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/good-mitm?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/good-mitm/releases">
    <img src="https://img.shields.io/github/release/zu1k/good-mitm?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/good-mitm/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/good-mitm?style=flat-square">
  </a>
</p>

使用MITM技术提供 `rewrite`、`redirect`、`reject` 等功能

此项目曾多次进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fgood-mitm&type=code)。

- 基于 TLS ClientHello 的自动证书签署
- 支持选择性 MITM
- 基于 YAML 格式的规则描述语言：重写/阻断/重定向
  - 灵活的规则匹配器
    - 域名前缀/后缀/全匹配
    - 正则匹配
    - 多筛选器规则
  - 灵活的文本内容改写
    - 抹除/替换
    - 正则替换
  - 灵活的字典类型内容改写
    - HTTP Header 改写
    - Cookie 改写
  - 支持单条规则多个行为
- 支持 JavaScript 脚本规则 (编程介入)
- 支持透明代理
- 透明代理 HTTPS 和 HTTP 复用单端口
- 支持自动安装 CA 证书到系统信任区

https://github.com/zu1k/good-mitm

---

## Srun

<p>
  <a href="https://github.com/zu1k/srun/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/srun?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/srun/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/srun?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/srun/releases">
    <img src="https://img.shields.io/github/release/zu1k/srun?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/srun/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/srun?style=flat-square">
  </a>
</p>

Srun 深澜认证登录，超轻量、多平台，支持多拨、自动探测IP、指定网卡

该项目源于我校网速限速，我不得不考虑进行多拨，从而需要一个轻量、好用、支持多拨的深澜登录认证工具。通过逆向深澜的 Web 端登录认证代码，我使用 Golang 实现了一个版本，后来为了能够在存储拮据的路由器中使用，我使用 Rust 重写了该版本，并通过一系列措施尽可能的减小可执行程序的大小。在此过程中，我修改了 Rust 编译器的[编译和链接参数](https://github.com/zu1k/srun/blob/eab5c7b3f256ef0515f076118b701b9500b0c066/Cargo.toml#L15-L20)，分析了使用的 Rust 库在可执行文件中占用的大小，使用 `getopts` 替换了 `clap`，使用 `ureq` 替换了 `reqwest`，并根据实际使用场景关闭了 TLS 支持。为了能够使 `ureq` 支持网卡绑定，我通过 `socket2` 库扩展了 `ureq` 并向上游发起 [PR](https://github.com/algesten/ureq/pulls?q=is%3Apr+author%3Azu1k)。

https://github.com/zu1k/srun

https://zu1k.com/posts/tutorials/campus-network-speed-overlay/

---

## ProxyPool

<p>
  <a href="https://github.com/zu1k/proxypool/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/proxypool?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/proxypool/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/proxypool?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/proxypool/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/proxypool?style=flat-square">
  </a>
</p>

自动抓取tg频道、订阅地址、公开互联网上的ss、ssr、vmess、trojan节点信息，聚合去重后提供节点列表

此项目曾进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fproxypool&type=code)。

https://github.com/zu1k/proxypool

---

## Http Proxy IPv6 Pool

<p>
  <a href="https://github.com/zu1k/http-proxy-ipv6-pool/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/http-proxy-ipv6-pool?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/http-proxy-ipv6-pool/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/http-proxy-ipv6-pool?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/http-proxy-ipv6-pool/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/http-proxy-ipv6-pool?style=flat-square">
  </a>
</p>

Make every request from a separate IPv6 address.

```sh
$ while true; do curl -x http://127.0.0.1:51080 ipv6.ip.sb; done
2001:19f0:6001:48e4:971e:f12c:e2e7:d92a
2001:19f0:6001:48e4:6d1c:90fe:ee79:1123
2001:19f0:6001:48e4:f7b9:b506:99d7:1be9
2001:19f0:6001:48e4:a06a:393b:e82f:bffc
2001:19f0:6001:48e4:245f:8272:2dfb:72ce
```

https://github.com/zu1k/http-proxy-ipv6-pool

https://zu1k.com/posts/tutorials/http-proxy-ipv6-pool/

---

## Unified Clipboard

统一剪切板，局域网内多设备剪切板同步，这边复制，那边粘贴

局域网内通讯功能基于 libp2p 实现，利用 mDNS 协议进行设备发现，GossipSub 协议进行设备组区分和消息传递

**Supported Type**

- Text
- Image

**Supported OS**

- Windows
- Linux
- MacOS
- Android

https://github.com/zu1k/uniclip

---

## Telegram Keyword Bot

<p>
  <a href="https://github.com/zu1k/tg-keyword-reply-bot/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/tg-keyword-reply-bot?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/tg-keyword-reply-bot/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/tg-keyword-reply-bot?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/tg-keyword-reply-bot/releases">
    <img src="https://img.shields.io/github/release/zu1k/tg-keyword-reply-bot?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/tg-keyword-reply-bot/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/tg-keyword-reply-bot?style=flat-square">
  </a>
</p>

Telegram 关键词自动回复机器人: 根据群组管理员设定的关键词或者正则规则，自动回复文字、图片、文件或者进行永久禁言、临时禁言、踢出等群管操作

这是我学习 Golang 后的第一个项目，当时是某个考试周的周末，复习太无聊了，于是我就用了 2 天时间 Go 语言，然后便想要做个简单的项目练练手。
正巧当时我有一个几千人的 TG 群要管理，于是便萌生了写一个关键词自动回复的机器人来替我解答群友的提问。最初的版本功能非常简单，仅能回复确定的关键词，无法实时的添加和删除规则，但是机器人上线后群友反响不错，很快便被有同样需求的其他群组发现。
在此契机下，我便继续添加了各种必要的功能，使其成长为当时 TG 中文圈最受欢迎的自动群管机器人之一，管理群组数曾达到2万个。

此项目曾进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Ftg-keyword-reply-bot&type=code)。

https://github.com/zu1k/tg-keyword-reply-bot

---

## Hosts-rs

<p>
  <a href="https://github.com/zu1k/hosts-rs/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/hosts-rs?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/hosts-rs/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/hosts-rs?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/hosts-rs/releases">
    <img src="https://img.shields.io/github/release/zu1k/hosts-rs?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/hosts-rs/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/hosts-rs?style=flat-square">
  </a>
</p>

hosts文件解析，修改库，以及一些衍生

- hosts: Hosts file parsing, modification library
- [resolve-github](./resolve-github): Use Cloudflare DoH to resolve GitHub domains and generate hosts files
- [github-hosts](./github-hosts): Modify hosts to speed up GitHub access

https://github.com/zu1k/hosts-rs

---

## MITM Netflix VIP Unlocker

Share your Netflix VIP with your friends without evealing password and cookies.

---

## DeepL Free API

通过逆向DeepL客户端使用的协议，实现的免费DeepL API

<a href="https://hub.docker.com/r/zu1k/deepl">
  <img src="https://img.shields.io/docker/pulls/zu1k/deepl?style=flat-square">
</a>

`docker run -itd -p 8080:80 zu1k/deepl`

https://hub.docker.com/r/zu1k/deepl

---

## Beacon Hook Bypass Memscan

<p>
  <a href="https://github.com/zu1k/beacon_hook_bypass_memscan/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/beacon_hook_bypass_memscan?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/beacon_hook_bypass_memscan/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/beacon_hook_bypass_memscan?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/beacon_hook_bypass_memscan/releases">
    <img src="https://img.shields.io/github/release/zu1k/beacon_hook_bypass_memscan?style=flat-square">
  </a>
</p>

[cs bypass卡巴斯基内存查杀](https://xz.aliyun.com/t/9399) 的Rust实现

https://github.com/zu1k/beacon_hook_bypass_memscan

---

## go-service-ipfs

go-storage的IPFS存储后端支持

https://github.com/beyondstorage/go-service-ipfs

---

## PL0 Compiler

<p>
  <a href="https://github.com/zu1k/pl0compiler/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/pl0compiler?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/pl0compiler/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/pl0compiler?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/pl0compiler/releases">
    <img src="https://img.shields.io/github/release/zu1k/pl0compiler?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/pl0compiler/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zu1k/pl0compiler?style=flat-square">
  </a>
</p>

编译原理课程实验，勿用

简化版PL0语言的词法分析、语法分析、编译成中间代码，解释执行

https://github.com/zu1k/pl0compiler

---

## GitHub Hosts

<p>
  <a href="https://github.com/zu1k/github-hosts/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/github-hosts?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/github-hosts/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/github-hosts?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/github-hosts/releases">
    <img src="https://img.shields.io/github/release/zu1k/github-hosts?style=flat-square">
  </a>
</p>

修改hosts加速GitHub访问

https://github.com/zu1k/github-hosts

---

## Xray Cracker

<p>
  <a href="https://github.com/zu1k/xray-crack-rm/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/xray-crack-rm?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/xray-crack-rm/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/xray-crack-rm?style=flat-square">
  </a>
</p>

解析和生成 Xray 永久证书

在某些契机下，我使用 IDA Pro 花了一晚上的时间逆向了长亭科技的 Xray 扫描器的证书校验逻辑，使用 Golang 写出了 Xray 合法证书的生成逻辑，并在后续添加了 Xray 可执行程序的自动 Patch 功能。
我曾经写了一篇文章来发布该工具，该工具得到安全圈的欢迎：[xray社区高级版破解](https://zu1k.com/posts/security/reverse/xray-cracker/)。
不过后续长亭的小姐姐联系我，说有人拿这个代码去盈利，于是我删除了相关代码，这件事也让我反思，开源某些类型的代码是否真的能够带来好的结果？

此项目曾进入 GitHub Trending 排行榜，[archive](https://github.com/search?q=repo%3Alarsbijl%2Ftrending_archive+zu1k%2Fxray-crack&type=code)。

https://github.com/zu1k/xray-crack-rm

---

## DogeCloud COS Action

<p>
  <a href="https://github.com/zu1k/dogecloud-cos-action/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/dogecloud-cos-action?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/dogecloud-cos-action/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/dogecloud-cos-action?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/dogecloud-cos-action/releases">
    <img src="https://img.shields.io/github/release/zu1k/dogecloud-cos-action?style=flat-square">
  </a>
</p>

使用 GitHub Actions 上传文件到 DogeCloud COS

DogeCloud 的对象存储和 CDN 是分销腾讯云的，服务质量没问题，并且提供了足够吸引我的免费额度，于是我便打算将博客的某些静态资源使用他家的 CDN 来分发。
后来发现他家官方并没有合适的持续部署模块，于是我便基于腾讯云官方的 [COS Action](https://github.com/TencentCloud/cos-action) 模块开发了一个，这个项目也得到了 DogeCloud 官方的认可。

https://github.com/zu1k/dogecloud-cos-action

---

## 印象笔记去广告

通过替换广告链接去除印象笔记烦人广告

https://github.com/zu1k/evernote_noad

---

## GlobalSSH for GitHub

<p>
  <a href="https://github.com/zu1k/globalssh4github/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/globalssh4github?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/globalssh4github/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/globalssh4github?style=flat-square">
  </a>
</p>

利用UCloud的免费GlobalSSH服务加速github的ssh协议

https://github.com/zu1k/globalssh4github

---

## CoolQ RSS Push Bot

<p>
  <a href="https://github.com/zu1k/coolq-rsspushbot/stargazers">
    <img src="https://img.shields.io/github/stars/zu1k/coolq-rsspushbot?style=flat-square">
  </a>
    <a href="https://github.com/zu1k/coolq-rsspushbot/network/members">
    <img src="https://img.shields.io/github/forks/zu1k/coolq-rsspushbot?style=flat-square">
  </a>
  <a href="https://github.com/zu1k/coolq-rsspushbot/releases">
    <img src="https://img.shields.io/github/release/zu1k/coolq-rsspushbot?style=flat-square">
  </a>
</p>

RSS订阅的QQ机器人

https://github.com/zu1k/coolq-rsspushbot

---

## My Followers

这是我的Followers数目破1k的纪念项目

通过GitHub的GraphQL Api，获取自己的follower列表，然后生成头像墙。通过GitHub Action定时每日更新

Fork并开启GitHub Action功能，可自动生成自己的

https://github.com/zu1k/my_followers

---

## LDAP-log

一个LDAP请求监听器，摆脱dnslog平台

由于Apache Log4j RCE漏洞的火热，各大dnslog平台成为过年狂欢中最累的那一部分，不如写一个专门针对ldap协议的logger

https://github.com/zu1k/ldap-log

---

## LibAFL-Book-zh

LibAFL 文档书 简体中文版翻译

在线访问：https://libafl-book-zh.zu1k.com/

https://github.com/zu1k/LibAFL-Book-zh

---

## install cert

在操作系统的信任区安装根证书

https://github.com/zu1k/install-cert

