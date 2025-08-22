<?php
try {
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT * from liste l LEFT JOIN to_do t ON l.liste_id = t.liste_id ');
$sqlQuery->execute();
$liste = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);


header('content-type:application/json');
echo json_encode($liste);

} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>