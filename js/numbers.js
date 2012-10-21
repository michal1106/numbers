var numberCanvas = new function() {
	var colorPurple = "#cb3594";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";

	var curColor = colorPurple;
	var curNumber = 0;
	var localeSuffix = '_iw.3ga';
	var fastDraw = true, lastDraw = null;
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var paint;
	var canvas, context, canvasMaxLength;

	this.init = function() {
		var canvasDiv = document.getElementById('canvasDiv');
		canvas = document.createElement('canvas');
		canvas.setAttribute('class', "border");
        canvas.setAttribute('width', window.innerWidth + "px");
        canvas.setAttribute('height', window.innerHeight + "px");
		canvas.setAttribute('id', 'canvas');
		canvasDiv.appendChild(canvas);
		canvasMaxLength = (canvas.offsetWidth>canvas.offsetHeight?canvas.offsetWidth:canvas.offsetHeight);
		if(typeof G_vmlCanvasManager != 'undefined') {
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		context = canvas.getContext("2d");
		var that = this;
		$('#canvas').mousedown(function(e){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
				
			paint = true;
			that.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		});
		$('#canvas').mousemove(function(e){
			if(paint){
			that.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			}
			e.preventDefault();
		});
		$('#canvas').mouseup(function(e){
		  paint = false;
		});
		$('#canvas').mouseleave(function(e){
		  paint = false;
		});
		$('#canvas').on("touchstart", function(e){
			var mouseX = (e.pageX?e.pageX:e.originalEvent.touches[0].pageX) - this.offsetLeft;
			var mouseY = (e.pageY?e.pageY:e.originalEvent.touches[0].pageY) - this.offsetTop;
			console.log("START mouseX ["+mouseX+"] mouseY ["+mouseY+"]"+paint);
			that.addClick(mouseX, mouseY);
			e.preventDefault();
		});
		$('#canvas').on("touchmove", function(e){
			var mouseX = (e.pageX?e.pageX:e.originalEvent.touches[0].pageX) - this.offsetLeft;
			var mouseY = (e.pageY?e.pageY:e.originalEvent.touches[0].pageY) - this.offsetTop;
			console.log("MOVE mouseX ["+mouseX+"] mouseY ["+mouseY+"]"+paint);
			that.addClick(mouseX, mouseY, true);
			e.preventDefault();
		});
		$("i.icon-forward").click(function(e) {
			if (curNumber < 9) {				
				curNumber++;
			    that.redraw(true);			
			}
		})
		$("i.icon-backward").click(function(e) {
			if (curNumber > 0) {				
				curNumber--; //Math.round(Math.random()*10);
			    that.redraw(true);			
			}
		})
		$("i.icon-random").click(function(e) {
			curNumber = Math.round(Math.random()*10);
			if (curNumber == 10) {
				curNumber = 9;
			}
		    that.redraw(true);			
		})
		$("i.icon-refresh").click(function(e) {
		    that.redraw(true);			
		})
		$("i.icon-volume-up").click(function(e) {
			// play sound
		    document.getElementById('play').src='sounds/'+curNumber+localeSuffix;
            document.getElementById('play').play();
		})
		var iconSize = 0.1*canvasMaxLength+"px";
		$('[class^="icon-"]').css({"font-size": iconSize, "width": iconSize, "height": iconSize, "line-height": iconSize});
//        $("span#width").text(canvas.getAttribute('width')+",").css({"font-size": iconSize});
//        $("span#height").text(canvas.getAttribute('height')).css({"font-size": iconSize});
	}
	this.addClick = function(x, y, dragging)
	{
		clickX.push(x);
		clickY.push(y);
		clickDrag.push(dragging);
		clickColor.push(curColor);
		if (!fastDraw) {
			this.redraw();
		} else {
			context.beginPath();
			if(dragging && lastDraw){
				context.moveTo(lastDraw.x, lastDraw.y);
			 }else{
			 	context.moveTo(x, y);
			 }
			lastDraw = {x:x, y:y};
			context.lineTo(x, y);
			context.closePath();
			context.strokeStyle = curColor;
			context.stroke();	  	
		}
	}
	this.redraw = function(resetDrawing){
		canvas.width = canvas.width; // Clears the canvas

		if (resetDrawing) {
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
			clickColor = new Array();			
			lastDraw = null;
		}
		// draw the number
		var font_size = canvasMaxLength / 2 + "px";
		context.font = font_size + " Arial";
		context.fillStyle="WhiteSmoke";
		context.textAlign = "center";
		context.textBaseline = "middle";			
		context.fillText(curNumber, canvas.offsetWidth / 2, canvas.offsetHeight / 2);
		context.lineJoin = "round";
		context.lineWidth = 40; // small -2, normal -5, large-10, huge-20
		
		// handle right/left arrow
		if (curNumber == 9) {				
			$("i.icon-forward").css("color", "Gainsboro");
			$("i.icon-backward").css("color", "grey");
		} else if (curNumber == 0) {
			$("i.icon-forward").css("color", "grey");
			$("i.icon-backward").css("color", "Gainsboro");			
		} else {
			$("i.icon-forward").css("color", "grey");
			$("i.icon-backward").css("color", "grey");			
		}

		if (fastDraw) {
			return;
		}
		for(var i=0; i < clickX.length; i++)
		{		
		context.beginPath();
		if(clickDrag[i] && i){
		  context.moveTo(clickX[i-1], clickY[i-1]);
		 }else{
		   context.moveTo(clickX[i]-1, clickY[i]);
		 }
		 context.lineTo(clickX[i], clickY[i]);
		 context.closePath();
		 context.strokeStyle = clickColor[i];
		 context.stroke();
		}
	}
}