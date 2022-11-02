import "./style.scss";
import { hex2Rgb } from "./utils";
import { Image as WImage, InternalState } from "../wasm/pkg";

const cellSize = 30;

interface IState {
  internal: InternalState;
  /** 当前画笔的颜色 */
  currentColor: Array<number>;
  dragging: boolean;
  /** 橡皮擦的颜色 */
  eraserColor?: Array<number>;
}

import("../wasm/pkg").then((module) => {
  const internal = new module.InternalState(40, 40);

  function init() {
    const state: IState = {
      internal,
      currentColor: [0, 0, 0],
      dragging: false,
      eraserColor: []
    };

    draw(state);
    setupCanvas(state);
  }
  init();
});

function draw(state: IState) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  const image = state.internal.image();

  const width = image.width();
  const height = image.height();
  const cells = image.cells();

  // 方格
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 3;
      const color = `rgb(${cells[index + 0]}, ${cells[index + 1]}, ${
        cells[index + 2]
      })`;

      ctx.fillStyle = color;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // 水平分割线
  for (let x = 0; x <= height; x++) {
    ctx.beginPath();
    ctx.moveTo(0, x * cellSize + (x == height ? -1 : 1));
    ctx.lineTo(width * cellSize, x * cellSize + (x == height ? -1 : 1));
    ctx.stroke();
  }

  // 垂直分割线
  for (let y = 0; y <= width; y++) {
    ctx.beginPath();
    ctx.moveTo(y * cellSize + (y == width ? -1 : 1), 0);
    ctx.lineTo(y * cellSize + (y == width ? -1 : 1), height * cellSize);
    ctx.stroke();
  }
}

function setupCanvas(state: IState) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  canvas.addEventListener(
    "mousedown",
    () => {
      state.dragging = true;
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    () => {
      state.dragging = false;
    },
    false
  );

  canvas.addEventListener(
    "mousemove",
    (event) => {
      if (!state.dragging) return;

      const rect = canvas.getBoundingClientRect();

      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      x = Math.floor((x * 2) / cellSize);
      y = Math.floor((y * 2) / cellSize);
      // 避免出现负数
      x = x >= 0 ? x : 0;
      y = y >= 0 ? y : 0;

      const color =
        state.eraserColor?.length > 0 ? state.eraserColor : state.currentColor;

      state.internal.brush(x, y, color as unknown as Uint8Array);
      draw(state);
    },
    false
  );

  // TODO: 颜色选择
  (document.getElementById("color") as HTMLInputElement).addEventListener(
    "change",
    (event: any) => {
      state.currentColor = hex2Rgb(event.target?.value);
      clearEraser(state);
    },
    false
  );

  // TODO: 橡皮擦
  document.getElementById("eraser").addEventListener(
    "click",
    () => {
      toggleEraser(state);
    },
    false
  );

  // TODO: 撤销
  document.getElementById("undo").addEventListener(
    "click",
    () => {
      state.internal.undo();
      draw(state);
    },
    false
  );

  // TODO: 重做
  document.getElementById("redo").addEventListener(
    "click",
    () => {
      state.internal.redo();
      draw(state);
    },
    false
  );

  // TODO: 清空
  document.getElementById("clear").addEventListener(
    "click",
    () => {
      state.internal.clear();
      draw(state);
    },
    false
  );

  // TODO: 成 png 图片
  document.getElementById("downloadPng").addEventListener(
    "click",
    () => {
      downloadImage("image/png", state.internal.image());
    },
    false
  );

  // TODO: 成 jpeg 图片
  document.getElementById("downloadJpeg").addEventListener(
    "click",
    () => {
      downloadImage("image/jpeg", state.internal.image());
    },
    false
  );
}

/**
 *
 * @param type string
 * @param image WImage
 */
function downloadImage(type: "image/png" | "image/jpeg", image: WImage) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  console.time("downloadImage");
  const width = image.width();
  const height = image.height();
  const cells = image.cells();

  canvas.width = 1200;
  canvas.height = 1200;
  canvas.style.height = "600px";
  canvas.style.width = "600px";
  canvas.style.display = "none";

  // 方格
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 3;
      const color = `rgb(${cells[index + 0]}, ${cells[index + 1]}, ${
        cells[index + 2]
      })`;

      ctx.fillStyle = color;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  const imageData = ctx.getImageData(0, 0, 1200, 1200);

  const data = imageData.data;
  const len = data.length;
  // console.log(data);
  for (let i = 0; i < len; ) {
    if (
      data[i] === 255 &&
      data[i + 1] === 255 &&
      data[i + 2] === 255 &&
      type === "image/png"
    ) {
      // 不透明度 0
      data[i + 3] = 0;
    }
    i += 4;
  }

  ctx.putImageData(imageData, 0, 0);

  document.body.appendChild(canvas);

  console.timeEnd("downloadImage");

  // 创建一个 a 标签，并设置 href 和 download 属性
  const el = document.createElement("a");
  // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
  el.href = canvas.toDataURL(type, 1);
  el.download = "pixel";

  // 创建一个点击事件并对 a 标签进行触发
  const event = new MouseEvent("click");
  el.dispatchEvent(event);

  document.body.removeChild(canvas);
}

function toggleEraser(state: IState) {
  const canvas = document.getElementById("canvas");

  if (!canvas.classList.contains("eraser")) {
    canvas.classList.add("eraser");
    state.eraserColor = [255, 255, 255];
  } else {
    canvas.classList.remove("eraser");
    state.eraserColor = [];
  }

  // 设置激活
  const el = document.getElementById("eraser");
  if (!el.classList.contains("active")) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
  }
}

function clearEraser(state: IState) {
  const canvas = document.getElementById("canvas");
  if (canvas.classList.contains("eraser")) {
    canvas.classList.remove("eraser");
  }

  state.eraserColor = [];
}
