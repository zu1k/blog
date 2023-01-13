---
title: "再看PHP的mt_rand()"
date: 2021-04-09 12:35:00+0800
description: "之前了解过PHP的mt_rand的安全隐患，前段时间DzzOffice爆出RCE漏洞，让我再次回顾起这个伪随机数产生函数"
tags:
- web-security
- PHP
- 伪随机数
categories:
- web-security
draft: true
---

说到随机数，应该是必不可少的一个东西，但是在计算机的世界里，通过确定性运算产生的理论上没有真随机数，要产生真随机数只能通过传感器捕获环境中的熵。

