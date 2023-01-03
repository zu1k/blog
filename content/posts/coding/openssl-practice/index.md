---
title: "OpenSSL学习实践"
date: 2020-10-07T15:13:43+08:00
draft: true
---

前两个学期，有两门课程的作业涉及OpenSSL库的使用，具体内容可以看：

- [静态链接OpenSSL进行RSA\MD5\Base64]({{< ref "posts/coding/openssl-first-try-rsa-md5-base64/index.md" >}})

这学期的课程又有涉及OpenSSL库的内容，虽然已有之前两次的经验，但是做起来还是发现自己对其封装理解的不够深入，对其文档不够熟悉，在实际使用的时候遇到了不少挫折

所以决定理顺一下思路，借本次实践总结一些相关概念和经验，为后面的学习留下笔记

## OpenSSL有啥

首先从名字上看OpenSSL是与`SSL`相关的东西，
