<?php
try {
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT 
    e.liste_titre,
    e.liste_id,
    COUNT(*) AS total_taches,
    COUNT(CASE WHEN t.done = 1 THEN 1 END) AS taches_faites
FROM 
    to_do t
INNER JOIN 
    liste e ON t.liste_id = e.liste_id
GROUP BY 
    e.liste_titre;
');
$sqlQuery->execute();
$countTask = $sqlQuery->fetchAll(PDO::FETCH_ASSOC);
header("content-type:application/json");
echo json_encode($countTask);


} catch (Exception $e) {
echo json_encode(['error' =>$e->GetMessage()]);
}
?>