window.onload = function() {
	var streaming = false,
		video = document.querySelector('#video'),
		pics = document.querySelectorAll('#right > div'),
		startbutton = document.querySelector('#startbutton'),
		comparebutton = document.querySelector('#comparebutton'),
		hiddenCanvas = document.createElement('canvas'),
		image1 = new Image(),
		image2 = new Image(),
		imgs = [image1, image2];
	width = 300, height = 0, i = 0;

	navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

	navigator.getMedia({
		video: true,
		audio: false
	}, function(stream) {
		if (navigator.mozGetUserMedia) {
			video.mozSrcObject = stream;
		} else {
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);
		}
		video.play();
	}, function(err) {
		console.log("An error occured! " + err);
	});

	video.addEventListener('canplay', function(ev) {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth / width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			video.style.height = height + 'px';
			for (var i = 0, len = pics.length; i < len; i++) {
				pics[i].style.height = height + 'px';
			}
			streaming = true;
		}
	}, false);

	function takepicture() {
		hiddenCanvas.width = width;
		hiddenCanvas.height = height;
		hiddenCanvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = hiddenCanvas.toDataURL('image/png');
		pics[i % 2].style.background = 'url(' + data + ') no-repeat';
		imgs[i % 2].src = data;
		i++;
	}

	startbutton.addEventListener('click', function(ev) {
		takepicture();
		ev.preventDefault();
	}, false);

	comparebutton.addEventListener('click', function(ev) {
		resemble(image1).compareTo(image2).ignoreColors().onComplete(function(data) {
			alert('匹配度：' + (100 - data.misMatchPercentage) + '%');
			/*
    {
      misMatchPercentage : 100, // %
      isSameDimensions: true, // or false
      getImageDataUrl: function(){}
    }
    */
		});


		ev.preventDefault();
	}, false);
};