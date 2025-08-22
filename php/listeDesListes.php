<?php
try {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
    $sqlQuery = $sql->prepare('SELECT * FROM liste WHERE user_id = :user_id ');
    $sqlQuery->execute(['user_id' => $data['user_id']]);
    $listesStmts = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);

    header("content-type:application/json");
    echo json_encode($listesStmts);

} catch (Exception $e) {
     echo json_encode(['error'=>$e->getMessage()]);
}


?>