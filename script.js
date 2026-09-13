const canvas = document.getElementById("canvas")

const ctx = canvas.getContext("2d")

const xEnd = canvas.width;
const yCenter = canvas.height / 2;
const xCenter = canvas.width / 2;
const unitScale = 50;


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

  ctx.fillRect(xCenter, yCenter, scale, scale);

  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter - scale);
  ctx.lineTo(xCenter - scale / 2, yCenter);
  ctx.lineTo(xCenter, yCenter);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.arc( xCenter, yCenter, scale / 2, Math.PI / 2, Math.PI);
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


}


//Проверка checkbox

const xCheckboxes = document.querySelectorAll('input[name="x"]')
const selectedR = document.getElementById("r");
const form = document.getElementById('pointForm');
const tableBody = document.querySelector('#resultTable tbody');

xCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      xCheckboxes.forEach((otherCheckbox) => {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });
    }
  });
});

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

  const date = new Date(result.timestamp);
  const formattedDate = date.toLocaleString("ru-RU");

  const dateCell = row.insertCell();
  dateCell.textContent = formattedDate;

  tableBody.appendChild(row);
}

function loadResults() {
  const savedResults = localStorage.getItem('results');
  if (savedResults){
    const results = JSON.parse(savedResults);

    results.forEach(result => {
      addResultToTable(result);
    });
  }
}

function drawResultPoint(result) {
  const pointX = xCenter + result.x * unitScale;
  const pointY = yCenter - result.y * unitScale;

  drawPoint(pointX, pointY, result.hit);
}

function drawSavedPoints(currentR){
  const savedPoints = localStorage.getItem('results');

  if (savedPoints){
    const results = JSON.parse(savedPoints);

    results.forEach(result => {
      if (currentR === result.r){
        drawResultPoint(result);
      }
    })
  }
}

form.addEventListener("submit", (event) =>{
  event.preventDefault();

  const selectedX = document.querySelector('input[name="x"]:checked');
  const yInput = document.querySelector('input[name="y"]');

  if (selectedX === null ){
    alert("Введите X");
    return;
  }
  const x = Number(selectedX.value);

  if (yInput.value.trim() === "") {
    alert("Введите Y");
    return;
  }

  const y = Number(yInput.value);

  if (Number.isNaN(y)){
    alert("Y должен быть числом");
    return;
  }

  if (y < -3 || y > 5){
    alert("Y должен быть в диапазоне от -3 до 5");
    return;
  }

  const r = Number(selectedR.value);
  const pointX = xCenter + x * unitScale;
  const pointY = yCenter - y * unitScale;

  const inRectangle =
    x >= 0 &&
    x <= r &&
    y >= -r &&
    y <= 0;

  const inCircle =
    x <= 0 &&
    y <= 0 &&
    x * x + y * y <= (r / 2) * (r / 2);

  const inTriangle =
    x >= -r/2 &&
    x <= 0 &&
    y >= 0 &&
    y <= 2 * x + r

  const hit = inCircle || inTriangle || inRectangle;

  drawPoint(pointX, pointY, hit);

  const result = {
    x,
    y,
    r,
    hit,
    timestamp: Date.now()
  };
  addResultToTable(result);

  const savedResults = localStorage.getItem("results");
  const results = savedResults ? JSON.parse(savedResults) : [];
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));
});

selectedR.addEventListener("change", () => {
  const r = Number(selectedR.value);

  drawGraph(r);
  drawSavedPoints(r);
});

drawGraph(Number(selectedR.value));
loadResults();
drawSavedPoints(Number(selectedR.value));


