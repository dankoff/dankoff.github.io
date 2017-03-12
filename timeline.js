var c;
var canvas;
var img;
var cs;

var bounds = {};
bounds.x = 50;
bounds.y = 0;
bounds.w = 700;
bounds.h = 500;

var mx = -1;
var my = -1;
var dx = 0;
var dy = 0;
var maxmag = 1;
var drag = false;
var max = 80;

var start = 0;
var width = 200;
var s = generateSeries(1000);

function generateSeries(length = 1000) {
	var s = {};
	var pt = 0;
	var pd = 0;
	var st = [];
	var sd = [];
	for (var i = 0; i < length; i++){
		var t = pt + 5*(Math.random() + Math.random());
		var d = pd
		if (d < max) d += parseInt(10*(Math.random() - Math.random()));
		else d += parseInt(10*(Math.random() - 2 * Math.random()));
		d=d<0?0:d;
		st[i] = t;
		sd[i] = d;
		pt = t;
		pd = d;
	}
	
	s.length = length;
	s.time = st
	s.data = sd;
	return s;
}

function getP(i){
	var p = {};
	p.x = s.data[i]/max*0.8*bounds.w;
	p.y = parseInt((s.time[i]-start)*bounds.h/(width - 1));
	return p;
}

function mmove(e){
	mx = e.x - canvas.getBoundingClientRect().left;
	my = e.y - canvas.getBoundingClientRect().top;
	if (e.buttons == 0) {
	}
	if (drag) {		
		var x = e.x - canvas.getBoundingClientRect().left - dx;
		var y = e.y - canvas.getBoundingClientRect().top - dy;
		dx = e.x - canvas.getBoundingClientRect().left;
		dy = e.y - canvas.getBoundingClientRect().top;
		start = start - y*(width - 1)/canvas.height;
	}
	draw();
}

function mdown(e){
	drag = true;
    
	dx = e.x - canvas.getBoundingClientRect().left;
	dy = e.y - canvas.getBoundingClientRect().top;
	
	draw();
}

function mup(e){
	drag = false;
}

function mout(e){
	mx = -1;
	my = -1;
	drag = false;
}

function mwheel(e){
	var delta = parseInt(width * (e.wheelDelta * (-0.0002)));
	start = start - delta;
	width = width + 2 * delta;
	draw();
}

window.onresize = function(e){
};

function draw(){
	bounds.y = 0;
	bounds.h = canvas.height;
	bounds.w = canvas.width - bounds.x;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#fff";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	c.lineWidth = 3;
	c.strokeStyle = "#000";
	c.beginPath();
	var i = 0;
	while (i+1 < s.length && s.time[i+1] < start) i++;
	while (i < s.length && s.time[i] < start + width){
		var p1 = getP(i);
		var p2 = getP(i+1);
		c.moveTo(p1.x,p1.y);
		c.lineTo(p2.x,p2.y);
		
		i++;
	}
	c.stroke();
}

function clock(){
	draw();
}

function begin(){
	canvas = document.getElementById("timeline");
	c = canvas.getContext("2d");
	c.lineWidth = 1.5;
	
	canvas.addEventListener('mousewheel',function(event){
		mwheel(event);
		event.returnValue = false;
		return false; 
	}, false);
	
	canvas.addEventListener('mousemove',function(event){
		mmove(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mouseup',function(event){
		mup(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mousedown',function(event){
		mdown(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mouseout',function(event){
		mout(event);
		return false; 
	}, false);
	
	
	
	draw();
	//setInterval(clock, 18);
}

setTimeout(begin, 100);