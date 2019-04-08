onmessage = function(e) {
  var workerResult = e.data[0];
  postMessage(workerResult);
}
