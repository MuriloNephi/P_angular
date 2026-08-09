<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'dwii_db';
$user = 'dwii_user';
$pass = 'dwii2026';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'erro' => 'Falha na conexao com o banco de dados',
        'detalhe' => $e->getMessage()
    ]);
    exit;
}
