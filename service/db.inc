<?php
    function getDbConn() {
        $conn = new mysqli("localhost:3306", "root", "", "ordb");
        return $conn;
    }
?>