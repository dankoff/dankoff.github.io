$.ajax("https://docs.google.com/spreadsheets/d/1l-Xu3gIB79VKZ2VUSxT817G0zBltpkpOvuNcwsyW-1A/pub?gid=0&range=a2&output=csv").done(function (result) {
	$('#numPeople').val(result);
	var txtBusyness;
	if (result > 70) {
		document.getElementById("busyness").src = "Images/ExtremelyBusy.png";
		txtBusyness = "Extremely Busy";
	}
	else if (result > 50) {
		document.getElementById("busyness").src = "Images/RelativelyBusy.png";
		txtBusyness = "Relatively Busy";
	}
	else if (result > 40) {
		document.getElementById("busyness").src = "Images/Busy.png";
		txtBusyness = "Busy";
	}
	else if (result > 30) {
		document.getElementById("busyness").src = "Images/NotSoBusy.png";
		txtBusyness = "Not so busy";
	}
	else {
		document.getElementById("busyness").src = "Images/Free.png";
		txtBusyness = "Free";
	}
	document.getElementById("txtBusyness").innerHTML = txtBusyness;
});