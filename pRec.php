<?php
header("Content-Type: text/plain");

try {
	date_default_timezone_set("Europe/Moscow");

    $data = json_decode(file_get_contents("php://input"));
	if (json_last_error() != JSON_ERROR_NONE) $data = file_get_contents("php://input");
	
	
	if (isset($data->type)) {	
		$filePath = "./games/" . $data->gameUUID . "/players/";	

		if ($data->type == "psync") { 			
			if (!is_dir($filePath)) { mkdir($filePath, 0777, true); }
			file_put_contents($filePath . $data->player->UUID, json_encode($data->player));

			echo "SC";
		}
		
		if ($data->type == "hsync") { 
			$filePath = "./games/" . $data->gameUUID . "/players/";

			$playersArray = [];

			foreach(array_filter(glob($filePath.'*'), 'is_file') as $pFile)  {
    			array_push($playersArray, file_get_contents($pFile));
			}

			$result = json_encode($playersArray);

			echo $result;
		}
		

	} else { echo "no type defined"; }
} catch(Throwable $ex) {
	echo "ЕГГОГ";
}

?>