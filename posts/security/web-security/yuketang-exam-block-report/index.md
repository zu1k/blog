# 屏蔽雨课堂在线考试异常上报


学校又开始推雨课堂的在线考试功能了，在老师的配合下稍微分析了一下

因为都是js代码，没有用wasm，分析还是比较简单的

## 切屏检测

考试过程中，如果切换浏览器标签，返回后会有一个切屏警告，并且老师那边也会有切屏记录

通过实验发现如果不切换浏览器标签，使用另一个浏览器窗口或者切换其他软件都不会触发这个记录

相关代码如下

```javascript
onchange: function (t) {
    var e = this;
    if (document.hidden || 
        0 != e.onlineProctor || 
        e.getCacheResult(), e.onlineProctor > 0) {
        if (document.hidden) {
            e.time1 = new Date, e.uploadUnnormal(12)
        } else x && clearTimeout(x), x = setTimeout(function () {
            e.$alert("", {
                customClass: "alertMsg",
                showClose: !1,
                message: "系统监测到你切出了考试页面<br/>我们会将此行为报告你的老师",
                dangerouslyUseHTMLString: !0,
                confirmButtonText: "继续考试",
                center: !0,
                callback: function (t) {}
            })
        }, 1)
    } else;
},
```

没有看代码之前我还猜想检查切屏可以通过focus来检查，看了代码后发现使用的是vue的 onchange 进行触发，然就在方法内检查document是否hidden

这样是无法检测到切换不同应用的，简直是自欺欺人啊

注意到检测到切标签后会触发 `e.uploadUnnormal(12)` 方法，进去看一下

```javascript
uploadUnnormal: function (t) {
    var e = this;
    this.$axios.post(API.feed_add, {
        exam_id: this.exam_id,
        action: t
    }).then(function (t) {}).catch(function (t) {
        e.$message.error("发生错误")
    })
}
```

其中 `API.feed_add1` 是 `/online_proctor/stu/monitor/feed/add` 这个路径

也就是说切标签后会 POST 一个标号为12的action记录，抓包后也发现的确如此，也仅仅而已

## 照片上传

查看请求发现图片是先上传到七牛云，然后将返回的连接发给服务器


```javascript
handleCapture: function () {
    var t = this,
        e = this.context,
        n = this.$refs.video;
    if (this.isexam) 
        e.drawImage(n, 0, 0, 160, 120);
    else if (e.drawImage(n, 0, 0, 240, 180), this.reTake) 
        return void this.$emit("changeReTake", !1);
    setTimeout(function () {
        var e = t.$refs.canvas.toDataURL("image/jpeg", 1),
            n = Object(u.b)(e, Date.now());
        t.upload(n).then(function (e) {
            var n = e && e.url;
            t.image_url = n, 
            t.$emit("changeReTake", !0), 
            t.$emit("changeCanEnter", !0), 
            t.isexam && t.postRecord(n, 0, 0, 0, 1)
        })
    }, 0)
},
```

```javascript
upload: function (t) {
    var e = c.a.qiniuDomain;
    return new s.a(function (n, r) {
        var i = {
            next: function (t) {
                t.total.percent
            },
            error: function (t) {
                r({
                    url: ""
                })
            },
            complete: function (t) {
                var r = e + "/" + encodeURIComponent(t.key);
                n({
                    url: r
                })
            }
        };
        c.a && c.a.upload(t, i, "image", !1)
    })
},
```

```javascript
postRecord: function (t, e, n, r, i) {
    var o = {
        exam_id: this.examid,
        image_url: t,
        label: e,
        event_group_id: n,
        operator_id: r,
        action: i
    };
    this.$axios.post(API.upload_photograph, o)
                .then(function (t) {})
                .catch(function (t) {})
}
```

## 如何绕过

那啥，就几个有用的url，反正都是后台请求，当做广告拦截了就行，这样老师那边就没有切屏警告和异常照片了

- changjiang-exam.yuketang.cn/online_proctor/stu/monitor/feed/add
- changjiang-exam.yuketang.cn/online_proctor/stu/photograph/add
- upload.qiniup.com
- upload-z1.qiniup.com
- upload-z2.qiniup.com
- upload-na0.qiniup.com
- upload-as0.qiniup.com

插件我用的AdblockPLUS，手动添加几条规则就行，亲测好用

