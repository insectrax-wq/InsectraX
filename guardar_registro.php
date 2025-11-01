<?php
// Mostrar todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔍 DEPURACIÓN - guardar_registro.php</h2>";

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "team_insectrax";

echo "<p>📊 Conectando a la base de datos...</p>";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("<p style='color: red;'>❌ Error de conexión: " . $conn->connect_error . "</p>");
}

echo "<p style='color: green;'>✅ Conexión a BD exitosa</p>";

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<p>📨 Se recibió método POST</p>";
    
    // Mostrar todos los datos recibidos
    echo "<h3>Datos recibidos:</h3>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    
    // Obtener datos del POST
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
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
    
    // Procesar intereses (checkboxes)
    $intereses = isset($_POST['intereses']) ? $_POST['intereses'] : [];
    $intereses_json = json_encode($intereses);
    
    // Procesar newsletter (checkbox)
    $newsletter = isset($_POST['newsletter']) ? 1 : 0;
    
    // Información del usuario
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    echo "<p>📝 Preparando consulta SQL...</p>";

    // Preparar y ejecutar la consulta SQL
    $sql = "INSERT INTO registros (
        nombre_completo, email, telefono, edad, genero,
        institucion_educativa, carrera_especialidad, semestre_anio,
        intereses, habilidades_tecnicas, experiencia_previa,
        motivacion, disponibilidad_semanal, recibir_newsletter,
        ip_address, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    echo "<p>SQL: " . $sql . "</p>";

    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        die("<p style='color: red;'>❌ Error preparando consulta: " . $conn->error . "</p>");
    }

    $stmt->bind_param(
        "sssisssssssssiss",
        $nombre, $email, $telefono, $edad, $genero,
        $institucion, $carrera, $semestre,
        $intereses_json, $habilidades, $experiencia,
        $motivacion, $disponibilidad, $newsletter,
        $ip_address, $user_agent
    );

    echo "<p>🚀 Ejecutando consulta...</p>";

    if ($stmt->execute()) {
        echo "<p style='color: green; font-size: 20px;'>✅ ¡REGISTRO EXITOSO! ID: " . $stmt->insert_id . "</p>";
        
        // Mostrar enlace para ver en phpMyAdmin
        echo "<p><a href='http://localhost/phpmyadmin' target='_blank'>🔍 Ver en phpMyAdmin</a></p>";
        
        // Redirigir después de 5 segundos
        echo "<script>
            setTimeout(function() {
                window.location.href = 'formulario.html';
            }, 5000);
        </script>";
    } else {
        echo "<p style='color: red;'>❌ Error al guardar: " . $stmt->error . "</p>";
    }

    $stmt->close();
} else {
    echo "<p style='color: orange;'>⚠️ No se recibió método POST</p>";
    echo "<p>Método usado: " . $_SERVER['REQUEST_METHOD'] . "</p>";
}

$conn->close();

echo "<hr>";
echo "<p><a href='formulario.html'>← Volver al formulario</a></p>";
?>