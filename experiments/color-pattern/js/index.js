(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		var image = new Image();

		image.onload = function() {
			var canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			canvas.style.backgroundColor = '#cccccc';
			document.body.appendChild(canvas);

			var ctx = canvas.getContext('2d');

			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


			var pixel = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

			// WebWorker を生成
			var worker = new Worker('js/worker.js');

			worker.addEventListener('message', function(e) {
			  console.log('Worker said: ', e.data);

			  var elUl = document.querySelector('#color-ul');
			  var fragment = document.createDocumentFragment();

			  for (var i = 0, len = e.data.composition.length; i < len; i++) {
			  	var li = document.createElement('li');
			  	li.style.width = e.data.composition[i][1].percentage * 2 + 'px';
			  	li.style.height = '100px';
			  	li.style.backgroundColor = 'rgb(' +
			  		e.data.composition[i][1].r + ',' + 
			  		e.data.composition[i][1].g + ',' + 
			  		e.data.composition[i][1].b + ')';
					li.style.listStyleType = 'none';
			  	li.style.float = 'left';
			  	fragment.appendChild(li);
			  }
			  elUl.appendChild(fragment);
			}, false);

			// worker.postMessage(pixels);
			worker.postMessage({
				pixel: pixel,
				offset: 0,
				minRatio: 0,
				skip: 8
			});
		}
		image.src = 'images/test1.png';

		// ctx.beginPath();
		// ctx.fillStyle = 'rgba(100, 150, 200, 1.0)';
		// ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// ctx.fill();
		// ctx.closePath();

		
		// ctx.beginPath();
		// ctx.fillStyle = 'rgba(1, 2, 3, 1.0)';
		// var offset = 0;
		// var skip = 8;
		// for (var i = offset; i < ctx.canvas.width; i += skip) {
		// 	for (var j = offset; j < ctx.canvas.height; j += skip ) {
		// 		ctx.rect(i, j, 1, 1);
		// 		ctx.fill();
		// 	}
		// }
		// ctx.closePath();

		// var pixel = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

		// // WebWorker を生成
		// var worker = new Worker('js/worker.js');

		// worker.addEventListener('message', function(e) {
		//   console.log('Worker said: ', e);
		// }, false);

		// // worker.postMessage(pixels);
		// worker.postMessage({
		// 	pixel: pixel
		// });
	}, false);
})();