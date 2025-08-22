<?php

try {
$data = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT * FROM liste l LEFT JOIN to_do t on l.liste_id = t.liste_id WHERE l.liste_id = :liste_id');
$sqlQuery->execute([
    "liste_id" => $data["liste_id"]
]);
$listeChercheeParUser = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);
header('content-type:application/json');
echo json_encode($listeChercheeParUser);
} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>