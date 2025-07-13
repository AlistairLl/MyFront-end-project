# 金山办公训练营前端第一次作业-卢建桥

## 01项目概述
此次作业是一个简单的在线考试应用，用于测试用户的前端知识。作业包含四个主要界面：开始界面、考试须知界面、答题界面和结果界面。用户可以通过按钮导航完成考试流程，查看得分并选择重新开始或退出。

## 02技术栈
- **前端**：HTML, CSS, JavaScript 
- **样式**：纯 CSS 实现
- **数据管理**：JavaScript 数组存储题目

## 03开发思路
通过作业中的功能需求讲解部分，我最开始的想法是可以创建四个界面，开始界面、考试需求界面、答题界面、结果界面，相当于是四个块。然后在相应界面的对应按钮上面添加 JavaScript交互，实现界面之间的跳转。然后再在每个界面当中设计各个元素的摆放位置与动态效果。接着我就开始编码实现，到最后发现大致思路是正确的。四个界面相互跳转的思路没有问题，对应的CSS设计和 JS交互根据具体情况可以交叉进行。以下就是对开发思路的具体实现：

### 1. 界面设计

- **HTML 结构**：
  - 创建四个 `div` 元素，分别对应开始界面 (`start-screen`)、考试须知界面 (`instructions-screen`)、答题界面 (`question-screen`) 和结果界面 (`result-screen`)。
  - 使用类名 `.hidden` 控制各个界面的显示与隐藏。
- **CSS 美化**：
  - 为按钮添加悬停效果、阴影和圆角等样式。
  - 设计进度条样式，用于显示每题的剩余时间。

### 2. 题目管理
- **数据存储**：
  - 在 `index.js` 中定义一个 `data` 数组（此项是老师提供的数据），存储题目信息，每项包括：
    - `id`：题目编号
    - `qs`：题目问题内容
    - `as`：正确答案
    - `opts`：题目选项
- **动态加载**：
  - 我编写了`loadQuestion` 函数，根据当前题目索引动态更新问题和选项内容。

### 3. 交互逻辑
- **界面切换**：
  - 通过 `showScreen` 函数切换界面，接受目标界面 ID 参数，为所有界面添加 `.hidden`（使全部界面消失）后，移除目标界面的 `.hidden` 类（使对应界面出现）。
- **选项选择**：
  - 为每个选项按钮绑定点击事件，判断用户选择是否正确，显示对勾或叉号。
- **计时器**：
  - 使用 `setInterval` 实现每题 15 秒倒计时，超时自动提交当前题目。
  - 同时使用了进度条，实现答题时间可视化

### 4. 结果展示
- **得分计算**：
  - 使用全局变量 `score` 记录正确答案数。
- **界面显示**：
  - 在结果界面显示总得分和评价，提供“重新考试”和“退出考试”按钮。

## 04关键实现
### **界面切换**：

```javascript
function showScreen(screenId) {
    document.querySelectorAll('.box').forEach(box => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}
```



### 倒计时和进度条：

```javascript
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let rafId;
//  启动计时器
function startTimer() {
  timeLeft = 15;
  const totalTime = timeLeft * 1000;
  const startTime = Date.now();
  const progressBar = document.getElementById('progressBar');
  const timeLeftElement = document.getElementById('time-left');
  timeLeftElement.textContent = timeLeft.toString().padStart(2, '0');

  function updateProgress() {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min((elapsedTime / totalTime) * 100, 100);
      progressBar.style.width = progress + '%';

      if (timeLeft > 0) {
          rafId = requestAnimationFrame(updateProgress);
      } else {
          cancelAnimationFrame(rafId);
          selectOption(null, data[currentQuestionIndex].as);
      }
  }
  rafId = requestAnimationFrame(updateProgress);

  timer = setInterval(() => {
      timeLeft--;
      timeLeftElement.textContent = timeLeft.toString().padStart(2, '0');
      if (timeLeft <= 0) {
          clearInterval(timer);
          cancelAnimationFrame(rafId);
          selectOption(null, data[currentQuestionIndex].as);
      }
  }, 1000);
}
```

## 05遇到的问题及解决办法

我在开发过程中遇到了不少的问题，以下是列举一些让我从中受益较多的问题:

### 问题1：CSS 布局的问题

在项目开发初期，我对 CSS 的运用感到迷茫，尤其是在布局方面遇到了很大的挑战：**不知道如何将文字和按钮准确放置到自己想要的位置，**具体问题包括：

- 文字无法对齐到页面的左侧或右侧。
- 按钮不能按照预期浮动到特定位置，比如右下角。
- 元素之间的间距不均匀，甚至出现重叠，影响页面整体效果。

### 解决办法

为了解决这些问题，我开始系统地学习 CSS 的核心概念，包括盒子模型、浮动、定位和Flex布局，并将它们应用到实际项目中。学习的途径一方面是在哔哩哔哩上看相关的课程，学习相关的知识，然后在作业中具体应用，另一方面如果通过和AI的对话，向它提问求助，在它的回答中找到解决思路和方法。通过这样不断的学习，让我在 CSS 的运用方面有了很大的收获。

### 问题2：计时进度条的变化问题

最开始我使用`setInterval()`更新进度条时，虽然可以设置固定的时间间隔来调整进度条的宽度，但它的执行时机并不一定与浏览器的渲染周期同步。导致进度条的显示不够连贯，呈现出一段一段跳的效果。但是如果设置更短的时间执行回调函数，会让内存消耗更多，并且倒计时不需要在短时间内更新很多次，只需要一秒更新一次。`requestAnimationFrame()`

### 解决办法

为了让进度条变得平滑，我求助了AI，向它询问有哪些使进度条过渡更加细腻并且的方法，根据它的提示，然后我改用了 `requestAnimationFrame()`。这个 API 是专门为动画设计的，它会在浏览器下一次重绘之前调用指定的回调函数。这样，进度条的更新就能与浏览器的渲染节奏保持一致，从而实现更流畅的视觉效果。修改过后效果确实非常好，进度条过渡十分丝滑，而且`requestAnimationFrame()`在资源利用效率、动画流畅度等都有显著优势。同时我的倒计时还是使用`setInterval()`来一秒更新一次，既节省了内存，又提高了资源利用率。在关键实现在我展示了部分关于计时器相关的代码。