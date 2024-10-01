//畫布初始化
const canvas = document.getElementById("myCanvas"); // 取得畫布
const ctx = canvas.getContext("2d"); // 將畫布設定為2維
let h = (canvas.height = window.innerHeight > 1000 ? window.innerHeight : 1000); // 設定畫布高度。當視窗高度小於1000px時，畫布的高度設為1000;若視窗高度大於1000px，則畫布高度設定與視窗同高
let w = (canvas.width = window.innerWidth); // 設定畫布寬度。

//取得頁面上的元件
var add = document.querySelector("#add"); // 增加層級按鈕
var reduce = document.querySelector("#reduce"); // 減少層級按鈕
var levelNum = document.querySelector("#levelNum"); // 層級顯示
var version = document.querySelector("#version"); // 版本切換按鈕

var maxLevel = 1; //紀錄level層級的變數
var multiMode = false; //紀錄現在是哪種version的變數

// 設定初始參數
const initialstartX = w / 2; // 初始x座標設為畫布寬度的一半
const initialstartY = h / 2 - 100; // 100為按鈕控制區的高度，為避免遮擋故初始y座標設定為畫布高度的一半-100
const initialLength = 200; // 初始層級的線條長度
const initialAngle = 90; // 初始層級的線條角度
const initialLevel = 1; // 初始層級設為第一層級
const initialCircleWidth = 5; // 圓的初始線條寬度
const initialCircleRadius = 7; // 圓的初始半徑
const radian = Math.PI / 180; // 角度換算

//紀錄前一層級座標（畫圓用）
var prePos = {
  x: 0,
  y: 0,
};

window.onload = function () {
  // 繪製初始樹枝
  drawTree();
  // UI: 將減少層級按鈕樣式設定成不可點擊樣式
  if (maxLevel === 1) {
    reduce.style =
      "color: #989898; border-color: #989898; background-color: #ababab;";
  }
};

// 繪製樹枝
function drawTree() {
  ctx.clearRect(0, 0, w, h); // 畫之前先清空畫布

  // 判斷是single或是multi模式
  if (multiMode) {
    // 繪製放射狀的六個分支
    for (let i = 0; i < 6; i++) {
      let angle = i * 60;
      drawBranch(
        initialstartX + 50 * Math.cos(angle * radian), // 分支腳對角線距離100，從中心點算起為50
        initialstartY - 50 * Math.sin(angle * radian), // 分支腳對角線距離100，從中心點算起為50
        initialLength,
        angle,
        initialLevel
      );
    }
  } else {
    // 繪製單一分支
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
function drawBranch(startX, startY, length, angle, level) {
  if (level > maxLevel) return; // 當繪製的層級已達到設定的層級時停止

  // 計算終點座標
  const endX = startX + length * Math.cos(angle * radian);
  const endY = startY - length * Math.sin(angle * radian);

  // 設定顏色
  const r = 55 + 40 * (level - 1); // R值隨層級遞增
  const g = 155 + 20 * (level - 1); // G值隨層級遞增
  const b = 255; // B值不改變
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`; // 設定線條顏色

  // 繪製分支（樹枝只繪制到level 5）
  if (level < 6) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (level === 5) {
    // 記錄第五層級的座標
    prePos.x = endX;
    prePos.y = endY;
  } else if (level > 5 && level < 8) {
    // 在第六和第七層級繪製圓
    // 繪製大圓與小圓
    drawCircles(level, prePos, angle, 0);
  } else if (level === 8) {
    // 在第八層級繪製星星
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
  //繪製下一層級樹枝
  const newLength = length * 0.5;
  drawBranch(endX, endY, newLength, angle - 60, level + 1);
  drawBranch(endX, endY, newLength, angle + 60, level + 1);
}

// 繪製圓(遞迴)
function drawCircles(level, prePos, angle, i = 0) {
  if (i > 5 || (level === 6 && i === 1)) return; //當第六層級已經畫過一個圈或第七層級的六個圈畫完後停止遞迴

  // 設定顏色
  const r = 255; // R值固定
  const g = 166 + 40 * (level - 6); // G值隨層級遞增
  const b = 190 + 20 * (level - 6); // B值隨層級遞增
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;

  // 設定線寬
  ctx.lineWidth = initialCircleWidth - 2 * (level - 6);

  // 設定圓半徑
  const newRadius = initialCircleRadius * (1 - 0.5 * (level - 6));

  // 利用大圓計算各個小圓的中心點座標 or 維持大圓中心座標
  const petalAngle = angle + (i * 60 + 30) * (level - 6);
  const petalX =
    prePos.x +
    initialCircleRadius * Math.cos(petalAngle * radian) * (level - 6);
  const petalY =
    prePos.y -
    initialCircleRadius * Math.sin(petalAngle * radian) * (level - 6);

  // 開始畫圓
  ctx.beginPath();
  ctx.arc(petalX, petalY, newRadius, 0, 2 * Math.PI);
  ctx.stroke();

  // 呼叫遞迴
  drawCircles(level, prePos, angle, i + 1);
}

//繪製星星(遞迴)
function drawStar(
  cx,
  cy,
  spikes,
  outerRadius,
  innerRadius,
  rot = (Math.PI / 2) * 3,
  step = Math.PI / spikes,
  i = 0
) {
  if (i === 0) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius); // 以星星頂點作為起始點
  }
  //繪製星星的角
  if (i < spikes) {
    let x = cx + Math.cos(rot) * outerRadius; // 計算外半徑的x座標
    let y = cy + Math.sin(rot) * outerRadius; // 計算外半徑的y座標
    ctx.lineTo(x, y); // 畫線
    rot += step; // 增加旋轉角度

    x = cx + Math.cos(rot) * innerRadius; // 計算內半徑的x座標
    y = cy + Math.sin(rot) * innerRadius; // 計算內半徑的y座標
    ctx.lineTo(x, y); // 畫線
    rot += step; // 增加旋轉角度

    drawStar(cx, cy, spikes, outerRadius, innerRadius, rot, step, i + 1); // 遞迴呼叫
  } else {
    ctx.lineTo(cx, cy - outerRadius); // 畫線回到星星的頂點
    ctx.closePath(); // 關閉路徑
    ctx.strokeStyle = "yellow"; // 設置邊線顏色
    ctx.stroke(); // 繪製實線
    ctx.fillStyle = "yellow"; // 設置填滿顏色
    ctx.fill(); // 填充圖形
  }
}

// -按鈕監聽- //
// 增加層級按鈕動作設定
// 當滑鼠按下時
add.addEventListener("mousedown", (event) => {
  if (maxLevel < 8) add.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
// 當滑鼠放開時
add.addEventListener("mouseup", (event) => {
  add.style = "transform: scale(100%)"; // UI:滑鼠放開時按鈕回覆原始大小
  if (maxLevel < 8) {
    maxLevel++; // 層級+1
    drawTree(); // 呼叫畫樹枝函數
    levelNum.innerHTML = maxLevel; // UI:更改畫面上的level數值
    add.style = "color: #000; border-color: #000; background-color: #989898;"; // UI: 將增加層級按鈕設定樣式成可點擊樣式
    reduce.style =
      "color: #000; border-color: #000; background-color: #989898;"; // UI: 將減少層級按鈕設定樣式成可點擊樣式
  }
  // UI: 當層級為八時，將增加按鈕樣式設定為不可點擊樣式
  if (maxLevel === 8) {
    add.style =
      "color: #989898; border-color: #989898; background-color: #ababab;";
  }
});
// 當滑鼠進入按鈕的範圍時
add.addEventListener("mouseenter", (e) => {
  if (maxLevel < 8) add.classList.add("btnEffect"); // UI:增加一個css class(類似於hover的功能)
});
// 當滑鼠離開按鈕的範圍時
add.addEventListener("mouseleave", (e) => {
  if (maxLevel < 8) {
    add.classList.remove("btnEffect"); // UI:去掉一個css class(類似於hover的功能)
    add.style = "transform: scale(100%)"; // UI:滑鼠離開時按鈕回覆原始大小
  }
});

// 減少層級按鈕動作設定
// 當滑鼠按下時
reduce.addEventListener("mousedown", (event) => {
  if (maxLevel > 1) reduce.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
// 當滑鼠放開時
reduce.addEventListener("mouseup", (event) => {
  reduce.style = "transform: scale(100%)"; // UI:滑鼠放開時按鈕回覆原始大小
  if (maxLevel > 1) {
    maxLevel--;
    drawTree(); //呼叫畫樹枝函數
    levelNum.innerHTML = maxLevel; // UI:更改畫面上的level數值
    add.style = "color: #000; border-color: #000; background-color: #989898;"; // UI: 將增加層級按鈕設定樣式成可點擊樣式
    reduce.style =
      "color: #000; border-color: #000; background-color: #989898;"; // UI: 將減少層級按鈕設定樣式成可點擊樣式
  }
  // UI: 當層級為一時，將減少按鈕樣式設定為不可點擊樣式
  if (maxLevel === 1) {
    reduce.style =
      "color: #989898; border-color: #989898; background-color: #ababab;";
  }
});
// 當滑鼠進入按鈕的範圍時
reduce.addEventListener("mouseenter", (e) => {
  if (maxLevel > 1) reduce.classList.add("btnEffect"); // UI:增加一個css class(類似於hover的功能)
});
// 當滑鼠離開按鈕的範圍時
reduce.addEventListener("mouseleave", (e) => {
  if (maxLevel > 1) {
    reduce.classList.remove("btnEffect"); // UI:去掉一個css class(類似於hover的功能)
    reduce.style = "transform: scale(100%)"; // UI:滑鼠離開時按鈕回覆原始大小
  }
});

//version按鈕動作設定
// 當滑鼠按下時
version.addEventListener("mousedown", (event) => {
  version.style = "transform: scale(90%)"; // UI:滑鼠點下時按鈕縮小
});
// 當滑鼠放開時
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
// 當滑鼠進入按鈕的範圍時
version.addEventListener("mouseenter", (e) => {
  version.classList.add("btnEffect"); // UI:增加一個css class(類似於hover的功能)
});
// 當滑鼠離開按鈕的範圍時
version.addEventListener("mouseleave", (e) => {
  version.classList.remove("btnEffect"); // UI:去掉一個css class(類似於hover的功能)
  version.style = "transform: scale(100%)"; // UI:滑鼠離開時按鈕回覆原始大小
});
