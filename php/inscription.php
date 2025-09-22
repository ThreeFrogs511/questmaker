<?php 
try {
$data = json_decode(file_get_contents('php://input'), true);
$sql = new PDO('mysql:host=localhost; dbname=qm; charset=utf8', 'root', '');
$mailDuplicateFilter = $sql->prepare('SELECT email from user WHERE email = :email');
$mailDuplicateFilter->execute(['email'=> htmlspecialchars($data['email'])]);
$duplicateEmail = $mailDuplicateFilter->fetch(PDO::FETCH_ASSOC);

if ($duplicateEmail) {
    header('content-type:application/json');
    echo json_encode(['wrongEmail' => 'this mail already exists']);
} else {
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $sqlQuery = $sql->prepare(
    'INSERT into user (`email`, `nom`, `prenom`, `password`) 
    VALUES (:email, :nom, :prenom, :password)');
    $sqlQuery->execute([
        'email' => htmlspecialchars($data['email']),
        'nom' => htmlspecialchars($data['nom']),
        'prenom' => htmlspecialchars($data['prenom']),
        'password' => $hash
    ]);
    header('content-type:application/json');
    echo json_encode(['prenom' => htmlspecialchars($data['prenom'])]);
}
} catch (Exception $e) {
 echo json_encode(['error'=>$e->getMessage()]);
}


?>