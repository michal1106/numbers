var numberCanvas = new function() {
	var colorPurple = "#cb3594";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";

	var curColor = colorPurple;
	var curNumber = 0;
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var paint;
	var canvas, context;

	this.init = function() {
		var canvasDiv = document.getElementById('canvasDiv');
		canvas = document.createElement('canvas');
		canvas.setAttribute('class', "border");
		canvas.setAttribute('width', window.screenX + "px");
		canvas.setAttribute('height', canvasDiv.parentNode.offsetHeight + "px");
		canvas.setAttribute('id', 'canvas');
		canvasDiv.appendChild(canvas);
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
		  that.redraw();
		});
		$('#canvas').mousemove(function(e){
		  if(paint){
		    that.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		    that.redraw();
		  }
		});
		$('#canvas').mouseup(function(e){
		  paint = false;
		});
		$('#canvas').mouseleave(function(e){
		  paint = false;
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
		var iconSize = 0.05*canvas.offsetWidth+"px";
		$('[class^="icon-"]').css({"font-size": iconSize, "width": iconSize, "height": iconSize, "line-height": iconSize});
	}
	this.addClick = function(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	  clickColor.push(curColor);
	}
	this.redraw = function(resetDrawing){
		canvas.width = canvas.width; // Clears the canvas

		if (resetDrawing) {
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
			clickColor = new Array();			
		}
		// draw the number
		var font_size = canvas.offsetWidth / 2 + "px";
		context.font = font_size + " Arial";
		context.fillStyle="WhiteSmoke";
		context.textAlign = "center";
		context.textBaseline = "middle";			
		context.fillText(curNumber, canvas.offsetWidth / 2, canvas.offsetHeight / 2);
		context.lineJoin = "round";
		context.lineWidth = 5;
				
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