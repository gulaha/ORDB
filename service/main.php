<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8"); 

include "db.inc";

$conn = getDbConn();
if ($conn->connect_errno) {
    echo "Failed to connect to MySQL: (" . $conn->connect_errno . ") " . $conn->connect_error;
} else {

    $result = $conn->query("SELECT name, description, length, grade from route");

    //echo($result::$num_rows);
    
    $outp = "[";
    while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
        if ($outp != "[") {$outp .= ",";}
        $outp .= '{"name":"'  . $rs["name"] . '",';
        $outp .= '"description":"'   . $rs["description"]        . '",';
        $outp .= '"length":"'   . $rs["length"]        . '",';
        $outp .= '"grade":"'. $rs["grade"]     . '"}'; 
    }
    $outp .="]";

    $conn->close();

    echo($outp);
}
?>
