<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	//first query check if department name already used
	
	$query = $conn->prepare('SELECT * from location WHERE name = ?');

	$query->bind_param("s", $_REQUEST['name']);

	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$result = $query->get_result();

   	$exist = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($exist, $row);

	}

	if(!(empty($exist)) && $exist[0]['id'] != $_REQUEST['id']){

		$output['status']['code'] = "200";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "duplicate";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	
		mysqli_close($conn);

	
		echo json_encode($output); 

		exit;
	}
	
	$query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');

	$query->bind_param("si", $_REQUEST['name'], $_REQUEST['id']);

	$query->execute();

	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 
?>