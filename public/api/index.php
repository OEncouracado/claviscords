<?php

$host = 'localhost';
$dbname = 'hospi226_claviscord';
$username = 'hospi226_claviscordadm';
$password = 'E6Z1T!HLXTmq';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}

function encryptData($data, $key) {
    $cipher = "aes-256-cbc";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext_raw = openssl_encrypt($data, $cipher, $key, OPENSSL_RAW_DATA, $iv);
    $hmac = hash_hmac('sha256', $ciphertext_raw, $key, true);
    return base64_encode($iv . $hmac . $ciphertext_raw);
}

function decryptData($data, $key) {
    $c = base64_decode($data);
    $cipher = "aes-256-cbc";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = substr($c, 0, $ivlen);
    $hmac = substr($c, $ivlen, $sha2len = 32);
    $ciphertext_raw = substr($c, $ivlen + $sha2len);
    $original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, OPENSSL_RAW_DATA, $iv);
    $calcmac = hash_hmac('sha256', $ciphertext_raw, $key, true);
    if (hash_equals($hmac, $calcmac)) {
        return $original_plaintext;
    }
    return false;
}

$method = $_SERVER['REQUEST_METHOD'];
$table = isset($_GET['table']) ? $_GET['table'] : '';

switch ($method) {
    case 'GET':
        // ... Restante do código GET ...
        break;

    case 'POST':
        // ... Restante do código POST ...
        break;

    case 'PUT':
        // ... Restante do código PUT ...
        break;

    case 'OPTIONS':
        // Retorna um cabeçalho de resposta com status 200 OK
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        header('HTTP/1.1 200 OK');
        break;

    default:
        // Responda com uma mensagem de erro para outros tipos de solicitação
        $response = ['message' => 'Método não suportado'];
        http_response_code(405);

        // Retorne a resposta como JSON
        header('Content-Type: application/json');
        echo encryptData(json_encode($response), 'sua_chave_de_criptografia');
        break;
}
// Chave Criptografica: 8Zf&1s#p2^J@7qXt9U$0Yk*l4G3H

?>
