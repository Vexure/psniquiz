<?php
$datafile = "./data";

header("Content-Type: text/plain");

try {
    $data = file_get_contents("php://input");
    file_put_contents($datafile, $data);

    date_default_timezone_set("Europe/Moscow");
    echo date("H:i:s");
}    
catch(Throwable $ex) {
     echo "ЕГГОГ";
}

?>