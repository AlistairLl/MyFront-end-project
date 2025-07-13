
// 题目数据
const data = [
  {
      id: 1,
      qs: "1.HTML5 中 canvas 元素的用途是什么？",
      as: "绘制图形",
      opts: ["绘制图形", "播放音频", "用于存储数据", "显示视频"]
  },
  {
      id: 2,
      qs: "2.CSS 中，box-sizing 属性的作用是什么？",
      as: "设置盒模型的计算方式",
      opts: [
          "设置边框大小",
          "设置盒模型的计算方式",
          "控制元素的高度和宽度",
          "控制元素的背景色"
      ]
  },
  {
      id: 3,
      qs: "3.在 JavaScript 中，let 和 var 的主要区别是什么？",
      as: "let 具有块级作用域，var 具有函数级作用域",
      opts: [
          "let 具有块级作用域，var 具有函数级作用域",
          "let 是 ES6 的新特性，var 是 ES5 的旧特性",
          "let 可以重新声明，var 不能重新声明",
          "let 只能用于常量，var 可以用于变量"
      ]
  },
  {
      id: 4,
      qs: "4.在 JavaScript 中，如何获取数组的长度？",
      as: "array.length",
      opts: [
          "array.getLength()",
          "array.size()",
          "array.length",
          "array.length()"
      ]
  },
  {
      id: 5,
      qs: "5.Vue.js 中，哪个生命周期钩子在组件创建后首次被调用？",
      as: "created",
      opts: ["created", "mounted", "beforeCreate", "updated"]
  }
];

// 全局变量
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
// let totalTime = 15; // 总时间（秒）

// 界面切换函数，切换对应界面并隐藏当前界面
function showScreen(screenId) {
  document.querySelectorAll(".box").forEach(box => {
      box.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}

// 加载题目
function loadQuestion() {
  const question = data[currentQuestionIndex];
  document.getElementById("question-number").textContent = question.id;
  document.getElementById("question-text").textContent = question.qs;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  optionsDiv.classList.remove('answered'); // 移除 answered 类
  question.opts.forEach(opt => {
      const button = document.createElement("button");
      button.textContent = opt;
      button.addEventListener("click", () => selectOption(opt, question.as));
      optionsDiv.appendChild(button);
  });
  document.getElementById("next-button").classList.add("hidden");
  startTimer();
}

// 选择选项
function selectOption(selected, correct) {
  clearInterval(timer);
  cancelAnimationFrame(rafId); // 取消进度条的动画帧请求
  const optionsDiv = document.getElementById('options');

  const options = document.querySelectorAll("#options button");
   // 标记题目已被选择
   optionsDiv.classList.add('answered');
  options.forEach(button => {
      button.disabled = true;
      if (button.textContent === correct) {
          button.style.backgroundColor = "#d4edda"; // 绿色表示正确
          // button. = "√"; // 绿色文字
          // 添加绿色的 √ 图标
          const correctIcon = document.createElement('span');
          correctIcon.textContent = '✔';
          correctIcon.classList.add('correct-icon');
          button.appendChild(correctIcon);
      } else if (button.textContent === selected) {
          button.style.backgroundColor = "#f8d7da"; // 红色表示错误
          // 添加红色的 × 图标
          const wrongIcon = document.createElement('span');
          wrongIcon.textContent = '✖';
          wrongIcon.classList.add('wrong-icon');
          button.appendChild(wrongIcon);
      }
  });
  if (selected === correct) {
      score++;
  }
  document.getElementById("next-button").classList.remove("hidden");
}



//  // 启动计时器
//  function startTimer() {
//   timeLeft = 15;
//    // 格式化初始时间显示
//   const formattedTime = timeLeft.toString().padStart(2, '0');
//   document.getElementById("time-left").textContent = formattedTime;
//   const progressBar = document.getElementById('progressBar');
//   let progressWidth = 0;
//   const totalTime = 15;
//   timer = setInterval(() => {
//       timeLeft--;
//       // 格式化时间显示，确保两位数
//       const formattedTime = timeLeft.toString().padStart(2, '0');
//       document.getElementById("time-left").textContent = formattedTime;
//       progressWidth = Math.min(((totalTime - timeLeft) / totalTime) * 100, 100);
//       progressBar.style.width = progressWidth + '%';
//       if (timeLeft <= 0) {
//           clearInterval(timer);
//           selectOption(null, data[currentQuestionIndex].as); // 超时自动提交
//       }
//   }, 1000);
// }



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



// 下一题
document.getElementById("next-button").addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < data.length) {
      loadQuestion();
  } else {
      showResult();
  }
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = '0%';//下一题后将进度条清零

});

// 显示答题结果
function showResult() {
  showScreen("result-screen");
  document.getElementById("score").textContent = score;
  let evaluation = "";//满分、及格（答对一半及以上）、不及格的评语
  if (score === data.length) {
      evaluation = "🎉 满分通关！真是旷世奇才！太棒了！🎉";
  } else if (score >= data.length / 2) {
      evaluation = "🌹 很不错，继续努力！未来可期哟！🌹";
  } else {
      evaluation = "🤗 别灰心呀！咱们加把劲，下次指定能行！🤗";
  }
  document.getElementById("evaluation").textContent = evaluation;
}

// 重新考试
document.getElementById("restart-button").addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  showScreen("question-screen");
  loadQuestion();
});
function resetExam() {
  currentQuestionIndex = 0; // 重置题目索引
  score = 0; // 重置得分
  if (timer) { // 将计时器停止并清空
      clearInterval(timer);
      timer = null;
  }
  
}

// 退出考试按钮
document.getElementById("exit-exam-button").addEventListener("click", () => {
  resetExam(); // 重置考试状态
  showScreen("start-screen"); // 切换到开始考试界面
});

// 事件监听，然后切换界面
document.getElementById("start-button").addEventListener("click", () => {
  showScreen("instructions-screen");
});
document.getElementById("exit-button").addEventListener("click", () => {
  showScreen("start-screen");
});
document.getElementById("continue-button").addEventListener("click", () => {
  showScreen("question-screen");
  loadQuestion();
});

// 初始化
showScreen("start-screen");