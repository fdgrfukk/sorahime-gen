window.onload = function(){
	var bgimage = document.getElementById("bg");
	var foreground = document.getElementById("foreground");
	var imageresult = document.getElementById("result");

	var uploadbtn = document.getElementById('Upload');

	var container = document.querySelector(".container");

	var cwidth = 1920;
	var cheight = 1080;

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	var fileReader = new FileReader();


	function RefreshCanvas(imgfilePath){
		var imgwindow = 'img/window.png';
		var sample = 'img/sample.png';
		var BG = getSelected();
		//var imgs = { 1: BG, 2: imgfile, 3: imgwindow };

		sources = [];

		if ( !imgfilePath ){
			sources = [ BG, imgwindow ];
		} else {
			sources = [ BG, imgfilePath, imgwindow ];
		};

		var numFiles = sources.length;
		var loadedCount = 0;
		var imageObjectArray = [];

		function loadImages(){
			var imgObj = new Image();
			imgObj.addEventListener('load',
			function(){
				loadedCount++;
				imageObjectArray.push(imgObj);
				if(numFiles === loadedCount){
					drawImages();
				}else{
					loadImages();
				}
			},
			false
		);
		imgObj.src = sources[imageObjectArray.length];
	}
	function drawImages(){
		canvas.width = cwidth;
		canvas.height = cheight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i in imageObjectArray){
			if (imageObjectArray.length == 3 && i == 1) {
				var pos = ImageScaler(imageObjectArray[i].width, imageObjectArray[i].height);
				//var pos = CalcPos(imageObjectArray[i].width, imageObjectArray[i].height);
				//sx, sy, sw, sh, dx, dy, dw, dh
				ctx.drawImage(imageObjectArray[i], pos[0], pos[1], pos[2], pos[3], pos[4], pos[5], pos[6], pos[7]);
				//ctx.drawImage(imageObjectArray[i], pos[0], pos[1]);
			} else {
				ctx.drawImage(imageObjectArray[i], 0, 0);
			}

			imageObjectArray[i] = null;
		}
		setText();
		CanvasToResult();

	}
	loadImages();
}

function CanvasToResult() {
	var url = canvas.toDataURL();
	imageresult.src = url;
	download.href = url;
}

// Dynamically resize the canvas to be its CSS displayed size
// (window.onresize = function(){
// 	canvas.width  = canvas.offsetWidth;
// 	canvas.height = canvas.offsetHeight;
// })();

function uploadImage(fileName){
	var files = document.getElementById('Upload').files;
	var file = files[0];
	handleFile(file);
}

function handleFile(file){
	var reader = new FileReader();
	// file loaded
	fileReader.addEventListener('load', function(event){
		var imagefile = new Image();
		imgfile = event.target.result;
		RefreshCanvas(imgfile);
	}, false
);
fileReader.readAsDataURL(file);
// couldnot file loaded
fileReader.onerror = function(e){
	alert('画像の読み込みに失敗しました。');
	return null;
};
}

function CalcPos(imgwidth, imgheight) {
	var xy = [ cwidth/2 - imgwidth/2, cheight/2 - imgheight/2 ];
	return xy;
}

function ImageScaler(iwidth, iheight) {
	var hRatio = 1920  / iwidth;
	var vRatio =  1080 / iheight;
	var ratio  = Math.min ( hRatio, vRatio );
	var centerShift_x = ( 1920 - iwidth*ratio ) / 2;
	var centerShift_y = ( 1080 - iheight*ratio ) / 2;

	var pos = [0, 0, iwidth, iheight, centerShift_x, centerShift_y, iwidth*ratio, iheight*ratio];
	return pos;
}

function resizeCanvas() {
	var canvasArea = document.createElement("canvas-container");

	var widthToHeight = cwidth / cheight;
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	var newWidthToHeight = newWidth / newHeight;

	if (newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
		canvasArea.style.height = newHeight + 'px';
		canvasArea.style.width = newWidth + 'px';
	} else {
		newHeight = newWidth / widthToHeight;
		canvasArea.style.width = newWidth + 'px';
		canvasArea.style.height = newHeight + 'px';
	}

	canvasArea.style.marginTop = (-newHeight / 2) + 'px';
	canvasArea.style.marginLeft = (-newWidth / 2) + 'px';

	//canvas.width = newWidth;
	//canvas.height = newHeight;
}

function getSelected() {

	var chkd = document.getElementsByName("s2");
	for (i = 0; i < chkd.length; i++) {
		if (chkd[i].checked) {
			var _val = "img/" + chkd[i].value;
		}
	}
	var chkd = document.getElementsByName("s1");
	for (i = 0; i < chkd.length; i++) {
		if (chkd[i].checked) {
			_val = _val + chkd[i].value + ".png";
		}
	}
	return _val;
}

function setText(topText, middleText){
	//
	var top = document.getElementById("name");
	var middle = document.getElementById("words");
	var topTextSize = 44;
	var middleTextSize = 28;
	var middleBottomPadding = 20;
	var topTextFont = `normal 200 ${topTextSize}px/2 "Mplus 1p"`;
	var middleTextFont = `normal 200 ${topTextSize}px/2 "Mplus 1p"`;
	var bottomTextFont = `normal 200 ${middleTextSize}px/2 "Mplus 1p"`;
	var pos = {top: [20,214], middle: [100,694], bottom: [136,789]};
	var topText = top.value;
	var middleText = middle.value;

	// prepare canvas
	ctx.save();
	ctx.textBaseline = "top";

	// stroke name1(top) text
	ctx.font = topTextFont;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.lineJoin = "miter";
	ctx.lineWidth = 1.2;
	ctx.shadowColor = "transparent";
	ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
	ctx.shadowBlur = 5;
	ctx.fillText(topText, pos.top[0], pos.top[1]);
	ctx.strokeText(topText, pos.top[0], pos.top[1]);
	ctx.save();

	// stroke name2 (middle) text
	ctx.font = topTextFont;
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineJoin = "miter";
	ctx.lineWidth = 2.0;
	ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.fillText(topText, pos.middle[0], pos.middle[1]);
	ctx.strokeText(topText, pos.middle[0], pos.middle[1]);
	ctx.save();

	// stroke name2 (middle) text
	ctx.font = middleTextFont;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.lineJoin = "miter";
	ctx.lineCap = "square";
	ctx.lineWidth = 0.8;
	ctx.shadowColor = "transparent";
	ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
	ctx.shadowBlur = 8;
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 3;
	ctx.fillText(middleText, pos.bottom[0], pos.bottom[1]);
	ctx.strokeText(middleText, pos.bottom[0], pos.bottom[1]);
	ctx.save();

}

randombg();
RefreshCanvas("");
resizeCanvas();

var download = document.getElementById("download");

download.addEventListener("click", function(){
	canvas.toBlob(function(blob) {
		var top = document.getElementById("name");
		saveAs(blob, top.value + ".png");
	});
});
uploadbtn.addEventListener('change', uploadImage, false);

function randombg(){
	var random= Math.floor(Math.random() * 11) + 0;
	var bigSize = ['url(img/bg/bg1.jpg)', 'url(img/bg/bg2.jpg)',
	'url(img/bg/bg3.jpg)', 'url(img/bg/bg4.jpg)',
	'url(img/bg/bg5.jpg)', 'url(img/bg/bg6.jpg)',
	'url(img/bg/bg7.jpg)', 'url(img/bg/bg8.jpg)',
	'url(img/bg/bg9.jpg)', 'url(img/bg/bg10.jpg)',
	'url(img/bg/bg11.jpg)'];

	bgimage.style.backgroundImage=bigSize[random];
}



};
