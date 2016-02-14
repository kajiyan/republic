(function() {
	var PixelWorker = (function() {
		var threshold;

		/**
		 * PixelWorker
		 */
		function PixelWorker(options) {
			console.log('[PixelWorker] constructor');

			if (typeof options === 'undefined' || options === null) options = {};

			var defaults = {
				threshold: 60
			};

			for (var key in defaults) {
	      if (options[key] == null) options[key] = defaults[key];
	    }

			threshold = options.threshold;
		}

		/**
		 * _colorCompare
		 * 引数に渡されたcolor0 とcolor1 を比較し、
		 * その差が閾値(threshold) 以内であればtrue そうでなければfalse を返す
		 *
		 * @param {Object} color0 - 比較するRGB
		 * @param {Object} color1 - 比較するRGB
		 * @return {bool} 
		 */
		var _colorCompare = function(color0, color1) {
			var rDiff = color0.r - color1.r,
					gDiff = color0.g - color1.g,
					bDiff = color0.b - color1.b,
					diff = Math.sqrt(Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2));

			if (diff < threshold) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * PixelWorker#search
		 * @return {Object} -
		 * 	index: { c255255255: 10, ... }
		 * 	composition: [['c255255255', [r: 255, g: 255, b: 255, percentage: 10]]...]
		 */
		PixelWorker.prototype.search = function(keyData) {
			console.log('[PixelWorker] search', keyData);

			var defaults = {
				limit: 10,
				offset: 0,
				minRatio: 0,
				skip: 1
			};

			for (var key in defaults) {
				if (keyData[key] == null) keyData[key] = defaults[key];
			}

			var options = keyData;

			// サンプリングする回数
			var sampleSize = (options.pixel.width / options.skip) * (options.pixel.height / options.skip);
			var pixelData = options.pixel.data;


			var colorData = {};
			colorData['c' + ((pixelData[0] * 1000000) + (pixelData[1] * 1000) + pixelData[2])] = {
				r: pixelData[0],
				g: pixelData[1],
				b: pixelData[2],
				percentage: 0
			};
			
			for (var x = options.offset, w = options.pixel.width; x < w; x += options.skip) {
				for (var y = options.offset, h = options.pixel.height; y < h; y += options.skip ) {
					var i = x * 4 * w + y * 4;

					var color = {
						r: pixelData[i],
						g: pixelData[i + 1],
						b: pixelData[i + 2]
					}

					for (var label in colorData) {
						if (_colorCompare(colorData[label], color)) {
							// 近似色である場合
							// カウンターに加算する
							colorData[label].percentage += 1; 
						} else {
							// 近似色でない場合
							// 新たにインデックスを追加する
							color.percentage = 0;
							colorData['c' + ((color.r * 1000000) + (color.g * 1000) + color.b)] = color;
						}
					}
				}
			}


			var composition = [];
			for (key in colorData) {
				var color = colorData[key];
				var percentage = Math.round(color.percentage / sampleSize * 100);
				// var percentage = Math.round(color.percentage / sampleSize * 100);
				// サンプリングしたピクセル数に対してminRatio 以下であれば結果に含めない
				if (percentage > options.minRatio) {
					color.percentage = percentage;
					composition.push([key, color]);
				} else {
					continue;
				}
			}

			composition.sort(function(color0, color1) {
				if (color0[1].percentage > color1[1].percentage) return -1;
				if (color0[1].percentage < color1[1].percentage) return 1;
				return 0;
			});

			var index = {};
			for (var i = 0, len = composition.length; i < len; i++ ) {
				index[composition[i][0]] = i;
			}

			return {
				index: index,
				composition: composition
			};
		}

		return PixelWorker;
	}())


	var pixelWorker = new PixelWorker();


	onmessage = function(event) {
		postMessage(pixelWorker.search(event.data));
	}
}());
