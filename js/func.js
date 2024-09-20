//畫布初始化
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let h = (canvas.height =
  window.innerHeight >= 1000 ? window.innerHeight + 100 : 1000);
let w = (canvas.width = window.innerWidth);

//取得頁面上的元件
var add = document.querySelector("#add");
var reduce = document.querySelector("#reduce");
var levelNum = document.querySelector("#levelNum");
var version = document.querySelector("#version");

var maxLevel = 1; //紀錄level層級的變數
var multiMode = false; //紀錄現在是哪種version的變數

// 設定初始參數並繪製樹
const initialstartX = w / 2;
const initialstartY = h / 2 - 100;
const initialLength = 200;
const initialAngle = 90;
const initialLevel = 1;
const initialCircleWidth = 3;
const radian = Math.PI / 180;

//紀錄前一層級座標（畫圓用）
var prePos = {
  x: 0,
  y: 0,
};

// 繪製初始樹枝
drawTree();

// 繪製樹枝
function drawTree() {
  ctx.clearRect(0, 0, w, h); // 畫之前先清空畫布
  // 判斷是single或是multi模式
  if (multiMode) {
    // 畫出六個分支
    for (let i = 0; i < 6; i++) {
      let angle = i * 60;
      drawBranch(
        initialstartX + 50 * Math.cos(angle * radian),
        initialstartY - 50 * Math.sin(angle * radian),
        initialLength,
        angle,
        initialLevel
      );
    }
  } else {
    drawBranch(
      initialstartX,
      initialstartY,
      initialLength,
      initialAngle,
      initialLevel
    );
  }
}

//樹枝公式（遞迴）
function drawBranch(startX, startY, length, angle, lev) {
  if (lev > maxLevel) return; // 停止點

  // 計算終點座標
  const endX = startX + length * Math.cos(angle * radian);
  const endY = startY - length * Math.sin(angle * radian);

  // 設定顏色
  const r = 55 + 40 * (lev - 1);
  const g = 155 + 20 * (lev - 1);
  const b = 255;
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;

  // 繪製分支（樹枝只繪制到level 5）
  if (lev < 6) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (lev === 5) {
    // 記錄第五層級的座標
    prePos.x = endX;
    prePos.y = endY;
  } else if (lev === 6) {
    // 繪製大圓
    ctx.beginPath();
    ctx.arc(prePos.x, prePos.y, 7, 0, 2 * Math.PI); // 直徑14px，半徑7px
    ctx.lineWidth = initialCircleWidth; //設定線寬
    ctx.strokeStyle = `rgb(255, 166, 190)`; //設定線顏色
    ctx.stroke();
  } else if (lev === 7) {
    for (let i = 0; i < 6; i++) {
      // 利用大圓計算各個小圓的中心點座標
      const petalAngle = angle + i * 60 + 30;
      const petalX = prePos.x + 7 * Math.cos(petalAngle * radian); // 大圓半徑7px
      const petalY = prePos.y - 7 * Math.sin(petalAngle * radian);
      // 繪製小圓
      ctx.beginPath();
      ctx.arc(petalX, petalY, 3.5, 0, 2 * Math.PI); // 直徑7px，半徑3.5px
      ctx.lineWidth = initialCircleWidth - 2; // 設定線寬
      ctx.strokeStyle = `rgb(255, 186, 230)`; // 設定線顏色
      ctx.stroke();
    }
  } else if (lev === 8) {
    //繪製大星星
    drawStar(initialstartX, initialstartY, 5, 50, 25);
    //繪製小星星
    for (let i = 0; i < 5; i++) {
      const angle = i * 72 - 90;
      const smallStarX = initialstartX + 40 * Math.cos(angle * radian);
      const smallStarY = initialstartY - 40 * Math.sin(angle * radian);
      drawStar(smallStarX, smallStarY, 5, 5, 2.5);
    }
  }
  //繪製下一層級
  const newLength = length * 0.5;
  drawBranch(endX, endY, newLength, angle - 60, lev + 1);
  drawBranch(endX, endY, newLength, angle + 60, lev + 1);
}

//繪製星星
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3; //初始旋轉角度
  let x = cx; //星星的初始x座標
  let y = cy; //星星的初始y座標
  let step = Math.PI / spikes; // 每個尖刺之間的角度步長

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius); // 以星星頂點作為起始點
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius; // 計算外半徑的x座標
    y = cy + Math.sin(rot) * outerRadius; // 計算外半徑的y座標
    ctx.lineTo(x, y); // 畫線
    rot += step; // 增加旋轉角度

    x = cx + Math.cos(rot) * innerRadius; // 計算內半徑的x座標
    y = cy + Math.sin(rot) * innerRadius; // 計算內半徑的y座標
    ctx.lineTo(x, y); // 畫線
    rot += step; // 增加旋轉角度
  }
  ctx.lineTo(cx, cy - outerRadius); // 畫線回到星星的頂點
  ctx.closePath(); // 關閉路徑
  ctx.strokeStyle = "yellow"; // 設置邊線顏色
  ctx.stroke(); // 繪製實線
  ctx.fillStyle = "yellow"; // 設置填滿顏色
  ctx.fill(); // 填充圖形
}

// -按鈕監聽- //
// 點擊增加level按鈕
add.addEventListener("mousedown", (event) => {
  add.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
add.addEventListener("mouseup", (event) => {
  add.style = "transform: scale(100%)"; // UI:滑鼠放開時按鈕回覆原始大小
  if (maxLevel < 8) {
    maxLevel++;
    drawTree(); // 呼叫畫樹枝函數
    levelNum.innerHTML = maxLevel; // UI:更改畫面上的level數值
  }
});

//點擊減少level按鈕
reduce.addEventListener("mousedown", (event) => {
  reduce.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
reduce.addEventListener("mouseup", (event) => {
  reduce.style = "transform: scale(100%)"; // UI:滑鼠放開時按鈕回覆原始大小
  if (maxLevel > 1) {
    maxLevel--;
    drawTree(); //呼叫畫樹枝函數
    levelNum.innerHTML = maxLevel; // UI:更改畫面上的level數值
  }
});

//點擊version按鈕
version.addEventListener("mousedown", (event) => {
  version.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
version.addEventListener("mouseup", (event) => {
  version.style = "transform: scale(100%)"; // UI:滑鼠放開時按鈕回覆原始大小
  if (multiMode) {
    version.innerHTML = "Single"; // UI:更改畫面上的version文字
  } else {
    version.innerHTML = "Multi"; // UI:更改畫面上的version文字
  }
  multiMode = !multiMode; // 切換mode
  drawTree(); // 呼叫畫樹枝函數
});
