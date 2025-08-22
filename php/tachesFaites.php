<?php
try {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
    $sqlQuery = $sql->prepare('SELECT l.liste_titre AS "liste", (SELECT count(done) from to_do where done = 1 and user_id = :user_id and liste_id = t.liste_id) AS "done", COUNT(t.todo_body) AS "total" FROM liste l INNER JOIN to_do t ON t.liste_id = l.liste_id WHERE l.user_id = :user_id GROUP BY l.liste_titre');
    $sqlQuery->execute(['user_id' => $data['user_id']]);
    $tachesFaitesStmts = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);

    header("content-type:application/json");
    echo json_encode($tachesFaitesStmts);

} catch (Exception $e) {
     echo json_encode(['error'=>$e->getMessage()]);
}


?>

