<?php
try {
$id= json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('DELETE from `to_do` WHERE todo_id = :todo_id');
$sqlQuery->execute([
    'todo_id' => $id['idTask']
]);


$sqlQuery2 = $sql->prepare('SELECT * from liste l LEFT JOIN to_do t ON l.liste_id = t.liste_id WHERE l.user_id = :user_id AND t.user_id = :user_id AND l.liste_id = :liste_id ;');
$sqlQuery2->execute(
    [
        'liste_id' => $id['idList'],
        'user_id' => $id['userId']
        
    ]);
$updatedList = $sqlQuery2->fetchAll(PDO::FETCH_ASSOC);

if ($updatedList) {
header("content-type:application/json");
echo json_encode($updatedList);
} else {
    $emptyList = array( 
        'liste_titre' => $id['title'],
        'liste_id' => $id['idList'],
        'user_id' => $id['idList'],
        'todo_body' => null,
        'deadline' => null
    );
    header("content-type:application/json");
    echo json_encode($emptyList);
}

} catch (Exception $e) {
 echo json_encode(['error'=>$e->getMessage()]);
}