<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "team_insectrax";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];
$sql = "SELECT nombre_completo, email, institucion_educativa, carrera_especialidad FROM registros WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'user' => [
            'name' => $usuario['nombre_completo'],
            'email' => $usuario['email'],
            'institucion' => $usuario['institucion_educativa'],
            'carrera' => $usuario['carrera_especialidad']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
?>