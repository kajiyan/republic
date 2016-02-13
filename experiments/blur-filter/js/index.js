(function() {
	'use strict';

	// --------------------------------------------------
	var BlurCanvas = (function() {
		var mulTable = [1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
		var shgTable = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];

		// --------------------------------------------------
		/**
		 * BlurCanvas
		 */
		function BlurCanvas(options) {
			console.log('[BlurCanvas] constructor');
			if (typeof options === 'undefined' || options === null) options = {};

      var defaults = {
				topX: 0,
				topY: 0,
				width: 640,
				height: 480,
			};

			for (var key in defaults) {
				if (options[key] == null) options[key] = defaults[key];
			}

			this.options = options;

      var canvas = document.createElement('canvas');
			canvas.width = this.options.width;
			canvas.height = this.options.height;
			canvas.style.backgroundColor = '#cccccc';
			document.body.appendChild(canvas);

			this.context = canvas.getContext('2d');
			// this.context.clearRect(
			// 	this.options.topX, this.options.topY,
			// 	this.options.width, this.options.height
			// );
			// this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
			// this.context.fillRect(
			// 	10, 10,
			// 	this.options.width, this.options.height
			// );
		}

		// --------------------------------------------------
		/**
		 * BlurCanvas#setImage
		 * @param {<img>} img
		 * @return {Promise}
		 */
		BlurCanvas.prototype.setImage = function(img) {
			console.log('[BlurCanvas] -> setImage');
			
			return new Promise((function(_this) {
			  return (function(resolve, reject) {
			  	_this.context.drawImage(img,
						_this.options.topX, _this.options.topY,
						_this.options.width, _this.options.height
			  	);
			  });
			})(this));
		}

		// --------------------------------------------------
		/**
		 * BlurCanvas#filterRGB
		 */
		BlurCanvas.prototype.filterRGB = function(options) {
			console.log('[BlurCanvas] -> filterRGB');
			console.time('timer');
			if (typeof options === 'undefined' || options === null) options = {};

			var defaults = {
				iterations: 1,
				radius: 1
			};

			for (var key in defaults) {
				if (options[key] == null) options[key] = defaults[key];
			}

			if (isNaN(options.radius) || options.radius < 1) {
				throw new Error('[BlurCanvas] constructor | @param {number} options.radius - required and greater than 0');
			}

			if (isNaN(options.iterations)) options.iterations = 1;
			if (options.iterations > 3) options.iterations = 3;
			if (options.iterations < 1) options.iterations = 1;

			var imageData;

			try {
				try {
					imageData = this.context.getImageData(
						this.options.topX, this.options.topY,
						this.options.width, this.options.height
					);
				} catch (e) {
					console.log(e);
					try {
						netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
						imageData = this.context.getImageData(
							this.options.topX, this.options.topY,
							this.options.width, this.options.height
						);
					} catch (e) {
						throw new Error('unable to access local image data: ' + e);
						return;
					}
				}
			} catch (e) {
				throw new Error('unable to access image data: ' + e);
				return;
			}

			var pixels = imageData.data;

			var rsum, gsum, bsum, asum, x, y, i, p, p1, p2, yp, yi, yw, idx, pa;
			var wm = this.options.width - 1;
			var hm = this.options.height - 1;
			var wh = this.options.width * this.options.height;
			var rad1 = options.radius + 1;

			var mulSum = mulTable[options.radius];
			var shgSum = shgTable[options.radius];
			
			var r = [];
			var g = [];
			var b = [];

			var vmin = [];
			var vmax = [];

			while (options.iterations-- > 0 ) {
				yw = yi = 0;
				for (y = 0; y < this.options.height; y++ ){
					rsum = pixels[yw] * rad1;
					gsum = pixels[yw+1] * rad1;
					bsum = pixels[yw+2] * rad1;

					for (i = 1; i <= options.radius; i++) {
						p = yw + (((i > wm ? wm : i )) << 2);
						rsum += pixels[p++];
						gsum += pixels[p++];
						bsum += pixels[p++];
					}

					for (x = 0; x < this.options.width; x++) {
						r[yi] = rsum;
						g[yi] = gsum;
						b[yi] = bsum;

						if (y == 0) {
							vmin[x] = ((p = x + rad1) < wm ? p : wm) << 2;
							vmax[x] = ((p = x - options.radius) > 0 ? p << 2 : 0);
						} 

						p1 = yw + vmin[x];
						p2 = yw + vmax[x];
						  
						rsum += pixels[p1++] - pixels[p2++];
						gsum += pixels[p1++] - pixels[p2++];
						bsum += pixels[p1++] - pixels[p2++];

						yi++;
					}
					yw += ( this.options.width << 2 );
				}	
			}

			for (x = 0; x < this.options.width; x++) {
				yp = x;
				rsum = r[yp] * rad1;
				gsum = g[yp] * rad1;
				bsum = b[yp] * rad1;

				for( i = 1; i <= options.radius; i++ ) {
					yp += (i > hm ? 0 : this.options.width);
					rsum += r[yp];
					gsum += g[yp];
					bsum += b[yp];
				}

				yi = x << 2;
				for (y = 0; y < this.options.height; y++) {
					pixels[yi]     = (rsum * mulSum) >>> shgSum;
					pixels[yi + 1] = (gsum * mulSum) >>> shgSum;
					pixels[yi + 2] = (bsum * mulSum) >>> shgSum;

					if (x == 0) {
						vmin[y] = ((p = y + rad1) < hm ? p : hm ) * this.options.width;
						vmax[y] = ((p = y - options.radius) > 0 ? p * this.options.width : 0 );
					} 

					p1 = x + vmin[y];
					p2 = x + vmax[y];

					rsum += r[p1] - r[p2];
					gsum += g[p1] - g[p2];
					bsum += b[p1] - b[p2];

					yi += this.options.width << 2;
				}
			}

			this.context.putImageData(imageData, this.options.topX, this.options.topY);

			console.timeEnd('timer');
		}

		// --------------------------------------------------
		/**
		 * BlurCanvas#filterRGBA
		 */
		BlurCanvas.prototype.filterRGBA = function(options) {
			console.log('[BlurCanvas] -> filterRGBA');
			console.time('timer');
			if (typeof options === 'undefined' || options === null) options = {};

			var defaults = {
				iterations: 1,
				radius: 1
			};

			for (var key in defaults) {
				if (options[key] == null) options[key] = defaults[key];
			}

			if (isNaN(options.radius) || options.radius < 1) {
				throw new Error('[BlurCanvas] constructor | @param {number} options.radius - required and greater than 0');
			}

			if (isNaN(options.iterations)) options.iterations = 1;
			if (options.iterations > 3) options.iterations = 3;
			if (options.iterations < 1) options.iterations = 1;

			var imageData;

			try {
				try {
					imageData = this.context.getImageData(
						this.options.topX, this.options.topY,
						this.options.width, this.options.height
					);
				} catch (e) {
					console.log(e);
					try {
						netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
						imageData = this.context.getImageData(
							this.options.topX, this.options.topY,
							this.options.width, this.options.height
						);
					} catch (e) {
						throw new Error('unable to access local image data: ' + e);
						return;
					}
				}
			} catch (e) {
				throw new Error('unable to access image data: ' + e);
				return;
			}

			var pixels = imageData.data;

			var rsum, gsum, bsum, asum, x, y, i, p, p1, p2, yp, yi, yw, idx, pa;
			var wm = this.options.width - 1;
			var hm = this.options.height - 1;
			var wh = this.options.width * this.options.height;
			var rad1 = options.radius + 1;

			var mulSum = mulTable[options.radius];
			var shgSum = shgTable[options.radius];
			
			var r = [];
			var g = [];
			var b = [];
			var a = [];

			var vmin = [];
			var vmax = [];

			while (options.iterations-- > 0 ) {
				yw = yi = 0;
				for (y = 0; y < this.options.height; y++ ){
					rsum = pixels[yw] * rad1;
					gsum = pixels[yw+1] * rad1;
					bsum = pixels[yw+2] * rad1;
					asum = pixels[yw+3] * rad1;

					for (i = 1; i <= options.radius; i++) {
						p = yw + (((i > wm ? wm : i )) << 2);
						rsum += pixels[p++];
						gsum += pixels[p++];
						bsum += pixels[p++];
						asum += pixels[p]
					}

					for (x = 0; x < this.options.width; x++) {
						r[yi] = rsum;
						g[yi] = gsum;
						b[yi] = bsum;
						a[yi] = asum;

						if (y == 0) {
							vmin[x] = (( p = x + rad1) < wm ? p : wm) << 2;
							vmax[x] = (( p = x - options.radius) > 0 ? p << 2 : 0);
						} 

						p1 = yw + vmin[x];
						p2 = yw + vmax[x];
						  
						rsum += pixels[p1++] - pixels[p2++];
						gsum += pixels[p1++] - pixels[p2++];
						bsum += pixels[p1++] - pixels[p2++];
						asum += pixels[p1] - pixels[p2];

						yi++;
					}
					yw += ( this.options.width << 2 );
				}	
			}

			for (x = 0; x < this.options.width; x++) {
				yp = x;
				rsum = r[yp] * rad1;
				gsum = g[yp] * rad1;
				bsum = b[yp] * rad1;
				asum = a[yp] * rad1;

				for( i = 1; i <= options.radius; i++ ) {
					yp += (i > hm ? 0 : this.options.width);
					rsum += r[yp];
					gsum += g[yp];
					bsum += b[yp];
					asum += a[yp];
				}

				yi = x << 2;
				for (y = 0; y < this.options.height; y++) {
					pixels[yi + 3] = pa = (asum * mulSum) >>> shgSum;
					if (pa > 0) {
						pa = 255 / pa;
						pixels[yi]     = ((rsum * mulSum) >>> shgSum) * pa;
						pixels[yi + 1] = ((gsum * mulSum) >>> shgSum) * pa;
						pixels[yi + 2] = ((bsum * mulSum) >>> shgSum) * pa;
					} else {
						pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
					}
					if (x == 0) {
						vmin[y] = ((p = y + rad1) < hm ? p : hm ) * this.options.width;
						vmax[y] = ((p = y - options.radius) > 0 ? p * this.options.width : 0 );
					} 

					p1 = x + vmin[y];
					p2 = x + vmax[y];

					rsum += r[p1] - r[p2];
					gsum += g[p1] - g[p2];
					bsum += b[p1] - b[p2];
					asum += a[p1] - a[p2];

					yi += this.options.width << 2;
				}
			}

			this.context.putImageData(imageData, this.options.topX, this.options.topY);
			console.timeEnd('timer');
		}

		return BlurCanvas;
	})();



	document.addEventListener('DOMContentLoaded', function() {
		console.log('DOMContentLoded');

		var image = new Image();

		image.onload = function() {
			console.log('image onload');
			var blurCanvas = new BlurCanvas();
			blurCanvas.setImage(image);
			blurCanvas.filterRGB({
				iterations: 3,
				radius: 10
			});
		}
		image.src = 'images/test.jpg';

		
	}, false);
})();













































