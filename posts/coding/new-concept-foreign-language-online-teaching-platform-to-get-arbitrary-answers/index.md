# 新理念外语网络教学平台获取任意答案


给大家哦分享一个获取任意答案的脚本。
<!--more-->

```python
import random
import requests

root = "http://202.194.7.18/NPlearning"
answerurl=root+"/Student/ViewTestTask.aspx"
ctoken = None

s = requests.session()
ua = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0"}
s.headers.update(ua)
s.get(root)

def login(username,password):
    data = "__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwULLTE2NTQ5MDE2NTlkZAPwlkpH14E6NeK5kuxpWcxRlhG6&tbName="+username+"&tbPwd="+password+"&btnLogin=%E7%99%BB+%E5%BD%95"
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/login.aspx",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    t = s.post(root+"/login.aspx", data = data, headers = headers)
    print("登陆成功")
    ctoken = t.text[t.text.find("InitToken('") + 11:t.text.find("InitToken('") + 49]
    c = requests.cookies.RequestsCookieJar()
    c.set('ctoken', ctoken)
    s.cookies.update(c)
    s.get(root+"/studentdefault.aspx")

def randomnocache():
    return str(random.random())


def getanswer(part,ttid,sheetid,sttid):
    data = "action=getPart&partnum="+str(part)+"&ttid="+str(ttid)+"&sheetid="+str(sheetid)+"&sttid="+str(sttid)+"&nocache="+randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/student/ViewTestTask.aspx",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    ans=s.post(url=answerurl,data=data,headers=headers)
    if ans.text.find("服务器错误")==-1:
        return ans.text

def answer(ttid,sheetid,sttid):
    fo = open("D://EnglishAnswer.html","a+")
    fo.write(getanswer(1, ttid,sheetid,sttid))
    fo.write(getanswer(2, ttid, sheetid, sttid))
    fo.write(getanswer(3, ttid, sheetid, sttid))
    fo.write(getanswer(4, ttid, sheetid, sttid))
    fo.close()

login("20170030****","8*******") #这里输入大家自己的账号密码
answer(7707,1634,289502) #这里需要输入获取到的ttid,sheetid,sttid.这三个参数是开始做题才分配的，需要大家自己找
```

最终的答案是一个html文件，存在D盘根目录，名称EnglishAnswer.html,直接双击用浏览器打开就可以。

后续补充：有时候网页中会出现个别字符导致文件写入编码方式出错，请自己使用replace函数移除相应字符。

