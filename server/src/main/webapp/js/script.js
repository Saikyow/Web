const canvas = document.getElementById("canvas")
const STORAGE_KEY = "lab2-504864";

const Y_MIN = -3;
const Y_MAX = 5;
const Y_MAX_LENGTH = 10;
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;

const selectedR = document.getElementById("r");
const form = document.getElementById('pointForm');
const tableBody = document.querySelector('#resultTable tbody');
const xError = document.getElementById("xError")
const yError = document.getElementById("yError")
const serverError = document.getElementById("serverError")
const clearResultsButton = document.getElementById("clearResults")
const rError = document.getElementById("rError")

const ctx = canvas.getContext("2d")

let xEnd;
let yCenter;
let xCenter;
let unitScale;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  xEnd = canvas.width;
  yCenter = canvas.height / 2;
  xCenter = canvas.width / 2;

  unitScale = Math.min(canvas.width, canvas.height) / 12;

  redrawGraph();
}

function loadSavedResults() {
  const savedResults = localStorage.getItem(STORAGE_KEY);
  return savedResults ? JSON.parse(savedResults) : [];
}

function saveResult(result){
  addResultToTable(result);
  const results = [...loadSavedResults(), result];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// Отрисовка
function drawGraph(r){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";

  const scale = r * unitScale;

  ctx.beginPath();
  ctx.moveTo(xCenter, 0);
  ctx.lineTo(xCenter + 10, 10)
  ctx.moveTo(xCenter, 0);
  ctx.lineTo(xCenter - 10, 10)
  ctx.font = "16px sans-serif";
  ctx.fillText("Y", xCenter + 12, 12)
  ctx.stroke();

  ctx.fillStyle = "#5c5cce"

  // III четверть: прямоугольник от -R до 0 по X и от -R/2 до 0 по Y
  ctx.fillRect(xCenter - scale, yCenter, scale, scale / 2);

  // II четверть: треугольник (0,0), (-R/2,0), (0,R/2)
  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.lineTo(xCenter - scale / 2, yCenter);
  ctx.lineTo(xCenter, yCenter - scale / 2);
  ctx.closePath();
  ctx.fill();

  // IV четверть: четверть круга радиусом R/2 (на canvas ось Y направлена вниз)
  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.arc(xCenter, yCenter, scale / 2, 0, Math.PI / 2);
  ctx.closePath();
  ctx.fill();


  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();


  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();



  ctx.beginPath();
  ctx.moveTo(xEnd, yCenter);
  ctx.lineTo(xEnd - 10, yCenter - 10);

  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";

  ctx.moveTo(xEnd, yCenter);
  ctx.lineTo(xEnd - 10, yCenter + 10);
  ctx.font = "16px sans-serif";
  ctx.fillText("X", xEnd - 12, yCenter - 12)

  ctx.stroke();



  ctx.beginPath();
  ctx.moveTo(xCenter + scale / 2, yCenter - 5);
  ctx.lineTo(xCenter + scale / 2, yCenter + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter + scale, yCenter - 5);
  ctx.lineTo(xCenter + scale, yCenter + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter - scale / 2, yCenter - 5);
  ctx.lineTo(xCenter - scale / 2, yCenter + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter - scale, yCenter - 5);
  ctx.lineTo(xCenter - scale, yCenter + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter + 5, yCenter - scale / 2);
  ctx.lineTo(xCenter - 5, yCenter - scale / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter + 5, yCenter - scale);
  ctx.lineTo(xCenter - 5, yCenter - scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter + 5, yCenter + scale / 2);
  ctx.lineTo(xCenter - 5, yCenter + scale / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xCenter + 5, yCenter + scale);
  ctx.lineTo(xCenter - 5, yCenter + scale);
  ctx.stroke();

  drawAxisLabels(scale);
}

function drawAxisLabels(scale) {
  const X_AXIS_LABEL_OFFSET = 24;
  const Y_AXIS_LABEL_OFFSET = 22;
  const labels = [
    { text: "-R", ratio: -1 },
    { text: "-R/2", ratio: -0.5 },
    { text: "R/2", ratio: 0.5 },
    { text: "R", ratio: 1 }
  ];

  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  labels.forEach(({ text, ratio }) => {
    ctx.fillText(text, xCenter + ratio * scale, yCenter - ratio * X_AXIS_LABEL_OFFSET);
    ctx.fillText(text, xCenter - Math.sign(ratio) * Y_AXIS_LABEL_OFFSET, yCenter - ratio * scale);
  });

  ctx.restore();
}

function drawPoint(pointX, pointY, hit) {
  ctx.beginPath();
  ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
  if (hit){
    ctx.fillStyle = "green";
  }else {
    ctx.fillStyle = "red";
  }
  ctx.fill();
}

function addResultToTable(result) {
  const row = document.createElement("tr");

  const xCell = row.insertCell();
  xCell.textContent = result.x;

  const yCell = row.insertCell();
  yCell.textContent = result.y;

  const rCell = row.insertCell();
  rCell.textContent = result.r;

  const hitCell = row.insertCell();
  hitCell.textContent = result.hit ? "Попадание" : "Промах";

  const dateCell = row.insertCell();
  dateCell.textContent = new Date(result.currentTime).toLocaleString("ru-RU");

  const executionCell = row.insertCell();
  executionCell.textContent = `${(result.executionTimeNs / 1000).toFixed(1)} мкс`;

  for (const cell of row.cells){
    cell.classList.add("results__cell")
  }

  tableBody.appendChild(row);
}

function loadResults() {
  loadSavedResults().forEach(result => {
    addResultToTable(result);
  });
}

function drawResultPoint(result) {
  const pointX = xCenter + result.x * unitScale;
  const pointY = yCenter - result.y * unitScale;

  drawPoint(pointX, pointY, result.hit);
}

function drawSavedPoints(currentR){
  loadSavedResults()
    .filter(result => Number(result.r) === currentR)
    .forEach(drawResultPoint);
}

function clearResults() {
  localStorage.removeItem(STORAGE_KEY);
  tableBody.replaceChildren();

  const r = Number(selectedR.value);
  drawGraph(r);
}

function smartSelect(event) {
  const isSelected = (event.metaKey || event.ctrlKey) && event.code === "KeyA" &&
    !event.altKey && !event.shiftKey;

  if (!isSelected) {
    return;
  }

  const activeElement = document.activeElement;

  if (
    activeElement &&
    activeElement.matches("input, textarea, select")
  ){
    return;
  }

  const table = document.getElementById("resultTable");
  const selection = window.getSelection();

  if (!selection || !table) {
    return;
  }

  event.preventDefault();

  const range = document.createRange();
  range.selectNodeContents(table);

  selection.removeAllRanges();
  selection.addRange(range);
}

// Возвращает текст ошибки или null, если Y корректен
function validateY(rawY) {
  if (rawY === "") {
    return "Введите Y";
  }
  if (rawY.length > Y_MAX_LENGTH) {
    return `Y не длиннее ${Y_MAX_LENGTH} символов`;
  }
  if (!NUMBER_PATTERN.test(rawY)) {
    return "Y должен быть числом, например -1.5";
  }
  const y = Number(rawY);
  if (y <= Y_MIN || y >= Y_MAX) {
    return `Y должен быть в интервале (${Y_MIN}; ${Y_MAX})`;
  }
  return null;
}

function validateR(rawR) {
  if (rawR === "") {
    return "Введите R"
  }
  if (rawR.length > 10) {
    return `R не длиннее 10 символов`;
  }
  if (!NUMBER_PATTERN.test(rawR)) {
    return "R должен быть числом, например 3.5";
  }

  const r = Number(rawR);
  if (r <= 2 || r >= 5) {
    return "R должен быть в интервале (2; 5)";
  }

  return null;
}

function redrawGraph() {
  const rawR = selectedR.value.trim().replace(",", ".");

  if (validateR(rawR) !== null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const r = Number(rawR);
  drawGraph(r);
  drawSavedPoints(r);
}

form.addEventListener("submit", (event) =>{
  xError.textContent = "";
  yError.textContent = "";
  serverError.textContent = "";
  rError.textContent = "";

  const selectedX = document.querySelector('input[name="x"]:checked');
  const yInput = document.querySelector('input[name="y"]');
  const rawR = selectedR.value.trim().replace(",", ".");
  const rErrorMessage = validateR(rawR);

  if (rErrorMessage !== null) {
    event.preventDefault();
    rError.textContent = rErrorMessage;
    return;
  }

  if (selectedX === null ){
    event.preventDefault();
    xError.textContent = "Выберите X";
    return;
  }

  const rawY = yInput.value.trim().replace(",", ".");
  const yErrorMessage = validateY(rawY);
  if (yErrorMessage !== null) {
    event.preventDefault();
    yError.textContent = yErrorMessage;
    return;
  }

   yInput.value = rawY;
   selectedR.value = rawR;
});

selectedR.addEventListener("input", redrawGraph);

window.addEventListener("resize", resizeCanvas);

clearResultsButton.addEventListener("click", clearResults);
document.addEventListener("keydown", smartSelect)

resizeCanvas();
loadResults();
