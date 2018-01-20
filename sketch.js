/*
===
Fast Style Transfer Simple Example
===
*/

let nets = {};
let modelNames = ['wave', 'la_muse', 'rain_princess', 'udnie', 'wreck', 'scream'];
let inputImg, styleImg;
let outputImgData;
let outputImg;

function setup() {
  createCanvas(252, 252).parent('canvasContainer');;
  inputImg = select('#input-img').elt;
  styleImg = select('#style-img').elt;
  modelNames.forEach(n => {
    nets[n] = new p5ml.TransformNet('models/' + n + '/', modelLoaded);
  });
}

// A function to be called when the model has been loaded
function modelLoaded() {
  if (nets['wave']) predictImg('wave');
}

function predictImg(modelName) {
  /**
  * @param inputImg HTMLImageElement of input img
  * @return Array3D containing pixels of output img
  */
  outputImgData = nets[modelName].predict(inputImg);
  // Convert the Array3D with image data to a p5.Image
  outputImg = array3DToP5Image(outputImgData);
  // Draw the p5.Image on the canvas
  image(outputImg, 0, 0);
}

/**
* @param imgData Array3D containing pixels of a img
* @return p5 Image
*/
function array3DToP5Image(imgData) {  
  const imgWidth = imgData.shape[0];
  const imgHeight = imgData.shape[1];
  const data = imgData.dataSync();
  const outputImg = createImage(imgWidth, imgHeight);
  outputImg.loadPixels();
  let k = 0;
  for (let i = 0; i < outputImg.width; i++) {
    for (let j = 0; j < outputImg.height; j++) {
      k = (i + j * height) * 3;
      let r = floor(256 * data[k + 0]);
      let g = floor(256 * data[k + 1]);
      let b = floor(256 * data[k + 2]);
      let c = color(r, g, b);
      outputImg.set(i, j, c);
    }
  }
  outputImg.updatePixels();
  return outputImg;
}

function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
  }
}
