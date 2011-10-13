var terrible_rap_generator = (function() {
	var container;
	
	var canvas;
	var ctx;
	
	var w = 600;
	var h = 500;
	var side = 48;
	var border = 1;
	
	var offsetLeft;
	var offsetTop;
	
	var lastPX = null;
	var lastPY = null;
	
	var mouseDown = false;
	
	var init = function(el, options) {
		container = el;
		
		canvas = $("<canvas width='"+w+"' height='"+h+"'>");
		ctx = canvas[0].getContext('2d');
		
		for(var i=0; i < w; i += side+border*2) {
			for(var j=0; j < h; j += side+border*2) {
				ctx.fillRect(i+border, j+border, side, side);
			}
		}
		
		canvas.mousedown(onMouseDown);
		canvas.mouseup(onMouseUp);
		canvas.mousemove(onMouseMove);

		el.append(canvas);
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
	}
	
	var onMouseMove = function(e) {
		var pos = getCursorPosition(e);
		
		var x = Math.floor(pos.x / (side+border*2));
		var y = Math.floor(pos.y / (side+border*2));
		
		if(mouseDown && (x !== lastPX || y !== lastPY)) {
			setSquareColor(x, y);
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
		
		//ctx.fillRect(x+border, y+border, side, side);
		ctx.fillRect(x, y, side, side);
	}
	
	return {
		init: init
	}
})();