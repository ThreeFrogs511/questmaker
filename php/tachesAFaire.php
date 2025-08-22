<?php
try {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
    $sqlQuery = $sql->prepare('SELECT * FROM to_do t INNER JOIN liste l on t.liste_id = l.liste_id WHERE t.done = 0 AND t.user_id = :user_id');
    $sqlQuery->execute(['user_id' => $data['user_id']]);
    $tachesFaitesStmts = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);

    header("content-type:application/json");
    echo json_encode($tachesFaitesStmts);

} catch (Exception $e) {
     echo json_encode(['error'=>$e->getMessage()]);
}


?>