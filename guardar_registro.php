<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "team_insectrax";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $telefono = $_POST['telefono'] ?? '';
    $edad = $_POST['edad'] ?? 0;
    $genero = $_POST['genero'] ?? '';
    $institucion = $_POST['institucion'] ?? '';
    $carrera = $_POST['carrera'] ?? '';
    $semestre = $_POST['semestre'] ?? '';
    $habilidades = $_POST['habilidades'] ?? '';
    $experiencia = $_POST['experiencia'] ?? '';
    $motivacion = $_POST['motivacion'] ?? '';
    $disponibilidad = $_POST['disponibilidad'] ?? '';
    
    $intereses = isset($_POST['intereses']) ? $_POST['intereses'] : [];
    if (is_array($intereses)) {
        $intereses_json = json_encode($intereses);
    } else {
        $intereses_json = json_encode([]);
    }
    
    $newsletter = isset($_POST['newsletter']) ? 1 : 0;
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    $sql = "INSERT INTO registros (nombre_completo, email, password, telefono, edad, genero, institucion_educativa, carrera_especialidad, semestre_anio, intereses, habilidades_tecnicas, experiencia_previa, motivacion, disponibilidad_semanal, recibir_newsletter, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Error preparando consulta: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("ssssisssssssssiss", $nombre, $email, $password_hash, $telefono, $edad, $genero, $institucion, $carrera, $semestre, $intereses_json, $habilidades, $experiencia, $motivacion, $disponibilidad, $newsletter, $ip_address, $user_agent);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}

$conn->close();
?>