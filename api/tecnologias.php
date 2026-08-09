<?php
// api/tecnologias.php - catalogo de tecnologias ATIVAS em JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

try {
    $stmt = $pdo->query(
        'SELECT id, nome, categoria, descricao, ano_criacao, status
         FROM tecnologias
         WHERE status = "ativo"
         ORDER BY categoria, nome'
    );
    $tecnologias = $stmt->fetchAll();

    echo json_encode([
        'total' => count($tecnologias),
        'tecnologias' => $tecnologias
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao consultar tecnologias', 'detalhe' => $e->getMessage()]);
}
