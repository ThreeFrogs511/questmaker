<?php
try {
$data = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT l.liste_id AS liste_id, l.liste_titre, t.todo_id, t.todo_body, t.deadline, t.date_publication, t.done from liste l LEFT JOIN `to_do` t ON l.liste_id = t.liste_id WHERE l.user_id = :user_id');
$sqlQuery->execute(["user_id" => $data['user_id']]);
$listeSearch = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);

header('content-type:application/json');
echo json_encode($listeSearch);

} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>