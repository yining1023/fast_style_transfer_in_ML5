/*
===
Fast Style Transfer Simple Demo
===
*/

let nets = {};
let modelNames = ['la_muse', 'rain_princess', 'udnie', 'wreck', 'scream', 'wave'];
let inputImg, styleImg;
let outputImgData;
let outputImg;
let modelNum = 0;
let currentModel = 'wave';
let uploader;
let webcam = false;
let modelReady = false;
let video;
let start = false;

function setup() {
  noCanvas();
  inputImg = select('#input-img').elt;
  styleImg = select('#style-img').elt;

  // load models
  modelNames.forEach(n => {
    nets[n] = new p5ml.TransformNet('models/' + n + '/', modelLoaded);
  });

  // Image uploader
  uploader = select('#uploader').elt;
  uploader.addEventListener('change', gotNewInputImg);

  // output img container
  outputImgContainer = createImg('images/wave.jpg', 'image');
  outputImgContainer.parent('output-img-container');
}

// A function to be called when the model has been loaded
function modelLoaded() {
  modelNum++;
  if (modelNum >= modelNames.length) {
    modelReady = true;
    predictImg(currentModel);
  }
}

function predictImg(modelName) {
  if (!modelReady) return;
  if (webcam && video) {
    outputImgData = nets[modelName].predict(video.elt);
  } else if (inputImg) {
    outputImgData = nets[modelName].predict(inputImg);
  }
  outputImg = p5ml.array3DToImage(outputImgData);
  outputImgContainer.elt.src = outputImg.src;
}

function draw() {
  if (modelReady && webcam && video && video.elt && start) {
    predictImg(currentModel);
  }
}

function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
    currentModel = ele.id;
  }
  if (currentModel) {
    predictImg(currentModel);
  }
}

function updateInputImg(ele) {
  deactiveWebcam();
  if (ele.src) inputImg.src = ele.src;
  predictImg(currentModel);
}

function uploadImg() {
  uploader.click();
  deactiveWebcam();
}

function gotNewInputImg() {
  if (uploader.files && uploader.files[0]) {
    let newImgUrl = window.URL.createObjectURL(uploader.files[0]);
    inputImg.src = newImgUrl;
    inputImg.style.width = '250px';
    inputImg.style.height = '250px';
  }
}

function useWebcam() {
  if (!video) {
    // webcam video
    video = createCapture(VIDEO);
    video.size(250, 250);
    video.parent('input-source');
  }
  webcam = true;
  select('#input-img').hide();
  outputImgContainer.addClass('reverse-img');
}

function deactiveWebcam() {
  start = false;
  select('#input-img').show();
  outputImgContainer.removeClass('reverse-img');
  webcam = false;
  if (video) {
    video.hide();
    video = '';
  }
}

function onPredictClick() {
  if (webcam) start = true;
  predictImg(currentModel);
}

/**
* @param imgData Array3D containing pixels of a img
* @return p5 Image
*/
// function array3DToP5Image(imgData) {  
//   const imgWidth = imgData.shape[0];
//   const imgHeight = imgData.shape[1];
//   const data = imgData.dataSync();
//   const outputImg = createImage(imgWidth, imgHeight);
//   outputImg.loadPixels();
//   let k = 0;
//   for (let i = 0; i < outputImg.width; i++) {
//     for (let j = 0; j < outputImg.height; j++) {
//       k = (i + j * height) * 3;
//       let r = floor(256 * data[k + 0]);
//       let g = floor(256 * data[k + 1]);
//       let b = floor(256 * data[k + 2]);
//       let c = color(r, g, b);
//       outputImg.set(i, j, c);
//     }
//   }
//   outputImg.updatePixels();
//   return outputImg;
// }
