<?php
try {
$deadlineData= json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('UPDATE to_do set deadline = :deadline WHERE todo_id = :todo_id');
$deadline = $sqlQuery->execute([
    'deadline' => $deadlineData['date'],
    'todo_id' => $deadlineData['id']
]);

$sqlQuery2 = $sql->prepare('SELECT * from liste l LEFT JOIN to_do t ON l.liste_id = t.liste_id WHERE l.user_id = t.user_id AND l.user_id = :user_id AND l.liste_id = :liste_id;');
$sqlQuery2->execute(
    [
        'liste_id' => $deadlineData['idList'],
        'user_id' => $deadlineData['userId']
        
    ]);
$updatedList = $sqlQuery2->fetchAll(PDO::FETCH_ASSOC);
header("content-type:application/json");
echo json_encode([
    'list' => $updatedList,
    'deadlineFormatted' => $deadlineData['date']
]);


} catch (Exception $e) {
echo json_encode(['error' =>$e->GetMessage()]);
}
?>