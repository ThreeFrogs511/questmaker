<?php
try {
$data= json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare( 'SELECT
     l.liste_id       AS liste_id,  
     l.liste_titre    AS liste_titre,
     l.user_id        AS user_id,
     t.todo_id         AS todo_id,
     t.todo_body      AS todo_body,
     t.deadline       AS todo_deadline,
     t.done           AS todo_done
   FROM liste l
   LEFT JOIN to_do t ON l.liste_id = t.liste_id
   WHERE l.user_id = :user_id
     AND l.liste_id = (
       SELECT liste_id FROM liste
       WHERE user_id = :user_id2
       ORDER BY liste_id DESC
       LIMIT 1
     )');

$sqlQuery->execute(
  ['user_id' => $data['user_id'],
    'user_id2' => $data['user_id']
  ]);
$listeRecente = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);


header('content-type:application/json');
echo json_encode($listeRecente);


} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>