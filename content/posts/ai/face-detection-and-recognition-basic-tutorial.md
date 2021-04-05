---
title: 人脸检测与识别基础教程
date: 2018-10-14 15:58:56
tags:
    - python
    - AI
categories:
    - coding
---

这里我们将要介绍如何使用python进行简单的人脸检测与人脸识别，并且通过gpu来加速。

注意：这里都是基础内容，如果需要更加强大深入的请出门左转。
<!--more-->

## 一、环境搭建与资源下载

下面介绍简单人脸检测与识别需要使用到的几个重要依赖。

### 基础环境

我所使用的环境是windows 10 + python3.6(64位)

### python库

1. numpy
2. OpenCV
3. Dlib
4. face_recognition
5. haarcascades
6. shape_predictor

> **小基础**  
> python安装依赖可以选择在线安装，如 `pip install 依赖名`  
> 也可以选择使用whl文件安装，如 `pip install whl文件位置`  

#### 1. python扩展程序集：[numpy](https://www.lfd.uci.edu/~gohlke/pythonlibs/#numpy)

基于我的环境，我使用的是`numpy‑1.15.2+mkl‑cp36‑cp36m‑win_amd64.whl`这个版本，大家可以根据自己环境选择适合自己的版本下载。

安装使用命令 `pip3 install numpy‑1.15.2+mkl‑cp36‑cp36m‑win_amd64.whl`  

#### 2. 计算机视觉库：[OpenCV](https://www.lfd.uci.edu/~gohlke/pythonlibs/#opencv)  

我使用的是`opencv_python‑3.4.3‑cp36‑cp36m‑win_amd64.whl`这个版本。

安装使用命令 `pip3 install opencv_python‑3.4.3‑cp36‑cp36m‑win_amd64.whl`  

#### 3. 机器学习c++算法库：[Dlib](https://pypi.org/simple/dlib/)

我使用的是`dlib-19.8.1-cp36-cp36m-win_amd64.whl`。

安装使用命令 `pip3 install dlib-19.8.1-cp36-cp36m-win_amd64.whl`  

#### 4. 人脸识别集成库：[face_recognition](https://github.com/ageitgey/face_recognition)

安装使用命令 `pip3 install face_recognition`  

#### 5. 深度学习库：[Keras](https://keras.io/)

安装使用命令 `pip3 install keras`

前面部分用不到，后面高级应用会用到，可提前下载安装，也可后面需要的时候安装

#### 6. 机器学习框架：[TensorFlow](https://www.tensorflow.org/?hl=zh-cn)

安装使用命令： `pip3 install tensorflow`

前面部分用不到，后面高级应用会用到，可提前下载安装，也可后面需要的时候安装

### 人脸识别用到的数据模型

基于目前的数据量和个人知识与能力，我还不能自己利用机器学习来训练数据模型，所以使用的是国外别人已经训练好的数据模型。

#### 1. OpenCV使用到的人脸分类模型xml：[haarcascades](https://github.com/opencv/opencv/tree/master/data/haarcascades)

上面链接中所有的xml都推荐下载到本地备用，我所使用的是`haarcascade_frontalface_default.xml`  

#### 2. Dlib使用到的人脸识别训练模型：[shape_predictor](http://dlib.net/files/) 

我所使用的是`shape_predictor_68_face_landmarks.dat.bz2`和`shape_predictor_5_face_landmarks.dat.bz2`这两个。

推荐大家把这两个都下载下来，并解压，我们所需要的是里面的`dat`数据文件。  

> 好了，有了上面的这些基础环境与依赖，我们可以继续我们接下来的简单人脸检测与识别了。
> 没有装好这些环境的同学请注意了，我们班级已经与谷歌、百度等大公司达成合作，有任何问题请在[Google](https://www.google.com)和[Baidu](https://www.baidu.com)进行搜索，他们会提供你所需要的答案。


## 二、简单人脸检测

> 在这一节不会讲解复杂的人脸识别，只是先通过简单的小例子让大家先了解一下人脸识别需要用到什么、人脸识别的基本步骤等等最简单的内容。

### 1. 利用**OpenCV**进行**图片**人脸检测并进行标注

#### 实现思路

1. 先将图片灰度化，为了降低图片颜色维度，减少后续识别计算量
2. 然后利用OpenCV加载别人训练好的人脸分类器，通过这个分类器来检测人脸
3. 在原图片上画一个矩形，然后显示出来

#### 实现代码

```python
import cv2

filepath = "img/sdu/6.jpg"

classifier = cv2.CascadeClassifier(
    "lib/opencv/haarcascades/haarcascade_frontalface_default.xml"
)
img = cv2.imread(filepath)  # 读取图片
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 灰度化
color = (0, 255, 0)  # 定义绘制颜色

# 调用识别人脸
faceRects = classifier.detectMultiScale(
    gray, scaleFactor=1.2, minNeighbors=3, minSize=(32, 32))
if len(faceRects):  # 大于0则检测到人脸
    for faceRect in faceRects:  # 单独框出每一张人脸
        x, y, w, h = faceRect
        # 框出人脸
        cv2.rectangle(img, (x, y), (x + h, y + w), color, 2)

cv2.imshow("image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

### 2. 利用**OpenCV**进行**视频**人脸检测并进行标注

> 在人脸检测方面实现方法与上面图片的实现方法一模一样，只是这个图片是从摄像头不断获取的。

#### 实现代码

```python
import cv2

def scan(img):
    grayImg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    classifier = cv2.CascadeClassifier(
        "lib/opencv/haarcascades/haarcascade_frontalface_default.xml"
    )
    color = (0, 255, 0)  # 定义绘制颜色
    faceRects = classifier.detectMultiScale(
        grayImg, scaleFactor=1.2, minNeighbors=3, minSize=(32, 32))
    if len(faceRects):  # 大于0则检测到人脸
        for faceRect in faceRects:  # 单独框出每一张人脸
            x, y, w, h = faceRect
            cv2.rectangle(img, (x, y), (x + h, y + w), color, 2)
    cv2.imshow("image", img)

cap = cv2.VideoCapture(0)
while (1):
    ret, frame = cap.read()
    scan(frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### 3. 利用**Dlib**进行**图片**人脸检测并标注

> Dlib里面有很多算法，可以实现一些复杂的人脸识别。
> 在这一小节只演示用dlib内部自带的默认的人脸识别模型来进行人脸检测

#### 实现代码

```python
import cv2
import dlib

path = "img/sdu/658.jpg"
img = cv2.imread(path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#人脸分类器
detector = dlib.get_frontal_face_detector()

dets = detector(gray, 1)
for face in dets:
    #在图片中标注人脸边框，并显示
    left = face.left()
    top = face.top()
    right = face.right()
    bottom = face.bottom()
    cv2.rectangle(img, (left, top), (right, bottom), (0, 255, 0), 2)
    cv2.imshow("image", img)

cv2.waitKey(0)
cv2.destroyAllWindows()
```

### 4. 利用**Dlib**进行**视频**人脸检测并进行标注

> 都是相同的步骤呀，与上面大同小异

#### 实现代码

```python
import cv2
import dlib

detector = dlib.get_frontal_face_detector()  #使用默认的人类识别器模型

def scan(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dets = detector(gray, 1)
    for face in dets:
        left = face.left()
        top = face.top()
        right = face.right()
        bottom = face.bottom()
        cv2.rectangle(img, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.imshow("image", img)

cap = cv2.VideoCapture(0)
while (1):
    ret, img = cap.read()
    scan(img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

> 在两个视频中人脸检测中，我们发现  
> 在识别准确率上 Dlib > OpenCV  
> 但是在速度上 OpenCV > Dlib  
> 后面我们会有专门的内容讲解通过GPU加速Dlib

## 三、稍微复杂的人脸检测与识别

> 上面已经介绍过了简单的从一张图片或视频中的每一帧中检测到人脸并进行画框  
> 在这一小节，我们会进一步利用Dlib这个库中更加强大的工具来实现稍微发杂一些的人脸检测任务

### 1. 检测人脸的5个关键点和68个关键点并显示出来

#### 实现代码

```python
import cv2
import dlib

path = "img/ag.png"
img = cv2.imread(path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#人脸分类器
detector = dlib.get_frontal_face_detector()
# 获取人脸检测器
predictor = dlib.shape_predictor(
    "lib/dlib/shape_predictor_68_face_landmarks.dat" 
    #这里使用68点的模型，将68改成5就是使用5点的模型
)

dets = detector(gray, 1)
for face in dets:
    shape = predictor(img, face)  # 寻找人脸的68个标定点
    # 遍历所有点，打印出其坐标，并圈出来.
    for pt in shape.parts():
        pt_pos = (pt.x, pt.y)
        cv2.circle(img, pt_pos, 1, (0, 255, 0), 2)
    cv2.imshow("image", img)

cv2.waitKey(0)
cv2.destroyAllWindows()
```

> 上人脸识别的主菜

### 2. 利用**face_recognition**进行人脸识别

#### 实现代码

```python
import cv2
import face_recognition
import os

path = "img/face_5107"
cap = cv2.VideoCapture(0)
total_image_name = []
total_face_encoding = []
for fn in os.listdir(path):  #fn 表示的是文件名q
    print(path + "/" + fn)
    total_face_encoding.append(
        face_recognition.face_encodings(
            face_recognition.load_image_file(path + "/" + fn))[0])
    fn = fn[:(len(fn) - 4)]  #截取图片名（这里应该把images文件中的图片名命名为为人物名）
    total_image_name.append(fn)  #图片名字列表
while (1):
    ret, frame = cap.read()
    # 发现在视频帧所有的脸和face_enqcodings
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)
    # 在这个视频帧中循环遍历每个人脸
    for (top, right, bottom, left), face_encoding in zip(
            face_locations, face_encodings):
        # 看看面部是否与已知人脸相匹配。
        for i, v in enumerate(total_face_encoding):
            match = face_recognition.compare_faces(
                [v], face_encoding, tolerance=0.4)
            name = "Unknown"
            if match[0]:
                name = total_image_name[i]
                break
        # 画出一个框，框住脸
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
        # 画出一个带名字的标签，放在框下
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255),
                      cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0,
                    (255, 255, 255), 1)
    # 显示结果图像
    cv2.imshow('Video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### 3. 利用**face_recognition**进行人脸轮廓绘制

#### 代码实现

```python
import face_recognition
from PIL import Image, ImageDraw

# 将图片文件加载到numpy 数组中
image = face_recognition.load_image_file("img/ag.png")

#查找图像中所有面部的所有面部特征
face_landmarks_list = face_recognition.face_landmarks(image)

for face_landmarks in face_landmarks_list:
    facial_features = [
        'chin',  # 下巴
        'left_eyebrow',  # 左眉毛
        'right_eyebrow',  # 右眉毛
        'nose_bridge',  # 鼻樑
        'nose_tip',  # 鼻尖
        'left_eye',  # 左眼
        'right_eye',  # 右眼
        'top_lip',  # 上嘴唇
        'bottom_lip'  # 下嘴唇
    ]
    pil_image = Image.fromarray(image)
    d = ImageDraw.Draw(pil_image)
    for facial_feature in facial_features:
        d.line(face_landmarks[facial_feature], fill=(255, 255, 255), width=2)
    pil_image.show()
```

### 4. 利用**keras**实现性别识别

> 使用keras实现性别识别  
> 模型数据使用的是[oarriaga/face_classification的模型](https://github.com/oarriaga/face_classification)

#### 实现代码

```python
import cv2
from keras.models import load_model
import numpy as np
import chineseText

img = cv2.imread("img/xingye-1.png")
face_classifier = cv2.CascadeClassifier(
    "lib/opencv/haarcascades/haarcascade_frontalface_default.xml"
)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = face_classifier.detectMultiScale(
    gray, scaleFactor=1.2, minNeighbors=3, minSize=(140, 140))

gender_classifier = load_model(
    "classifier/gender_models/simple_CNN.81-0.96.hdf5")
gender_labels = {0: '女', 1: '男'}
color = (255, 255, 255)

for (x, y, w, h) in faces:
    face = img[(y - 60):(y + h + 60), (x - 30):(x + w + 30)]
    face = cv2.resize(face, (48, 48))
    face = np.expand_dims(face, 0)
    face = face / 255.0
    gender_label_arg = np.argmax(gender_classifier.predict(face))
    gender = gender_labels[gender_label_arg]
    cv2.rectangle(img, (x, y), (x + h, y + w), color, 2)
    img = chineseText.cv2ImgAddText(img, gender, x + h, y, color, 30)

cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

### 5. 利用**keras**实现表情识别

#### 实现代码

```python
import cv2
from keras.models import load_model
import numpy as np
import chineseText
import datetime

startTime = datetime.datetime.now()
emotion_classifier = load_model(
    'classifier/emotion_models/simple_CNN.530-0.65.hdf5')
endTime = datetime.datetime.now()
print(endTime - startTime)

emotion_labels = {
    0: '生气',
    1: '厌恶',
    2: '恐惧',
    3: '开心',
    4: '难过',
    5: '惊喜',
    6: '平静'
}

img = cv2.imread("img/emotion/emotion.png")
face_classifier = cv2.CascadeClassifier(
    "C:\Python36\Lib\site-packages\opencv-master\data\haarcascades\haarcascade_frontalface_default.xml"
)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = face_classifier.detectMultiScale(
    gray, scaleFactor=1.2, minNeighbors=3, minSize=(40, 40))
color = (255, 0, 0)

for (x, y, w, h) in faces:
    gray_face = gray[(y):(y + h), (x):(x + w)]
    gray_face = cv2.resize(gray_face, (48, 48))
    gray_face = gray_face / 255.0
    gray_face = np.expand_dims(gray_face, 0)
    gray_face = np.expand_dims(gray_face, -1)
    emotion_label_arg = np.argmax(emotion_classifier.predict(gray_face))
    emotion = emotion_labels[emotion_label_arg]
    cv2.rectangle(img, (x + 10, y + 10), (x + h - 10, y + w - 10),
                  (255, 255, 255), 2)
    img = chineseText.cv2ImgAddText(img, emotion, x + h * 0.3, y, color, 20)

cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

## 四、利用GPU加速Dlib提高效率

> 在前面的小实验中我们发现了，使用Dlib来实现的人脸检测与识别速度很慢，在视频中很难实现实时性。
> 所以我们不仅要想，是否可以用GPU加速一下。
> 以前可能很麻烦，现在英伟达推出的CUDA就专门为了解决这个而生。

### 1. 首先下载**CUDA**

[CUDA下载链接](https://developer.nvidia.com/cuda-downloads)

下载并安装，不必多说，一路下一步

### 2. 然后下载**cudnn**

[cudnn下载链接](https://developer.nvidia.com/rdp/cudnn-download)

这里下载需要注册英伟达账号，注册就行，下载下来后解压，里面提供cudnn库文件以及头文件，需要把cudnn目录下的bin、include以及lib目录中的文件拷贝到相应的cuda目录中的bin、include和lib目录中去。

### 3. 安装**cmake**

cmake是要在后面编译Dlib用到的。
[cmake下载链接](https://cmake.org/download/)
记住安装并添加path。

### 4. 编译Dlib

这里我们跳过，因为后面可以直接在安装Dlib库时让他自动编译，能自动搞何必去麻烦，如果感兴趣可以自己去编译。

### 5. 安装支持CUDA的Dlib库（会自动编译）

我们打开64位的cmd（这一个会在安装VS2017的时候提供），或者打开64位的Powershell，在里面运行安装命令  

`python setup.py install --yes DLIB_USE_CUDA`  

这一个命令会自动编译Dlib并且安装，就不用操心了。

> **在cmake编译的过程中可能会报出各种问题，稍微总结一下：**
> 如果出现类似于没找到相应编译器的原因，说明vs安装可能有问题，可能是vs版本比较老，vs安装不正确，或者vs安装不完整。不管怎么说vs的安装时间会需要很长时间，而且由于vs版本的问题，安装新的vs可能会出现各种问题，如果想手动卸载重装就更坑了，这个时候可以用卸载工具进行卸载：https://github.com/Microsoft/VisualStudioUninstaller/releases,下载之后直接解压然后以运行可执行程序，等待自动清理完成，然后重新安装vs；  
> 如果出现类似于找不到cuda的问题，请确认是否正确安装cuda；并且，如果提示找到了cuda但没有正确的cudnn，请确认是否正确地把cudnn中的lib、include和bin目录中的文件拷贝到相应的cuda目录底下；
> 在使用cmake编译的时候如果你更改了配置，那么需要在cmake‘中点击file中的delete cache，然后重新configure；
> 有一种很奇葩的现象是，有可能你的机器上已经安装过了cuda和cudnn，并且之前使用cmake configure的时候成功编译完成得到dlib的python库，但是出于某些原因需要重新安装cuda和cudnn，那么不仅需要手动卸载之前的cuda，而且最好也删除site-packages目录中所有和dlib相关的目录和文件，以及cmake输出得到的临时文件，然后重新安装cuda和cudnn，并且按照之前的步骤执行python setup.py install --yes DLIB_USE_CUDA，得到dlib的python库文件。
> 如果编译顺利，并且中间没有报错，可以新建一个python程序，然后import dlib成功，大功告成。

### 6. 验证新编译好的Dlib是否支持CUDA

**python脚本运行**

```python
import dlib
print(dlib.__)
print(dlib.DLIB_USE_CUDA)
print(dlib.cuda.get_num_devices())
```

## 人脸检测和识别学习就告一段落了，感谢观看
