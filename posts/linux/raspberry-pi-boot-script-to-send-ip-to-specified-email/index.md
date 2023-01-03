# 树莓派开机发送IP到指定邮箱的脚本


本脚本使用的是腾讯企业邮的smtp服务，可以根据需求进行相应修改
<!--more-->

```python
# coding:utf8

import email
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import socket

class MyEmail:
    def __init__(self):
        self.user = None
        self.passwd = None
        self.to_list = []
        self.cc_list = []
        self.tag = None
        self.doc = None

    def send(self):
        '''
        发送邮件
        '''
        try:
            server = smtplib.SMTP_SSL("smtp.exmail.qq.com", port=465)
            server.login(self.user, self.passwd)
            server.sendmail("<%s>" % self.user, self.to_list, self.get_attach())
            server.close()
            print "send email successful"
        except Exception, e:
            print "send email failed %s" % e45

    def get_attach(self):
        '''
        构造邮件内容
        '''
        attach = MIMEMultipart()

        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("1.1.1.1", 80))
        txt = s.getsockname()[0]
        s.close()
        txt = MIMEText(txt)
        attach.attach(txt)
        if self.tag is not None:
            # 主题,最上面的一行
            attach["Subject"] = self.tag
        if self.user is not None:
            # 显示在发件人
            attach["From"] = "PI<%s>" % self.user
        if self.to_list:
            # 收件人列表
            attach["To"] = ";".join(self.to_list)
        if self.cc_list:
            # 抄送列表
            attach["Cc"] = ";".join(self.cc_list)
        if self.doc:
            # 估计任何文件都可以用base64，比如rar等
            # 文件名汉字用gbk编码代替
            name = os.path.basename(self.doc).encode("gbk")
            f = open(self.doc, "rb")
            doc = MIMEText(f.read(), "base64", "gb2312")
            doc["Content-Type"] = 'application/octet-stream'
            doc["Content-Disposition"] = 'attachment; filename="' + name + '"'
            attach.attach(doc)
            f.close()
        return attach.as_string()


if __name__ == "__main__":
    my = MyEmail()

    my.user = "username@example.com"
    my.passwd = "password"
    my.to_list = ["username@126.com", ]
    my.cc_list = ["", ]
    my.tag = "PI IP"
    my.doc = None #u"C:\Documents and Settings\Administrator\Desktop\日报.doc"
    my.send()
```

