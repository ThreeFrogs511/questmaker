<?php
try {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');

    $sqlQuery = $sql->prepare('DELETE FROM to_do WHERE liste_id = :liste_id;');
    $sqlQuery->execute(['liste_id'=> $data['liste_id']]);

    $sqlQuery2 = $sql->prepare('DELETE FROM liste WHERE liste_id = :liste_id;');
    $sqlQuery2->execute(['liste_id'=> $data['liste_id']]);

    header('content-type:application/json');
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>