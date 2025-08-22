<?php 
try {
$data = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$sqlQuery = $sql->prepare('INSERT into user (`email`, `nom`, `prenom`, `password`) VALUES (:email, :nom, :prenom, :password)');
$sqlQuery->execute([
    'email' => htmlspecialchars($data['email']),
    'nom' => htmlspecialchars($data['nom']),
    'prenom' => htmlspecialchars($data['prenom']),
    'password' => $data['password']
]);
header('content-type:application/json');
echo json_encode([
    'email' => htmlspecialchars($data['email']),
    'nom' => htmlspecialchars($data['nom']),
    'prenom' => htmlspecialchars($data['prenom']),
    'password' => $data['password']
]);

} catch (Exception $e) {
 echo json_encode(['error'=>$e->getMessage()]);
}


?>