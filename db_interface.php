<?php
	$input = json_decode(file_get_contents("php://input"));
	$request = $input->value;
	$output = fopen('php://output', 'w');
	if ($request == "sethistory"){
		$time = $input->time;
		$people = $input->people;
		$link = connect();
		$result = mysqli_query($link, "DELETE FROM `History`");
		$query = "";
		$r = true;
		for ($i = 0; $i < sizeof($time); $i++){
			$query = "INSERT INTO `History` (`Time`, `People`)
			VALUES (".'"'.$time[$i].'"'.", ".$people[$i].");";
			$result = mysqli_query($link, $query);
			$r = $r && $result;
		}
		if ($r){
			fwrite($output, "Success
			");
		}else {
			fwrite($output, "Failure
			");
		}
	} else if ($request == "addhistory"){
		$time = $input->time;
		$people = $input->people;
		$link = connect();
		$query = "";
		$r = true;
		for ($i = 0; $i < sizeof($time); $i++){
			$query = "INSERT INTO `History` (`Time`, `People`)
			VALUES (".'"'.$time[$i].'"'.", ".$people[$i].");";
			$result = mysqli_query($link, $query);
			$r = $r && $result;
		}
		if ($r){
			fwrite($output, "Success
			");
		}else {
			fwrite($output, "Failure
			");
		}
	} else if ($request == "gethistory"){
		$link = connect();
		$query = "SELECT * FROM `History` ORDER BY `Time`";
		$result = mysqli_query($link, $query);
		$array = array();
		$i = 0;
		while ($row = $result->fetch_row()){
			$array[$i] = $row;
			$i++;
		}
		fwrite($output, json_encode($array));
	}
    mysqli_close($link);
	fclose($output);
	
	function connect(){
		$url = "93.188.160.86";
		$username = "u771566540_ammin";
		$password = "fitinbathunigym1234";
		$db = "u771566540_fitin";
		$connect = new mysqli($url, $username, $password, $db)or die("cannot connect"); 
        if ($connect->connect_error) {
            die("Connection failed: " . $connect->connect_error);
        }
		return  $connect;
	}
?>