<?php
try {
$user = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT * FROM user WHERE user_id = :user_id');
$sqlQuery->execute([
    'user_id' => $user
]);
$profileInfo = $sqlQuery->fetch(PDO::FETCH_ASSOC);

header('content-type:application/json');
echo json_encode($profileInfo);

} catch (Exception $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}

?>