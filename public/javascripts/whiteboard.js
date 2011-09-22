
var newWhiteBoard = function() {
	var theWhiteboard = {};
	var canvas = document.getElementById("can");
	var context = canvas.getContext('2d');
	var isDrawing = false;
	context.strokeStyle = 'red';
	context.lineWidth = 5;
	context.lineCap = "round";
	var socketToServer = io.connect();

	theWhiteboard.drawAt = function(x, y) {
		if(isDrawing){
			colorCoordinate(x,y);
			socketToServer.emit('user drawing', x, y, context.strokeStyle);
		}
	};
	
	function colorCoordinate(x, y) {
		if(!isDrawing){
			context.beginPath();
		    context.moveTo(x,y-5);
	    }  
		context.lineTo(x+2,y-5+2);
		context.stroke();
	}
	
	function withColor(color, funcToCall){
	  	var origColor = context.strokeStyle;
		context.strokeStyle = color;
		funcToCall();
		context.strokeStyle = origColor	
	}
	theWhiteboard.startDrawingAt = function(x, y){
		isDrawing = true;
		context.beginPath();
		colorCoordinate(x,y);
	}
	theWhiteboard.stopDrawing = function(){
		isDrawing = false;
		context.stroke();
	}
	theWhiteboard.setPenColor = function(color){
		context.strokeStyle = color
	};
	theWhiteboard.clear = function() {
		context.fillStyle = "#fff";
		context.fillRect(0, 0, canvas.width, canvas.height);
	};
	
	socketToServer.on('user drawing', function(xCoord, yCoord, color){
		withColor(color, function(){
			colorCoordinate(xCoord, yCoord);
		})
	});
	
	return theWhiteboard;
}

$(document).ready(function() {
	var whiteboard = newWhiteBoard();

	$("#can").mousedown(function(e){
		whiteboard.startDrawingAt(e.layerX, e.layerY);
		whiteboard.drawAt(e.layerX, e.layerY);
	});
	$("#can").mouseup(function(){
		whiteboard.stopDrawing();
	});

	$("#can").mousemove(function(e) {
		whiteboard.drawAt(e.layerX, e.layerY);	
	});

	$("#clr > div").click(function(){
		whiteboard.setPenColor($(this).css("background-color"));
	});
 
	$("#clear").click(function(){
		whiteboard.clear();
	});
});