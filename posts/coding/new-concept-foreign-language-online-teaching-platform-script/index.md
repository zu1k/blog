# 新理念外语网络教学平台脚本刷时长


这是我们学校用的平台，自己写了一个脚本，可以用来刷时间，可以多开同时刷。

20分钟刷一册书不是问题。

有需要的拿去，随便改改就能用。


```python
import requests
import random
import time

root = "http://202.194.7.18/NPlearning"
timeurl = root+"/Student/LogTime.aspx"
studyurl = root+"/student/CourseStudy.aspx"
ctoken = None

s = requests.session()
ua = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0"}
s.headers.update(ua)
s.get(root)

def randomnocache():
    return str(random.random())

#登陆账号
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
    # 添加了cookies
    c = requests.cookies.RequestsCookieJar()  # 定义一个cookie对象
    c.set('TimeRecordEnabled', 'true')  # 增加cookie的值
    s.cookies.update(c)  # 更新s的cookie
    c.set('ctoken', ctoken)
    s.cookies.update(c)
    #访问http://202.194.7.18/NPlearning/studentdefault.aspx，不知道作用是什么，没有返回任何东西，但是添加了cookies，估计是向服务器记录什么
    s.get(root+"/studentdefault.aspx")

# 1.学习课程
def couseStudy(book,unit):
    data = "t=studyunit&c=2017-0002-0033&m=College_English_NEW_SecEdition_Integrated_3&u=Unit_0"+str(unit)+"&nocache="+randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/student/CourseIndex.aspx?c=2017-0002-0033&m=College_English_NEW_SecEdition_Integrated_3",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    s.get(studyurl,data=data,headers=headers)

# 2.检查授权
def checkauthorize():
    data="logType=checkneedauthorize&material=College_English_NEW_SecEdition_Integrated_3&nocache="+randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/student/CourseStudy.aspx?t=studyunit&c=2017-0002-0033&m=College_English_NEW_SecEdition_Integrated_3&u=Unit_02&nocache="+randomnocache(),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    ok = s.get(timeurl,data=data,headers=headers)


# 3.不知道用来干啥用的方法
def getcomment(book,unit):
    data = "logType=getcomment&classno=2017-0002-0033&material=College_English_NEW_SecEdition_Integrated_3&unit=Unit_0"+str(unit)+"&nocache="+randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/student/CourseStudy.aspx?t=studyunit&c=2017-0002-0033&m=College_English_NEW_SecEdition_Integrated_3&u=Unit_0"+str(unit)+"&nocache="+randomnocache(),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    s.get(timeurl,data=data,headers=headers)


#获取服务器时间
def getServerTime():
    data = "logType=getservertime&nocache=" + randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/studentdefault.aspx",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
    }
    servertime = s.get(timeurl,data=data,headers=headers)
    return servertime.text


# 4.开始记录时间
def startNewStatTime(book,unit):
    data = "logType=startnewstattime&stattype=1&material="+"College_English_NEW_SecEdition_Integrated_3&unit=unit_0"+str(unit)+"&class=2017-0002-0033&nocache="+randomnocache()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/studentdefault.aspx",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    # 添加了cookies
    c = requests.cookies.RequestsCookieJar()  # 定义一个cookie对象
    c.set('StudyStart', getServerTime())  # 增加cookie的值
    s.cookies.update(c)  # 更新s的cookie
    c.set('Material', 'College_English_NEW_SecEdition_Integrated_3')  # 增加cookie的值
    s.cookies.update(c)  # 更新s的cookie
    c.set('Unit', "Unit_0"+str(unit)+"&nocache="+randomnocache())  # 增加cookie的值
    s.cookies.update(c)  # 更新s的cookie
    c.set('ClassNo', '2017-0002-0033')  # 增加cookie的值
    s.cookies.update(c)  # 更新s的cookie
    s.get(timeurl,data=data,headers=headers)



# 5.更新记录时间
def updateStatTime():
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Referer": "http://202.194.7.18/NPlearning/studentdefault.aspx",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = "logType=updatestattime" + "&nocache=" + randomnocache()
    s.get(timeurl,data=data,headers=headers)
    data = "logType=gettoken&nocache="+randomnocache()
    s.get(timeurl,data = data,headers=headers)

# 6.结束记录时间
def endStatTime():
    s.get(timeurl,data="logType=endstattime" + "&nocache=" + randomnocache())


#时间循环1分钟更新一下时间
def oneMin(tim):
    min = 0
    while 1:
        updateStatTime()
        print("更新"+str(min)+"分钟")
        if (min>tim):
            print("结束")
            endStatTime()
            break
        time.sleep(60)
        min += 1

login("2017********","*********")
couseStudy(3,1)
checkauthorize()
getcomment(3,1)
startNewStatTime(3,1)
oneMin(15)
```

> 大二上学期写的，质量不高，轻喷

