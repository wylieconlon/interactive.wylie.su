var terrible_rap_generator = (function() {
	var container;
	
	var canvas;
	var ctx;
	
	var lyrics;
	
	var w = 600;
	var h = 400;
	var side = 48;
	var border = 1;
	
	var offsetLeft;
	var offsetTop;
	
	var lastPX = null;
	var lastPY = null;
	
	var mouseDown = false;
	
	var timer = null;
	
	var patternQueue = [];
	var flips = 0;
	var lines = 0;
	
	var init = function(el, options) {
		container = el;
		
		w = options.w || w;
		h = options.h || h;
		side = options.side || side;
		border = options.border || border;
		
		canvas = $("<canvas width='"+w+"' height='"+h+"'>");
		ctx = canvas[0].getContext('2d');
		
		for(var i=0; i < w; i += side+border*2) {
			for(var j=0; j < h; j += side+border*2) {
				ctx.fillRect(i+border, j+border, side, side);
			}
		}
		
		$('body').mousedown(onMouseDown);
		$('body').mouseup(onMouseUp);
		canvas.mousemove(onMouseMove);

		lyrics = $("<div>", { 'id': 'rap_lyrics' });
		
		el.append(canvas);
		el.append(lyrics);
	}
	
	var getCursorPosition = function(e) {
		/* Cache computation of element's position in document */
		if(!offsetLeft) {
			offsetLeft = 0;
			for(var node=container[0]; node; node = node.offsetParent) {
				offsetLeft += node.offsetLeft;
			}
		}
		if(!offsetTop) {
			offsetTop = 0;
			for(var node=container[0]; node; node = node.offsetParent) {
				offsetTop += node.offsetTop;
			}
		}
		
		var x = e.pageX - offsetLeft;
		var y = e.pageY - offsetTop;
	
		return { x: x, y: y };
	}
	
	var onMouseDown = function(e) {
		mouseDown = true;
		
		onMouseMove(e);
	}
	
	var onMouseUp = function(e) {
		mouseDown = false;
		
		lastPX = null;
		lastPY = null;
		
		speed = 0;
		
		patternQueue.push('');
	}
	
	var onMouseMove = function(e) {
		var pos = getCursorPosition(e);
		
		var x = Math.floor(pos.x / (side+border*2));
		var y = Math.floor(pos.y / (side+border*2));

		if(mouseDown && (x !== lastPX || y !== lastPY)) {
			setSquareColor(x, y);
			rateLimit();
		}
		if(mouseDown) {
			lastPX = x;
			lastPY = y;
		}
	}
	
	var setSquareColor = function(x, y) {
		x *= side + border*2;
		y *= side + border*2;
		
		x += border;
		y += border;
		
		var color = ctx.getImageData(x, y, 1, 1).data[0] ? '#000' : '#fff';
		
		ctx.fillStyle = color;
		
		ctx.fillRect(x, y, side, side);

		flips++;
	}

/*	
	var getSquareValues = function() {
		var rows = w / (side+border*2);
		var cols = h / (side+border*2);
		
		var colors = new Array(rows * cols);
		
		for(var i=0; i < rows; i++) {
			for(var j=0; j < cols; j++) {
				var x = j*(side + border*2);
				var y = i*(side + border*2);
				
				x += border;
				y += border;
				
				var data = ctx.getImageData(x, y, 1, 1).data[0];
				colors[i*cols + j] = data ? 1 : 0;
			}
		}
		
		return colors;
	}
*/
	
	var choose = function(type) {
		return type[Math.floor(Math.random() * type.length)];
	}
	
	var parsePattern = function(pattern) {
		var str = pattern.replace(/{([A-Za-z]*)}/g, function(str, p1, offset, s) {		
			switch(p1) {
				case "noun":
					return choose(rap_nouns);
					break;
				case "brand":
					return choose(rap_brands);
					break;
				case "verb":
					return choose(rap_verbs);
					break;
				case "adj":
					return choose(rap_adjectives);
					break;
				case "int":
					return choose(rap_interjections);
					break;
				case "body":
					return choose(rap_bodyparts);
					break;
			}
		});
		
		if(pattern != '' && Math.random() < .2) {
			str += ", " + choose(rap_interjections);
		}
		
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	var makeLyrics = function(text) {
		//var colors = getSquareValues();
		
		if(text != null) {
			var lyric = text;
		} else if(patternQueue.length > 0 && lines>0) {
			var lyric = patternQueue.pop();
			lines = 0;
		} else {
			if(lines >= Math.random() * 4 + 4) {
			//if(lines == 4) {
				var lyric = '';
				lines = 0;
			} else {
				var lyric = choose(rap_patterns);
				lines++;
			}
		}
		
		lyrics.append(parsePattern(lyric) + "<br />");
		
		lyrics.scrollTop(lyrics.prop("scrollHeight"));
		
		timer = null;
	}
	
	var rateLimit = function(text) {
		if(timer == null) {
			timer = window.setTimeout(makeLyrics, 400);
		}
	}
	
	return {
		init: init
	}
})();