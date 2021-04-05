# MD5的Hash长度扩展攻击


## 一、遇到的问题

在一道web题目中遇到了以下判断:
`if ($COOKIE["md5hash"] === md5($secret . $input))`

在该题目中我们可以掌握的参数有`md5hash`、`input`的值，`secret`的md5值和长度，我们需要想办法让这个判断通过。

由此想到了md5的hash长度扩展攻击。
<!--more-->

## 二、md5算法原理

### 基本介绍

md5是对一段信息（Message）产生信息摘要（Message-Digest），所谓信息就是指我们需要加密的原数据，信息摘要是数据经过一系列计算得出来的一个长度固定的数据（可以说是源数据的一个独一无二的指纹）。

### 计算步骤

MD5以512位分组来处理输入的信息，且每一分组又被划分为16个32位子分组，经过了一系列的处理后，算法的输出由四个32位分组组成，将这四个32位分组级联后将生成一个128位散列值。

#### 第一步、填充

如果输入信息的长度(bit)对512求余的结果不等于448，就需要填充使得对512求余的结果等于448。填充的方法是填充一个1和n个0。填充完后，信息的长度就为N*512+448(bit)；

#### 第二步、记录信息长度

用64位来存储填充前信息长度。这64位加在第一步结果的后面，这样信息长度就变为N*512+448+64=(N+1)*512位。

#### 第三步、装入标准的幻数（四个整数）

标准的幻数（物理顺序）是

```
（A=(01234567)16，B=(89ABCDEF)16，C=(FEDCBA98)16，D=(76543210)16）。如果在程序中定义应该是（A=0X67452301L，B=0XEFCDAB89L，C=0X98BADCFEL，D=0X10325476L）
```

标准的初幻数是Md5算法固定的，不会变化，但是幻数本身是随着每一轮计算不断变动的。

#### 第四步、四轮循环运算

复杂运算，具体计算方法可以google一下代码。

### 举个计算的例子

比如计算字符串`test`的md5值。

十六进制`0x74657374`
二进制`0b1110100011001010111001101110100`

这里与448模512不同余，补位后的数据如下:

十六进制

```
0x74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000
```

二进制

```
0b1110100011001010111001101110100100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000
```

将补位后的数据进行一次复杂的运算，计算出

```
A=0xcd6b8f09
B=0x73d32146
C=0x834edeca
D=0xf6b42726
```

数据小于512位，所以将ABCD通过小端规则转换就是MD5值：`098f6bcd4621d373cade4e832627b4f6`

如果我输入的数据不是test而是一串很长的字符，换算出来大于512小于1024，就需要计算两次，第一次先计算前512位的ABCD的值，算出来后再用这个ABCD去计算后面512位的的ABCD的值，最后算出来的ABCD经过拼接就是这串字符的MD5了

## 三、md5的hash扩展攻击

### 解决的问题

如文章最初遇到的问题，由两个字符串组成一个字符串`$str=$a+$b`，第一个字符串`$a`不知道也不可控，只可控第二个字符串`$b`，同时知道第一个字符串`$a`的MD5值和长度，这时候将第二个字符串精心构造一下，便可以算出合成的字符串`$str`的MD5的值

### 攻击原理

要明白攻击的原理，需要对md5计算方法稍微了解一下，就是上边的几个步骤，我们先来看一下以上问题正常计算的步骤。

#### 正常的计算步骤

假如第一个字符串`$a=“test”`,为了方便转为十六进制`0x74657374`

构造第二个字符串首先手动将`$str`补成一个标准的可以直接计算的512位

```
$str=0x74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000
```

这样子，这时候再在后面追加一个`0x746573748`

```
$str=0x74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000746573748
```

这时候再将`$str`大于512位，程序会先将这串数据补为1024位，补充完如下

```
$str=0x7465737480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000074657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002002000000000000
```

这时将`$str`分为两部分

```
74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000
```

和

```
74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002002000000000000
```

这时候程序计算前一部分的ABCD的值，由于和之前算的test的数值是相同的所以

```
A=0xcd6b8f09
B=0x73d32146
C=0x834edeca
D=0xf6b42726
```

到了第二部分，第二部分的计算是用的第一部分的ABCD去计算，计算新的ABCD如下

```
A=0x226359e5
b=0x99df12eb
C=0x6853f59e
D=0xf5406385
```

最后算出来的MD5是`e5596322eb12df999ef55368856340f5`

#### 发现问题

我们看到了，将原数据按长度拆分后，第一轮计算的结果会作为幻数用在第二轮计算中。而在我们的问题中，第一轮计算的结果我们是已知的，也就是说，我们知道了第二轮计算的幻数，可以进行接下来的运算。

因为知道了第一个字符串`$a`的长度，我们可以构造第二个字符串`$b`的值，也就是说我们手动在第二个字符串`$b`的前端添加一些特定数据，使得第一轮计算因为我们添加数据后符合一轮计算的原数据长度而只计算出第一个字符串的hash值。这样我们就可以利用这个结果作为我们二轮计算的幻数进行下面的计算，从而预测最终的md结果。

具体的操作步骤看一下例子。

#### md5的hash长度扩展攻击操作实例

我们作为攻击者来复现一下刚才正常计算的那个过程。

##### 知道的条件

    1.$a的MD5(098f6bcd4621d373cade4e832627b4f6)
    2.$a的长度=4
    3.$b我们可以任意控制

由1我们可以逆推算出其ABCD的值

    A=0xcd6b8f09
    B=0x73d32146
    C=0x834edeca
    D=0xf6b42726

我们构造`$b`的值，在前面添加特定长度的补全值：
`$b='\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x20\x00\x00\x00\x00\x00\x00\x00'+'test'`

其中`\x80\x00\x00\x00\x00\x00\x00\x00`这一类的数据是在md5计算的补位过程中填充的数据，我们手动来填充一下，长度视已知的`$a的长度=4`决定。

此时$str如下，由于不知道$a，我们假设$a="aaaa"

```
$str='aaaa'+'\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x20\x00\x00\x00\x00\x00\x00\x00'+'test'
```

##### 我们脑补一下程序计算str的过程

    1.由于大于512位，先补全为1024位，
    2.将其分为两部分
    3.计算第一部分的ABCD的值
    4.再用第一部分算出来的ABCD拿来算第二部分的值。

这里由于第一部分的ABCD我们可以逆推出来，我们可以直接跳过前三部分直接进行第四部分的计算，只需要将标准的MD5的源码里面的初始的ABCD的值改为逆推出来的那个值

我们用假的初始的ABCD计算一下

`0x74657374800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002002000000000000`

的MD5，发现是`e5596322eb12df999ef55368856340f5`，和上面正向计算出来的一样！

到此，md5的hash扩展攻击结束。

## 四、代码实现

### my_md5.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author：DshtAnger
# theory reference:
#   blog：
#       http://blog.csdn.net/adidala/article/details/28677393
#       http://blog.csdn.net/forgotaboutgirl/article/details/7258109
#       http://blog.sina.com.cn/s/blog_6fe0eb1901014cpl.html
#   RFC1321：
#       https://www.rfc-editor.org/rfc/pdfrfc/rfc1321.txt.pdf
##############################################################################
import sys
def genMsgLengthDescriptor(msg_bitsLenth):
    '''
    ---args:
            msg_bitsLenth : the bits length of raw message
    --return:
            16 hex-encoded string , i.e.64bits,8bytes which used to describe the bits length of raw message added after padding
    '''
    return __import__("struct").pack(">Q",msg_bitsLenth).encode("hex")

def reverse_hex_8bytes(hex_str):
    '''
    --args:
            hex_str: a hex-encoded string with length 16 , i.e.8bytes
    --return:
            transform raw message descriptor to little-endian 
    '''
    hex_str = "%016x"%int(hex_str,16)
    assert len(hex_str)==16    
    return __import__("struct").pack("<Q",int(hex_str,16)).encode("hex")

def reverse_hex_4bytes(hex_str):
    '''
    --args:
            hex_str: a hex-encoded string with length 8 , i.e.4bytes
    --return:
            transform 4 bytes message block to little-endian
    '''    
    hex_str = "%08x"%int(hex_str,16)
    assert len(hex_str)==8    
    return __import__("struct").pack("<L",int(hex_str,16)).encode("hex")

def deal_rawInputMsg(input_msg):
    '''
    --args:
            input_msg : inputed a ascii-encoded string
    --return:
            a hex-encoded string which can be inputed to mathematical transformation function.
    '''
    ascii_list = [x.encode("hex") for x in input_msg]
    length_msg_bytes = len(ascii_list)
    length_msg_bits = len(ascii_list)*8
    #padding
    ascii_list.append('80')  
    while (len(ascii_list)*8+64)%512 != 0:  
        ascii_list.append('00')
    #add Descriptor
    ascii_list.append(reverse_hex_8bytes(genMsgLengthDescriptor(length_msg_bits)))
    return "".join(ascii_list)



def getM16(hex_str,operatingBlockNum):
    '''
    --args:
            hex_str : a hex-encoded string with length in integral multiple of 512bits
            operatingBlockNum : message block number which is being operated , greater than 1
    --return:
            M : result of splited 64bytes into 4*16 message blocks with little-endian

    '''
    M = [int(reverse_hex_4bytes(hex_str[i:(i+8)]),16) for i in xrange(128*(operatingBlockNum-1),128*operatingBlockNum,8)]
    return M

#定义函数，用来产生常数T[i]，常数有可能超过32位，同样需要&0xffffffff操作。注意返回的是十进制的数
def T(i):
    result = (int(4294967296*abs(__import__("math").sin(i))))&0xffffffff
    return result   

#定义每轮中用到的函数
#RL为循环左移，注意左移之后可能会超过32位，所以要和0xffffffff做与运算，确保结果为32位
F = lambda x,y,z:((x&y)|((~x)&z))
G = lambda x,y,z:((x&z)|(y&(~z)))
H = lambda x,y,z:(x^y^z)
I = lambda x,y,z:(y^(x|(~z)))
RL = L = lambda x,n:(((x<<n)|(x>>(32-n)))&(0xffffffff))

def FF(a, b, c, d, x, s, ac):  
    a = (a+F ((b), (c), (d)) + (x) + (ac)&0xffffffff)&0xffffffff;  
    a = RL ((a), (s))&0xffffffff;  
    a = (a+b)&0xffffffff  
    return a  
def GG(a, b, c, d, x, s, ac):  
    a = (a+G ((b), (c), (d)) + (x) + (ac)&0xffffffff)&0xffffffff;  
    a = RL ((a), (s))&0xffffffff;  
    a = (a+b)&0xffffffff  
    return a  
def HH(a, b, c, d, x, s, ac):  
    a = (a+H ((b), (c), (d)) + (x) + (ac)&0xffffffff)&0xffffffff;  
    a = RL ((a), (s))&0xffffffff;  
    a = (a+b)&0xffffffff  
    return a  
def II(a, b, c, d, x, s, ac):  
    a = (a+I ((b), (c), (d)) + (x) + (ac)&0xffffffff)&0xffffffff;  
    a = RL ((a), (s))&0xffffffff;  
    a = (a+b)&0xffffffff  
    return a      

def show_md5(A,B,C,D):
    return "".join( [  "".join(__import__("re").findall(r"..","%08x"%i)[::-1]) for i in (A,B,C,D)  ]  )

def run_md5(A=0x67452301,B=0xefcdab89,C=0x98badcfe,D=0x10325476,readyMsg=""):
    
    a = A
    b = B
    c = C
    d = D

    for i in xrange(0,len(readyMsg)/128):
        M = getM16(readyMsg,i+1)
        for i in xrange(16):
            exec "M"+str(i)+"=M["+str(i)+"]"
        #First round
        a=FF(a,b,c,d,M0,7,0xd76aa478L)
        d=FF(d,a,b,c,M1,12,0xe8c7b756L)
        c=FF(c,d,a,b,M2,17,0x242070dbL)
        b=FF(b,c,d,a,M3,22,0xc1bdceeeL)
        a=FF(a,b,c,d,M4,7,0xf57c0fafL)
        d=FF(d,a,b,c,M5,12,0x4787c62aL)
        c=FF(c,d,a,b,M6,17,0xa8304613L)
        b=FF(b,c,d,a,M7,22,0xfd469501L)
        a=FF(a,b,c,d,M8,7,0x698098d8L)
        d=FF(d,a,b,c,M9,12,0x8b44f7afL)
        c=FF(c,d,a,b,M10,17,0xffff5bb1L)
        b=FF(b,c,d,a,M11,22,0x895cd7beL)
        a=FF(a,b,c,d,M12,7,0x6b901122L)
        d=FF(d,a,b,c,M13,12,0xfd987193L)
        c=FF(c,d,a,b,M14,17,0xa679438eL)
        b=FF(b,c,d,a,M15,22,0x49b40821L)
        #Second round
        a=GG(a,b,c,d,M1,5,0xf61e2562L)
        d=GG(d,a,b,c,M6,9,0xc040b340L)
        c=GG(c,d,a,b,M11,14,0x265e5a51L)
        b=GG(b,c,d,a,M0,20,0xe9b6c7aaL)
        a=GG(a,b,c,d,M5,5,0xd62f105dL)
        d=GG(d,a,b,c,M10,9,0x02441453L)
        c=GG(c,d,a,b,M15,14,0xd8a1e681L)
        b=GG(b,c,d,a,M4,20,0xe7d3fbc8L)
        a=GG(a,b,c,d,M9,5,0x21e1cde6L)
        d=GG(d,a,b,c,M14,9,0xc33707d6L)
        c=GG(c,d,a,b,M3,14,0xf4d50d87L)
        b=GG(b,c,d,a,M8,20,0x455a14edL)
        a=GG(a,b,c,d,M13,5,0xa9e3e905L)
        d=GG(d,a,b,c,M2,9,0xfcefa3f8L)
        c=GG(c,d,a,b,M7,14,0x676f02d9L)
        b=GG(b,c,d,a,M12,20,0x8d2a4c8aL)
        #Third round
        a=HH(a,b,c,d,M5,4,0xfffa3942L)
        d=HH(d,a,b,c,M8,11,0x8771f681L)
        c=HH(c,d,a,b,M11,16,0x6d9d6122L)
        b=HH(b,c,d,a,M14,23,0xfde5380c)
        a=HH(a,b,c,d,M1,4,0xa4beea44L)
        d=HH(d,a,b,c,M4,11,0x4bdecfa9L)
        c=HH(c,d,a,b,M7,16,0xf6bb4b60L)
        b=HH(b,c,d,a,M10,23,0xbebfbc70L)
        a=HH(a,b,c,d,M13,4,0x289b7ec6L)
        d=HH(d,a,b,c,M0,11,0xeaa127faL)
        c=HH(c,d,a,b,M3,16,0xd4ef3085L)
        b=HH(b,c,d,a,M6,23,0x04881d05L)
        a=HH(a,b,c,d,M9,4,0xd9d4d039L)
        d=HH(d,a,b,c,M12,11,0xe6db99e5L)
        c=HH(c,d,a,b,M15,16,0x1fa27cf8L)
        b=HH(b,c,d,a,M2,23,0xc4ac5665L)
        #Fourth round
        a=II(a,b,c,d,M0,6,0xf4292244L)
        d=II(d,a,b,c,M7,10,0x432aff97L)
        c=II(c,d,a,b,M14,15,0xab9423a7L)
        b=II(b,c,d,a,M5,21,0xfc93a039L)
        a=II(a,b,c,d,M12,6,0x655b59c3L)
        d=II(d,a,b,c,M3,10,0x8f0ccc92L)
        c=II(c,d,a,b,M10,15,0xffeff47dL)
        b=II(b,c,d,a,M1,21,0x85845dd1L)
        a=II(a,b,c,d,M8,6,0x6fa87e4fL)
        d=II(d,a,b,c,M15,10,0xfe2ce6e0L)
        c=II(c,d,a,b,M6,15,0xa3014314L)
        b=II(b,c,d,a,M13,21,0x4e0811a1L)
        a=II(a,b,c,d,M4,6,0xf7537e82L)
        d=II(d,a,b,c,M11,10,0xbd3af235L)
        c=II(c,d,a,b,M2,15,0x2ad7d2bbL)
        b=II(b,c,d,a,M9,21,0xeb86d391L)


        A += a
        B += b
        C += c
        D += d

        A = A&0xffffffff
        B = B&0xffffffff
        C = C&0xffffffff
        D = D&0xffffffff

        a = A
        b = B
        c = C
        d = D
        print "%x,%x,%x,%x"%(a,b,c,d)

    return show_md5(a,b,c,d)
```

### test.py

```python
# -*- coding: utf-8 -*-
import my_md5
import sys
import six
MD5_Hash=sys.argv[1]
length=int(sys.argv[2])
text=sys.argv[3]

s1=eval('0x'+MD5_Hash[:8].decode('hex')[::-1].encode('hex'))
s2=eval('0x'+MD5_Hash[8:16].decode('hex')[::-1].encode('hex'))
s3=eval('0x'+MD5_Hash[16:24].decode('hex')[::-1].encode('hex'))
s4=eval('0x'+MD5_Hash[24:32].decode('hex')[::-1].encode('hex'))

secret = "a"*length
test=secret+'\x80'+'\x00'*((512-length*8-8-8*8)/8)+six.int2byte(length*8)+'\x00\x00\x00\x00\x00\x00\x00'+text
s = my_md5.deal_rawInputMsg(test)
r = my_md5.deal_rawInputMsg(secret)
inp = s[len(r):]
print '填充完的数据为:'+test+'\n'
print '----------------------------------------------------------'
print '扩充完的数据为(16进制):'+s
print '----------------------------------------------------------'
print '截取最后分组的数据(16进制):'+inp
print '----------------------------------------------------------'

print  '最终填充结果为:'+bytes(test).encode('hex')
print "填充后的md5为:"+my_md5.run_md5(s1,s2,s3,s4,inp)
```

脚本使用时第一个命令行参数是一个服务端加密一个固定长度数据的md5，第二个参数是固定的长度
例如已知服务端加密一个15字符的md5：test.py 571580b26c65f306376d4f64e53cb5c7 15

#### 参考文章

[MD5的Hash长度扩展攻击](https://www.cnblogs.com/p00mj/p/6288337.html)

