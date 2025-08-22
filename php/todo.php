<?php
try {

    // 1 - insertion de la nouvelle tâche
$toDo = json_decode(file_get_contents('php://input'), true);
$toDoBody = $toDo['todo'];
$toDoTitleId = $toDo['titleId'];
$toDoDate = date('Y-m-d');
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('INSERT INTO `to_do`(`todo_body`, `done`, `liste_id`, `date_publication`, `deadline`,`user_id` ) VALUES (:todo_body, :done, :liste_id, :date_publication, :deadline, :user_id)');
$insertToDo = $sqlQuery->execute([
    'todo_body' => $toDoBody,
    'done' => 0,
    'liste_id' => $toDoTitleId,
    'date_publication' => $toDoDate,
    'deadline' => $toDo['deadline'],
    'user_id' => $toDo['user_id']
]);

// $lastId = $sql->lastInsertId();


// 2 - récupération de la liste updatée avec la nouvelle tâche, pr màj le localStorage
$sqlQuery2 = $sql->prepare('SELECT * from liste l LEFT JOIN to_do t ON l.liste_id = t.liste_id WHERE t.liste_id = :liste_id');
$sqlQuery2->execute(['liste_id' => $toDoTitleId]);
$updatedList = $sqlQuery2->fetchAll(PDO::FETCH_ASSOC);

//  3 - on renvoit la liste updatée + une confirmation ou non du succès de la démarche
header('content-type:application/json');
echo json_encode([$updatedList, $insertToDo]);

} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>