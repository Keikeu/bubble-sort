var parent = document.getElementsByClassName("select--color")[0];
var colorsSelect = parent.getElementsByClassName("color");
var activeColor = parent.getElementsByClassName("active")[0].dataset.value;

var sizeSelect = document.getElementsByClassName("size")[0];
var size = sizeSelect.dataset.value;
var pegs = [];

var cr = document.getElementById("canvas-rows");
var ct = document.getElementById("canvas-trails");
var cm = document.getElementById("canvas-movement");
var ctxr = cr.getContext("2d");
var ctxt = ct.getContext("2d");
var ctxm = cm.getContext("2d");

var x_start;
var sorted = false;
var rows = [];
var indexes = [];
var r = [];
var g = [];
var b = [];
var row = 1;

for (var i = 0; i < colorsSelect.length; i++) {
  colorsSelect[i].addEventListener("click", onChangeColor)
}

function clearData() {
  ctxr.clearRect(0, 0, cr.width, cr.height);
  ctxt.clearRect(0, 0, ct.width, ct.height);
  ctxm.clearRect(0, 0, ct.width, ct.height);
  rows = [];
  indexes = [];
  sorted = false;
  row = 1;
  i = 0;
  frame = 0;
  draw(pegs);
  window.scrollTo(0, 0);
  w.postMessage([i]);
}

function onChangeColor() {
  var activeColorSelect = document.getElementsByClassName("active");
  activeColorSelect[0].className = activeColorSelect[0].className.replace(" active", "");
  this.className += " active";
  activeColor = parent.getElementsByClassName("active")[0].dataset.value;
  clearData();
}

function onChangeSizeUp() {
  if(parseInt(size)+1 <= 13) {
    sizeSelect.dataset.value = parseInt(size) + 1;
    onChangeSize();
  }
}

function onChangeSizeDown() {
  if(parseInt(size)-1 >= 3) {
    sizeSelect.dataset.value = parseInt(size) - 1;
    onChangeSize();
  }
}

function onChangeSize() {
  sizeSelect.innerHTML = sizeSelect.dataset.value;
  size = sizeSelect.dataset.value;
  init();
  clearData();
}

function init() {
  pegs = [];
  for(var i = 0; i < size; i++) {
    pegs.push(i);
  }
  pegs = shuffle(pegs);
  x_start = ((0.75 * window.innerWidth) - (size * 50)) / 2 + 25;
}

function shuffle(array) {
  var temp, rand;
  for(var index = 0; index < array.length; index++) {
    rand = Math.floor(Math.random() * index);
    temp = array[index];
    array[index] = array[rand];
    array[rand] = temp;
  }
  return array;
}

function reset() {
  size = sizeSelect.dataset.value;
  clearData();
}

function randomize() {
  size = sizeSelect.dataset.value;
  pegs = shuffle(pegs);
  clearData();
}

function draw(pegs) {
  for(var index = 0; index < size; index++) {
    ctxr.beginPath();
    ctxr.arc(50 * index + x_start, 50, pegs[index] * 12/size + 10, 0, 2 * Math.PI);
    var r_pegs = parseInt(activeColor.split(",")[0]) + (size - pegs[index]) * Math.floor((255 - parseInt(activeColor.split(",")[0])) / size);
    var g_pegs = parseInt(activeColor.split(",")[1]) + (size - pegs[index]) * Math.floor((255 - parseInt(activeColor.split(",")[1])) / size);
    var b_pegs = parseInt(activeColor.split(",")[2]) + (size - pegs[index]) * Math.floor((255 - parseInt(activeColor.split(",")[2])) / size);

    ctxr.fillStyle = 'rgb(' + r_pegs + ', ' + g_pegs + ', ' + b_pegs + ')';
    ctxr.fill();
  }
}

var frame = 0;
var i = 0;

function animateRows() {
  for(var j = 0; j < size; j++) {
    ctxr.beginPath();
    ctxr.fillStyle = 'rgb(' + r[i][j] + ', ' + g[i][j] + ', ' + b[i][j] + ')';
    ctxr.arc(50 * j + x_start, 50 + 100 * i, rows[i][j] * 12/size + 10, 0, 2 * Math.PI);
    ctxr.fill();
  }
}

function animateTrails() {
  for(var j = 0; j < size; j++) {
    ctxt.beginPath();
    ctxt.fillStyle = 'rgb(' + r[i][j] + ', ' + g[i][j] + ', ' + b[i][j] + ')';
    if(j == indexes[i][0]) {
      ctxt.arc(50 * j + x_start + (frame%50), 50 + frame*2, 2, 0, 2 * Math.PI);
    } else if(j == indexes[i][1]) {
      ctxt.arc(50 * j + x_start - (frame%50), 50 + frame*2, 2, 0, 2 * Math.PI);
    } else {
      ctxt.arc(50 * j + x_start, 50 + frame*2, 2, 0, 2 * Math.PI);
    }
    ctxt.fill();
  }
}

function animateMovement() {
  ctxm.clearRect(0, 0, cm.width, cm.height);
  for(var j = 0; j < size; j++) {
    ctxm.beginPath();
    ctxm.fillStyle = 'rgb(' + r[i][j] + ', ' + g[i][j] + ', ' + b[i][j] + ')';
    if(j == indexes[i][0]) {
      ctxm.arc(50 * j + x_start + (frame%50), 50 + frame*2, rows[i][j] * 12/size + 10, 0, 2 * Math.PI);
    } else if(j == indexes[i][1]) {
      ctxm.arc(50 * j + x_start - (frame%50), 50 + frame*2, rows[i][j] * 12/size + 10, 0, 2 * Math.PI);
    } else {
      ctxm.arc(50 * j + x_start, 50 + frame*2, rows[i][j] * 12/size + 10, 0, 2 * Math.PI);
    }
    ctxm.fill();
  }
}

function bubbleSort(array) {
  rows[0] = pegs;
  while(!sorted) {
    sorted = true;
    for(var index = 0; index < array.length; index++) {
      var element = array[index];
      if(element > array[index+1]) {
        array[index] = array[index+1];
        array[index+1] = element;

        rows[row] = new Array(size);
        rows[row] = array.slice(0);

        r[row-1] = new Array(size);
        g[row-1] = new Array(size);
        b[row-1] = new Array(size);
        for(var j = 0; j < size; j++) {
          r[row-1][j] = parseInt(activeColor.split(",")[0]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[0])) / size);
          g[row-1][j] = parseInt(activeColor.split(",")[1]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[1])) / size);
          b[row-1][j] = parseInt(activeColor.split(",")[2]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[2])) / size);
        }

        indexes[row-1] = new Array(2);
        indexes[row-1][0] = index;
        indexes[row-1][1] = index+1;

        sorted = false;
        row++;
      }
    }
  }

  r[row-1] = new Array(size);
  g[row-1] = new Array(size);
  b[row-1] = new Array(size);
  for(var j = 0; j < size; j++) {
    r[row-1][j] = parseInt(activeColor.split(",")[0]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[0])) / size);
    g[row-1][j] = parseInt(activeColor.split(",")[1]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[1])) / size);
    b[row-1][j] = parseInt(activeColor.split(",")[2]) + (size - rows[row-1][j]) * Math.floor((255 - parseInt(activeColor.split(",")[2])) / size);
  }

  indexes[row-1] = new Array(2);
  indexes[row-1][0] = index;
  indexes[row-1][1] = index+1;

  var height = 100 * rows.length;
  ct.height = height;
  cr.height = height;
  cm.height = height;
}


function visualize() {
  if(sorted == false) {
    var temp = [];
    temp = pegs.slice(0);
    bubbleSort(temp);
    startWorker();

    function anim() {
      if(frame % 50 == 0) {
        animateRows();
      }
      animateTrails();
      animateMovement();
      frame++;
      window.scrollTo(0, frame * 2 - (window.innerHeight - 100));

      if(frame % 50 == 0) {
        i++;
        w.postMessage([i]);
      }
      if(i+1 < rows.length) {
        requestAnimationFrame(anim);
      }
    }
    anim();
  }
}

init();
draw(pegs);
startWorker();



// ============================= web worker ====================================
var w;

function startWorker() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
      w = new Worker("worker.js");
    }
    w.onmessage = function(event) {
      document.getElementById("counter").innerHTML = event.data;
    };
  } else {
    document.getElementById("counter").innerHTML = "Web worker is not available for this browser.";
  }
}

function stopWorker() {
  w.terminate();
  w = undefined;
}
