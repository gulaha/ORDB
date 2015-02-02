<?php

    include "db.inc";

   /*
   * Collect all Details from Angular HTTP Request.
   */ 

    class Responce {
        public $success;
        public $error;
    }

    $responce = new Responce();

    $postdata = file_get_contents("php://input");
    $newroute = json_decode($postdata);

    $name = $newroute->name;
    $description = $newroute->description;
    $length = $newroute->length;
    $grade = $newroute->grade;

    $conn = getDbConn();
    if ($conn->connect_errno) {
        throw new Exception( "Failed to connect to MySQL: (" . $conn->connect_errno . ") " . $conn->connect_error );
    } else {

        $sql = "INSERT INTO `route`(`name`, `description`, `length`, `grade`) VALUES ( ?, ?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {

            /* bind parameters for markers */
            $stmt->bind_param("ssis", $name, $description, $length, $grade);

            /* execute query */
            $stmt->execute();

            /* close statement */
            $stmt->close();
        } else {
            throw new Exception( "mysqli->prepare( " . $sql . " ) failed" );
        }

        /* close connection */
        $conn->close();

    } 
    
    $responce->success = $newroute;
    echo json_encode( $responce );

?>