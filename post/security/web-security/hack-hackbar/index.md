# HackBar破解


## 前言

相信很多研究安全或者打CTF的朋友都在使用HackBar，在浏览器中使用HackBar构造并发送请求非常方便，特别是测试sql注入和xss等常见漏洞。

但是HackBar是收费软件，在其 [官网](https://hackbar.site/) 上，价格由3刀到89刀不等。很多安全研究人员会选择购买89刀的10年证书，但是对于学生来说，短期的一个月1刀的短期价格对于这样一个浏览器插件来说还是比较贵的。

![官网价格](price.jpg)

考虑到浏览器扩展插件的逻辑代码都是js代码，并且大部分工具类插件的代码都存放在本地，所以破解这类软件变得非常简单。

未破解前的hackbar是这样的，按钮没法用，显示一个红框

![破解前](not-hack.jpg)

下面我将以Chrome浏览器为例，对HackBar插件进行破解。

## 破解插件

### 找到插件路径

首先我们需要在官网上找到插件的安装地址并进行安装

![install](install.jpg)

安装后插件会存放在我们电脑的本地

在chrome中打开 [version](chrome://version/) 页面，可以在 `个人资料路径` 位置找到Chrome浏览器数据的存放位置

![version页面](chrome-version.jpg)

我们在文件管理器中打开这个路径，找到里面的`Extension`目录，这个目录里面就存放了我们的所有扩展插件

![插件位置](dirpath.jpg)

我们可以在扩展程序界面看到所有插件的ID，找到HackBar的ID，然后从Extension目录中找到这个目录，进入后就是HackBar的插件目录

### 分析授权验证

我们先将插件这个目录复制出来，然后用编辑器打开，其中授权验证相关代码在 `theme\js\hackbar-panel.js` 这个js文件中

```javascript
// 授权验证失败
function disable_hackbar(message=null) {
    // 将hidden属性移除，就会显示输入证书的红框
    $('#alert-license').removeClass('hidden');
    // 如果有消息，就在证书那个红框显示出来
    if(message){
        $('#alert-license span').text(message);
    }
    // 标记证书无效
    license_ok = false;
}

// 从chrome本地存储中获取都license内容
chrome.storage.local.get(['license'], function (result) {
    const license = result.license;
    // 如果证书内容存在
    if (license) {
        //通过链接谷歌服务器检查网络情况
        fetch("https://google.com")
            .then(function (response) {
                // 从证书服务器检查证书
                fetch(license_server + "/" + license)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        // 无效的证书会返回
                        // {"pong":false,"message":"License is invalid"}
                        const pong = data.pong;
                        if (pong === false) {
                            // 证书无效，调用函数显示红框并使功能不可用
                            disable_hackbar(data.message);
                        }
                    }).catch(error => {
                        // 授权服务器连接不上
                        disable_hackbar();
                    });
            })
            .then(function (data) {
            }).catch(error => {
            });
    } else {
        // 证书不存在，直接禁用插件
        disable_hackbar();
    }
});

........
// 证书检查函数
function check_license(){
    // 检查 license_ok 标记
    if(!license_ok){
        throw new Error('Please input valid license!');
    }
}
```

### 进行破解

通过上面对授权验证代码的分析，我们可以找到很多破解的思路，核心有一下几点：

- `license_ok` 一开始是 `true`
- 证书检查失败的红框一开始是隐藏的
- 授权验证失败调用的是 `disable_hackbar()` 函数
- 只在一处地方会向 服务器 检查证书状况
- 其他地方都是通过 `check_license()` 也就是 `license_ok` 标记检查授权的

也就是说，一共有两个关键点：

1. 证书检查失败的红框
2. 功能的正常使用

针对证书检查失败的红框，只需要 `disable_hackbar` 函数不运行 或者 里面去除`hidden`标记的代码不运行，就不会显示红框了

针对功能的正常使用，有很多办法可以达到：

1. 首先我们知道，这些功能都是在调用 `check_license()` 函数检查授权情况的，所以我们可以将这个函数里面检查的代码全都注释掉
2. 我们还发现， `check_license()` 函数是通过 `license_ok` 标记检查授权的，所以我们可以在检查前将 `license_ok` 标记为 `true`，或者说将前面标记 `license_ok = false` 的代码注释掉

最后我们发现，红框一开始是不显示的，`license_ok`一开始是`true`的，而前面所看到的授权验证的代码的唯一可能影响就是让红框显示、`license_ok`为`false`，所以那段代码直接删除了就ok了

> 我不会直接给出破解后的代码和插件的，希望大家能够根据上面的分析和破解思路自己进行破解

## 插件安装

近年来，通过浏览器插件对用户进行攻击、获取用户隐私信息的攻击越来越多，现代浏览器厂商为了保护用户的安全，往往会对发布的浏览器插件进行严格审查，对未经签名验证的插件不予安装或安装后无法运行

所以我们破解后的HackBar是无法通过正常途径安装的，我们需要通过开发者模式进行安装

在扩展程序页面右上角打开 开发者模式，这样就可以不经签名安装自己开发的插件

左上角 加载已解压的扩展程序 按钮，我们选择刚刚破解好的HackBar目录，就可以顺利将 HackBar 安装上了

![插件安装](chrome-import.jpg)

通过这种方式安装的插件，每一次chrome重新启动都会有一个提示框，很烦人，但是能用

> 当然，也可以通过注册开发者账号，将插件通过官方渠道审核、签名、发布
> 这样所有人都可以安装了，当然推荐是 **不公开** 的发布模式

安装后，按F12，插件就可以正常使用了

![破解后](hack-hackbar-done.jpg)

## 总结

本文以HackBar的chrome插件的分析破解为例，想大家展示了浏览器插件的简单破解，Firefox的插件破解也是大同小异，希望大家可以活学活用

