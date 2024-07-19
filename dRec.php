<?php
header("Content-Type: text/plain");

try {
	date_default_timezone_set("Europe/Moscow");
    echo date("d.m.Y H:i:s");
	
    $data = json_decode(file_get_contents("php://input"));
	if (json_last_error() != JSON_ERROR_NONE) $data = file_get_contents("php://input");
	 	
	if (isset($data->saveMark)) {
		if ($data->type == "videos") { $savePath = "./vlist"; }
		if ($data->type == "games") { $savePath = "./glist"; }
		if ($data->type == "curgame") { $savePath = "./curgame"; }
		
		if ($savePath != "") {
			file_put_contents($savePath, $data->data);
			file_put_contents($savePath . "-sm", json_encode($data->saveMark));	
		}
	} else {
		if ((strlen($data) > 10) && (strlen($data) < 500000)) file_put_contents("./data", $data);
	}
}    
catch(Throwable $ex) {
     echo "ЕГГОГ";
}

?>