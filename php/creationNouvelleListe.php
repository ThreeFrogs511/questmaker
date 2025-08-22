<?php
try {
    $newTitle= json_decode(file_get_contents('php://input'), true);
    $sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
    $sqlQuery = $sql->prepare('INSERT into liste (liste_titre, user_id) VALUES (:liste_titre, :user_id)');
    $titre = $sqlQuery->execute([
        'liste_titre' => $newTitle['title'],
        'user_id' => $newTitle['userId']
    ]);
    $lastId = $sql->lastInsertId();

    $sqlQuery2 = $sql->prepare('SELECT * from liste l WHERE l.user_id = :user_id AND l.liste_id = :liste_id');
    $sqlQuery2->execute(
        [   'liste_id' => $lastId,
            'user_id' => $newTitle['userId']
        ]);
    $updatedList = $sqlQuery2->fetchAll(PDO::FETCH_ASSOC);


    header("content-type:application/json");
    echo json_encode($updatedList);


} catch (Exception $e) {
    echo json_encode(['error' =>$e->GetMessage()]);
}
?>