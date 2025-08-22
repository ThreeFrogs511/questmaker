<?php 
try {
$data = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('SELECT * FROM user WHERE email = :email AND password = :password');
$sqlQuery->execute([
    'email' => htmlspecialchars($data['email']),
    'password' => htmlspecialchars($data['password'])
]);
$userData = $sqlQuery->fetch(PDO::FETCH_ASSOC);
if ($userData) {
header('content-type:application/json');
echo json_encode($userData);
} else {
    header('content-type:application/json');
    echo json_encode(['error' => 'utilisateur non trouvé']);
}

} catch (Exception $e) {
 echo json_encode(['error'=>$e->getMessage()]);
}


?>