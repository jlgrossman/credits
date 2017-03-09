<?
$connection = new mysqli('host', 'username', 'pw', 'db');

if($connection->connect_error){
        die("{\"success\":false,\"msg\":\"$conn->connect_error\"}");
}
?>
