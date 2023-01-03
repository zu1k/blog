# 爬取教务系统所有课程并存入数据库


环境python3.6

```python
# -*- coding:utf-8 -*-

import sys
import requests
import hashlib
import json
import pymysql

# Initialize Session
s = requests.Session()
ua = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0"}
s.headers.update(ua)


def login():
    username = "201700301234"
    password = "123456".encode()

    # Get cookies
    s.get("http://bkjwxk.sdu.edu.cn")

    # Set properties to login
    hs = hashlib.md5()
    hs.update(password)
    password = hs.hexdigest()
    data = "j_username=" + username + "&j_password=" + password
    headers = {
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Referer": "http://bkjwxk.sdu.edu.cn/f/login",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
    }
    r = s.post("http://bkjwxk.sdu.edu.cn/b/ajaxLogin", data=data, headers=headers)

    # Check if is successful
    if r.text != "\"success\"":
        print("登陆出错")
        print("Detailed message: ")
        print(r.text)
        sys.exit()
    print("登陆成功")


# get one page data
def onepage(i):
    data = "type=kc&currentPage=" + i + "&kch=&jsh=&skxq=&skjc=&kkxsh="
    headers = {
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Referer": "http://bkjwxk.sdu.edu.cn/f/common/main",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
    }
    r = s.post("http://bkjwxk.sdu.edu.cn/b/xk/xs/kcsearch", data=data, headers=headers)
    return json.loads(r.text)


# 向数据库插入一条数据
def insertone(index, kch, kxh, kcm, xf, kclb, kclbmc, kkxsh, kkxsm, kkxsjc, jsh, ksm, sjdd):
    # 打开数据库连接
    db = pymysql.connect("localhost", "kc", "kc", "kc", charset='utf8')
    # 使用cursor()方法获取操作游标
    cursor = db.cursor()
    # SQL 插入语句
    sql = "INSERT INTO kcinfo(`id`,`kch`,`kxh`,`kcm`,`xf`,`kclb`,`kclbmc`,`kkxsh`,`kkxsm`,`kkxsjc`,`jsh`,`ksm`,`sjdd`) VALUES ('" + index + "','" + kch + "','" + kxh + "','" + kcm + "','" + xf + "','" + kclb + "','" + kclbmc + "','" + kkxsh + "','" + kkxsm + "','" + kkxsjc + "','" + jsh + "','" + ksm + "','" + sjdd + "')"
    try:
        # 执行sql语句
        cursor.execute(sql)
        # 提交到数据库执行
        db.commit()
    except:
        print(sql)
        # 如果发生错误则回滚
        db.rollback()


def godata(i):
    js = onepage(i)
    for result in js["object"]["resultList"]:
        kch = result["KCH"] if kch is not None else ""  # 课程号
        kxh = str(result["KXH"]) if kxh is not None else ""  # 课序号
        kcm = result["KCM"]  # 课程名
        if not kcm: kcm = ""
        xf = str(result["XF"])  # 学分
        if not xf: xf = "0"
        kclb = result["KCLB"]  # 课程类别
        if not kclb: kclb = ""
        kclbmc = result["KCLBMC"]  # 课程类别名称
        if not kclbmc: kclbmc = ""
        kkxsh = result["KKXSH"]  # 开课学院号
        if not kkxsh: kkxsh = ""
        kkxsm = result["KKXSM"]  # 开科学院名
        if not kkxsm: kkxsm = ""
        kkxsjc = result["KKXSJC"]  # 开课学院简称
        if not kkxsjc: kkxsjc = ""
        jsh = str(result["JSH"])  # 教师号
        if not jsh: jsh = "0"
        ksm = result["JSM"]  # 教师名
        if not ksm: ksm = ""
        sjdd = result["SJDD"]  # 上课时间/地点
        if not sjdd: sjdd = ""
        index = str(result["NUM"])  # 序号 无用
        if not index: index = "0"
        # 插
        insertone(index, kch, kxh, kcm, xf, kclb, kclbmc, kkxsh, kkxsm, kkxsjc, jsh, ksm, sjdd)


login()
for i in range(1, 173):
    godata(str(i))
    print("第" + str(i) + "页完成")
```

