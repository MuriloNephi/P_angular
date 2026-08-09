<?php
require 'db.php';

try {
    $stmt = $pdo->prepare(
        'SELECT id, nome, descricao, tecnologias, link_github, ano, status
         FROM projetos
         WHERE status = :status
         ORDER BY ano DESC, id DESC'
    );
    $stmt->execute(['status' => 'publicado']);
    $projetos = $stmt->fetchAll();

    echo json_encode([
        'total' => count($projetos),
        'projetos' => $projetos
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao consultar projetos', 'detalhe' => $e->getMessage()]);
}
