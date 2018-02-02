<?php
	header("content-type:text/json");
	$method=$_SERVER['REQUEST_METHOD'];
	$json='{"name":"mark","age":38}';
	switch ($method) {
		case 'POST':
		echo "string";
			break;
		case 'GET':
			echo $json;
			break;		
		default:
			echo $json;
			break;
	}
?>