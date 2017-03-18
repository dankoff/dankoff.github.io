var c;
var canvas;
var img;
var cs;

var left = new Image();
var zout = new Image();
var adv = new Image();
var zin = new Image();
var right = new Image();
left.src = "Images/left.png";
zout.src = "Images/out.png";
adv.src = "Images/advice.png";
zin.src = "Images/in.png";
right.src = "Images/right.png";

var bounds = {};
bounds.x = 50;
bounds.y = 0;
bounds.w = 700;
bounds.h = 500;
var buttonWidth = 50;

var mx = -1;
var my = -1;
var dx = 0;
var dy = 0;
var maxmag = 1;
var drag = false;
var max = 80;

var start = 0;
var width = 200;
var s = generateSeries(20);
var but = -1;
var advice = false;


function getHistory(){
	//DO POST
	var data = JSON.stringify({ value: "gethistory" });
	var request = new XMLHttpRequest();
	request.open('POST', 'db_interface.php');
	//request.responseType = "json";
	request.setRequestHeader('Content-Type', 'application/json');
	request.onreadystatechange = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			if (request.readyState == 4) {
				var resp = JSON.parse(request.response);
				st = [];
				sd = [];
				for (var i = 0; i < resp.length; i++){
					st[i] = (new Date(resp[i][0]))/60000;
					sd[i] = parseInt(resp[i][1]);
				}
				s.time = st;
				s.data = sd;
				s.length = resp.length;
				s.width = 200;
				start = s.time[s.length - 1] - 110;
				draw();
			}
		} else {
			// We reached our target server, but it returned an error
			s = generateSeries(1000);
		}
	};
	request.send(data);
	//NO JQUERY
}
function setHistory(s){
	//DO POST
	var t = [];
	var p = [];
	for (var i = 0; i < s.length && i < 100; i++){
		var d = new Date(1488153600000+(parseInt(s.time[i]*60000)));
		var mo = d.getMonth() + 1;
		mo=mo>9?mo:"0"+mo;
		var da = d.getDate();
		da=da>9?da:"0"+da;
		var ho = d.getHours();
		ho=ho>9?ho:"0"+ho;
		var mi = d.getMinutes();
		mi=mi>9?mi:"0"+mi;
		var se = d.getSeconds();
		se=se>9?se:"0"+se;
		
		t[i] = d.getFullYear()+"-"+mo+"-"+da+" "+ho+":"+mi+":"+se;
		p[i] = s.data[i];
	}
	var data = JSON.stringify({ value: "sethistory", time: t, people: p });
	var request = new XMLHttpRequest();
	request.open('POST', 'db_interface.php');
	//request.responseType = "json";
	request.setRequestHeader('Content-Type', 'application/json');
	request.onreadystatechange = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			if (request.readyState == 4) {
				var resp = request.response;
				console.log(resp);
				if (resp.substr(0, 7) == "Success" && s.length >= 100){
					addHistory(s, 100);
				}
			}
		} else {
			// We reached our target server, but it returned an error
			console.log("FUCK");
		}
	};
	request.send(data);
	//NO JQUERY
}

function addHistory(s, n){
	//DO POST
	var t = [];
	var p = [];
	var j = 0;
	for (var i = n; i < s.length && i < n + 100; i++){
		var d = new Date(1488153600000+(parseInt(s.time[i]*60000)));
		var mo = d.getMonth() + 1;
		mo=mo>9?mo:"0"+mo;
		var da = d.getDate();
		da=da>9?da:"0"+da;
		var ho = d.getHours();
		ho=ho>9?ho:"0"+ho;
		var mi = d.getMinutes();
		mi=mi>9?mi:"0"+mi;
		var se = d.getSeconds();
		se=se>9?se:"0"+se;
		
		t[j] = d.getFullYear()+"-"+mo+"-"+da+" "+ho+":"+mi+":"+se;
		p[j] = s.data[i];
		j++;
	}
	var data = JSON.stringify({ value: "addhistory", time: t, people: p });
	var request = new XMLHttpRequest();
	request.open('POST', 'db_interface.php');
	//request.responseType = "json";
	request.setRequestHeader('Content-Type', 'application/json');
	request.onreadystatechange = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			if (request.readyState == 4) {
				var resp = request.response;
				console.log(resp);
				if (resp.substr(0, 7) == "Success" && s.length >= n + 100){
					addHistory(s, n + 100);
				}
			}
		} else {
			// We reached our target server, but it returned an error
			console.log("FUCK");
		}
	};
	request.send(data);
	//NO JQUERY
}





function generateSeries(length = 1000) {
	var s = {};
	var pt = 0;
	var pd = 0;
	var st = [];
	var sd = [];
	for (var i = 0; i < length; i++){
		var t = pt + 5*(Math.random() + Math.random());
		var d = pd
		var a = 0;
		if (t % 1440 < 7*60) a = 0;
		else if (t % 1440 < 9*60) a = 20;
		else if (t % 1440 < 12*60) a = 30;
		else if (t % 1440 < 14.5*60) a = 100;
		else if (t % 1440 < 19*60) a = 60;
		else if (t % 1440 < 21*60) a = 30;
		else if (t % 1440 < 22*60) a = 1;
		else a = 0;
		if ((t % (1440 * 7)) / 1440 > 5) a /= 3;
		if (d > a) d += parseInt(10*(Math.random() - Math.random() - Math.random()));
		else d += parseInt(10*(Math.random() + Math.random() - Math.random()));
		d=d<0?0:d;
		d=a==0?0:d;
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

function getX(x){
	return bounds.x + x/max*0.8*(bounds.w);
	//p.y = parseInt((s.time[i]-start)*bounds.h/(width - 1));
}

function mmove(e){
	mx = e.x - canvas.getBoundingClientRect().left;
	my = e.y - canvas.getBoundingClientRect().top;
	if (e.buttons == 0) {
	}
	if (drag) {
		if (but == -1) {
			var x = e.x - canvas.getBoundingClientRect().left - dx;
			var y = e.y - canvas.getBoundingClientRect().top - dy;
			dx = e.x - canvas.getBoundingClientRect().left;
			dy = e.y - canvas.getBoundingClientRect().top;
			start = start - y*(width - 1)/canvas.height;
		} else {
			var newbut;
			if (mx > bounds.x + bounds.w){
				newbut = parseInt(5 * my / canvas.height);
			} else {
				newbut = -1;
			}
			if (newbut != but){
				but = -1;
				drag = false
			}
		}
	}
	draw();
}

function mdown(e){
	drag = true;
    
	dx = e.x - canvas.getBoundingClientRect().left;
	dy = e.y - canvas.getBoundingClientRect().top;
	
	if (dx > bounds.x + bounds.w){
		but = parseInt(5 * dy / canvas.height);
		if (but == 2) advice = !advice;
	} else {
		but = -1;
	}
	
	draw();
}

function mup(e){
	drag = false;
	but = -1;
}

function mout(e){
	mx = -1;
	my = -1;
	drag = false;
	but = -1;
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
	bounds.w = canvas.width - bounds.x - buttonWidth;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#fff";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	c.lineWidth = 3;
	c.strokeStyle = "#000";
	c.beginPath();
	/*var i = 0;
	var lastX = 0;
	while (i+1 < s.length && s.time[i+1] < start) i++;
	while (i < s.length && s.time[i] < start + width){
		var dist = 0;
		var j = i;
		var count = 0;
		var acc = 0;
		while (dist < width / 20 && i + 1 < s.length){
			dist += s.time[i + 1] - s.time[i];
			count++;
			acc += s.data[i + 1];
			i++;
		}
		acc /= count;
		var p1 = getP(j);
		var p2 = getP(i);
		c.moveTo(bounds.x + lastX,p1.y);
		c.lineTo(bounds.x + acc,p2.y);
		lastX = acc;
	}*/
	var res = 100;
	var j = 0;
	var lastX = -1;
	while (j+1 < s.length && s.time[j+1] < start) j++;
	for (var i = 0; i <= res; i++) {
		var x = 0;
		var count = 0;
		while (j+1 < s.length && s.time[j] < start + (width * i) / res){
			x += s.data[j];
			count++;
			j++;
		}
		if (j + 1 < s.length){
			if ( count == 0){
				if (lastX >= 0){
					c.moveTo(lastX, (i - 1) * canvas.height / res);
					c.lineTo(lastX, i * canvas.height / res);
				}
			} else {
				x = getX(x / count);
				if (lastX >= 0){
					c.moveTo(lastX, (i - 1) * canvas.height / res);
					c.lineTo(x, i * canvas.height / res);
				}
				lastX = x;
			}
		}
	}
	
	c.stroke();
	
	c.drawImage(left, bounds.x + bounds.w, 0, buttonWidth, canvas.height / 5);
	c.drawImage(zout, bounds.x + bounds.w, canvas.height / 5, buttonWidth, canvas.height / 5);
	c.drawImage(adv, bounds.x + bounds.w, 2 * canvas.height / 5, buttonWidth, canvas.height / 5);
	c.drawImage(zin, bounds.x + bounds.w, 3 * canvas.height / 5, buttonWidth, canvas.height / 5);
	c.drawImage(right, bounds.x + bounds.w, 4 * canvas.height / 5, buttonWidth, canvas.height / 5);
	
	
	c.beginPath();
	c.moveTo(bounds.x + bounds.w, 0);
	c.lineTo(bounds.x + bounds.w, canvas.height);
	for (var i = 1; i < 5; i++){
		c.moveTo(bounds.x + bounds.w, i * canvas.height / 5);
		c.lineTo(canvas.width, i * canvas.height / 5);
	}
	c.stroke();
	
	c.beginPath();
	
	c.moveTo(bounds.x, 0);
	c.lineTo(bounds.x, canvas.height);
	
	c.stroke();
	
	c.fillStyle = "#000";
	c.font = "14px Tahoma";
	var date = (new Date((start)*60000)).toDateString().substr(4, 100);
	var time = (new Date((start)*60000)).toTimeString().substr(0, 5);
	c.save();
	c.translate(bounds.x - 16, 0);
	c.rotate(Math.PI / 2);
	c.fillText(date, 0, 0);
	c.fillText(time, (c.measureText(date).width - c.measureText(time).width)/2, 16);
	c.restore();
	date = (new Date((start+width)*60000)).toDateString().substr(4, 100);
	time = (new Date((start+width)*60000)).toTimeString().substr(0, 5);
	c.save();
	c.translate(bounds.x - 16, canvas.height - c.measureText(date).width);
	c.rotate(Math.PI / 2);
	c.fillText(date, 0, 0);
	c.fillText(time, (c.measureText(date).width - c.measureText(time).width)/2, 16);
	c.restore();
}

function clock(){
	var delta = width * 0.01;
	if (but != -1){
		if (but == 0){
			start -= width * 0.01;
		} else if (but == 1){
			start = start - delta;
			width = width + 2 * delta;
		} else if (but == 2){
			
		} else if (but == 3){
			start = start + delta;
			width = width - 2 * delta;
		} else {
			start += width * 0.01;
		}
		draw();
	}
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
	setInterval(clock, 18);
}

getHistory();
setTimeout(begin, 100);