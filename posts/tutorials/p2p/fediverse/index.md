# 谈谈 Mastodon、Fediverse 和 ActivityPub


埃隆·马斯克 440 亿美元拿下 Twitter 后就开始大刀阔斧进行改革，他要做推特 2.0，但没想到他的举措竟然是大量裁员，施行专政。接下来的一系列举措使 Twitter 俨然已经成为某些人自我营销和推广的个人发布平台，想必是之前通过 Twitter 割虚拟货币韭菜割爽了。我想未来老马利用 Twitter 宣传进入政界也不足为奇。于是很多人便开始考虑脱离专制的 Twitter 平台，寻找一个更加开放自由、权力更加分散的平台，Mastodon 凭借多年的技术积累、好看的 UI 和类 Twitter 的交互逻辑，一举跃入众人的视野。

## Mastodon

[Mastodon](https://www.youtube.com/watch?v=IPSbNdBmWKE) 又叫长毛象，我是 21 年左右在某个论坛看到 "草莓县"(cmx.im) 从而接触并了解了 Mastodon。Mastodon 从 16 年就开始开发，在我第一次接触它的时候 UI 就已经很美观了，其在 22 年进入大众视野并受到大家喜爱我一点也不感到奇怪，这么长时间的积累使 Mastodon 的成功成为历史的必然。

Mastodon 开源、去中心化(联邦制)的特性决定了任何个人和组织都可以搭建自己的 Mastodon 实例，从而加入到这个社交网络中来，人们既可以按照爱好、观念聚集在某个实例中，同时又可以与其他实例的用户进行各种交互，这种小邦大连的社交模式真的深得人心。

简单来说，作为用户，你可以从众多实例中根据喜好选择其中一个，注册账号，然后你就可以像推特一样发嘟(类比推特的发推)，关注其他用户，查看时间线。与推特不同的一点是，如果你关注的用户注册在其他实例，那你就需要通过用户名加域名的方式来定位他。这有一点需要注意，在不同的实例中可能有多个用户有相同的用户名，所以实例的域名也是非常重要的一部分。因此，如果你想要打造个人品牌，就需要考虑防止有人通过一比一复制你的用户名、头像、介绍等信息来冒充你，也许提供 GPG 公钥是个不错的选择，貌似目前 Mastodon 没有集成成熟的解决方案来避免冒充问题。

据我所知国内部分高校组建了一个自己的小联邦，这个小联邦中每个学校都是一个独立的 Mastodon 实例，每个学校的实例都由本校学生独立自治，同时加入这个高校联邦的所有实例之间又可以互相交互。这个小联邦叫 [闭社](https://closed.social/)，感兴趣的同学可以关注一下，搭建自己学校的实例并加入其中。

## Fediverse

其实 Mastodon 并不是唯一的 Fediverse，Fediverse 这个词也不是 Mastodon 首创，早在 2008 年就有人提出来了这个概念，并构想社交和内容发布平台要满足独立托管、通过标准化协议通讯等概念。仔细想想，这些概念是不是跟 Email 很像？Email 可是在互联网发明之初就流行的协议，看起来互联网的发展过程也是轮回的，分久必合(商业公司中心化体验好)、合久必分(去中心化自由、自治)。这里我推荐阅读这篇文章: [Mastodon, the rise of the Fediverse](https://checkfirst.network/mastodon-the-rise-of-fediverse/)。

目前最流行的 Fediverse 当属社交领域的 Mastodon 和即时通讯领域的 Matrix。据我了解，Matrix 的技术生态更加繁荣，有众多服务端和客户端的实现，同时也可以对接 Slack、Discord、Telegram、QQ、WeChat 等众多通讯 APP，但是目前看起来非技术爱好者用的并不多，大部分用户都是开发者和技术爱好者。而 Mastodon 的客户端虽有很多，但服务端只有官方一个实现，称不上技术生态繁荣，但是用户却遍地开花，特别是普通非技术用户。这种现象需要引起思考，技术虽可以改变世界，但技术并不是唯一，更好的UI、更好的交互、更好的体验，这些才是带来产品发展的外部动力的基础。

目前我的主要社交媒体还是 Twitter，正在慢慢向 Mastodon 转，主要是有很多要关注的人他们并没有在 Mastodon 宇宙安家。即时通讯方面除开熟人通讯必要的 QQ 和微信，陌生人通讯我正在逐渐放弃 Telegram，因为 Telegram 也正在变得封闭、专制、商业化，我在很多 Matrix 实例上都有匿名账户，但是我的朋友并不愿意来到 Matrix 网络，因此目前我的陌生人通讯主力是邮箱，我会对外公开我的邮箱地址，任何人都可以给我发邮件交流。

除了上面提到的两个 Fediverse，还有一些其他的 Fediverse 平台并不为大众所知，覆盖了通讯、社交、图片、音乐、视频等众多领域，大家可以通过以下网站探索:

- https://fediverse.party/en/fediverse/
- https://fediverse.info/
- https://fedi.tips/
- https://joinfediverse.wiki/Main_Page

对了，我还要着重提一个，Rust 语言开发的论坛 Fediverse，[Lemmy](https://github.com/LemmyNet/lemmy)，可以用来替代 Reddit、HackerNews，轻量好用。

## ActivityPub 协议

刚刚提到了 Fediverse 需要标准化协议来进行通讯，而 Mastodon 基于的协议便是 ActivityPub 协议，这个协议历史比 Mastodon 早，并且已经[被 W3C 
在 2018 年推荐作为标准](https://www.w3.org/TR/2018/REC-activitypub-20180123/)。

这个协议规范了去中心化社交网络交互细节的各方面，包括用户的交互(收发信息、关注、喜欢)，还有活动(就是内容、推文、嘟文)的发布、更新、删除、喜欢、屏蔽等等。

如果各个平台都遵循相同的协议，那使用不同平台的用户就可以在同一 Fediverse 中交互，举个例子，我可以在 Mastodon 和 Pixelfed 这两个不同的平台之间进行一些简单的交互。

我测试用 Pixelfed 平台的账号(`@zu1k@pixey.org`) 关注我的 Mastodon 账号(`@zu1k@fosstodon.org`)，可以成功搜索到用户，显示头像、简介、关注量等信息，可以成功关注。在 Mastodon 平台也可以即时收到被关注的通知，同时可以通过 Mastodon 查看 Pixelfed 的账号信息。

![Pixelfed 账号关注 Mastodon 账号](mastodon_pixelfed.png)

但是我在 Pixelfed 发布的内容，从 Mastodon 却无法看到，这说明两个应用虽然都使用 ActivityPub 协议，但是其在内容封装方面有自己专属的子协议，这些子协议之间并不互相兼容，只有那些公共的兼容的协议才能跨应用使用，例如账户信息、关注这类。

同时我还尝试使用 Mastodon 查看 Lemmy 的用户，可以看到用户信息，发布的部分内容可以看到，有一些出入，说明这两者之间也是有不兼容的地方。

![Mastodon 查看 Lemmy 用户](mastodon_lemmy.png)

通过 Lemmy 的 issue 和 PR 列表我看到 Lemmy 正在做与 Mastodon 的兼容工作，这很伟大，支持！

同时，一位 GitHub 的员工开发了一个有意思的东西，[ActivityPub to Mastodon bridge](https://github.com/davecheney/pub)。pub 的目的不是托管 ActivityPub 社区，而是旨在使拥有自己域并因此控制其身份的人能够参与 Fediverse，这意味着你无需搭建 Mastodon 就可以用自己的域名加入到 Mastodon 联邦中了，这就很方便了，轻量好用啊。

## Mastodon 性能问题

Mastodon 目前官方实现使用 Ruby 语言，Ruby 依靠 Rails 框架用来开发 Web 应用简直是不要太快捷，非常适合频繁变化的需求。但是 Ruby 本身的性能并不乐观，去年 [Shopify 使用 Rust 开发 YJIT](https://shopify.engineering/porting-yjit-ruby-compiler-to-rust) 顺利合入 [Ruby 上游](https://github.com/ruby/ruby/blob/master/doc/yjit/yjit.md)，并[随 Ruby 3.2 版本正式发布](https://shopify.engineering/ruby-yjit-is-production-ready)，这[将 Ruby 的性能提升了约 40%](https://speed.yjit.org/benchmarks/bench-2023-01-05-201010)，但是 Ruby 的性能仍无法与目前流行的 JavaScript 比肩(主要是 V8 引擎的功劳)，更不要提 Golang 和 Rust了。而我经过搜索发现，竟无 Golang 和 Rust 的服务端实现，即使有也已经停止了开发，这使 Mastodon 如何支撑即将到来的上亿用户量？如何与 Twitter 竞争？当然，目前已有的实例都没有这么多的用户量，等未来有这个性能需求的时候，自然会有商业公司出钱出力来解决这个问题。

不过我倒是不希望这一天的到来，如果某一个 Mastodon 实例的用户量上千万，这其实就成了另外一个 "Twitter"，大量用户聚集在商业公司运营的单一或几个主流实例上，那联邦制、分布式等概念实际上也就名存实亡了。不要忘记我们逃离 Twitter 来到 Mastodon 的初心啊！

不过虽然这么说，我还是希望 Mastodon 性能能够更好一点，同时我也看到了一些优化 Mastodon 性能的努力。随着 Mastodon 实例数量的增多，单个 Mastodon 实例往往需要连接众多其他实例来进行交互，这带来了巨大的网络性能压力，使得想要自行搭建 Mastodon 实例的小伙伴不得不花更多钱在服务器费用上。这极大概率会导致部分实例脱离 Fediverse，形成自己封闭的，仅有几个节点的小联邦，这应该并不是我们想要看到的。我已经看到了[有人开发了 ActivityPub relay](https://github.com/yukimochi/Activity-Relay) [Relay 列表](https://github.com/brodi1/activitypub-relays)，中继服务器与大量实例连接，聚合内容，然后提供给中小型服务器，从而使中小型服务器无需连接大量实例就可以实现相同规模的信息获取。

国外的社交和通讯正在变天，有上天的，有摆脱大公司的。而国内因为各种法律条款的限制，一般人根本没有权力做社交和通讯，会不会就错过这一波改变呢？让我们拭目以待吧。

