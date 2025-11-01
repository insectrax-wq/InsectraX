<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "team_insectrax";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $sql = "SELECT id, nombre_completo, email, password, institucion_educativa, carrera_especialidad FROM registros WHERE email = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Error en consulta']);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        
        if (password_verify($password, $usuario['password'])) {
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nombre'] = $usuario['nombre_completo'];
            $_SESSION['usuario_email'] = $usuario['email'];
            $_SESSION['usuario_institucion'] = $usuario['institucion_educativa'];
            $_SESSION['usuario_carrera'] = $usuario['carrera_especialidad'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Login exitoso',
                'user' => [
                    'id' => $usuario['id'],
                    'name' => $usuario['nombre_completo'],
                    'email' => $usuario['email'],
                    'institucion' => $usuario['institucion_educativa'],
                    'carrera' => $usuario['carrera_especialidad'],
                    'avatar' => '👤'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}

$conn->close();
?>