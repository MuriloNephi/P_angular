<?php
// api/projetos.php - projetos PUBLICADOS do Portfolio em JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

try {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare(
            'SELECT id, nome, descricao, tecnologias, link_github, ano, status
             FROM projetos
             WHERE id = :id AND status = "publicado"'
        );
        $stmt->execute(['id' => $_GET['id']]);
        $projeto = $stmt->fetch();

        if (!$projeto) {
            http_response_code(404);
            echo json_encode(['erro' => 'Projeto nao encontrado']);
            exit;
        }

        echo json_encode($projeto, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $stmt = $pdo->query(
        'SELECT id, nome, descricao, tecnologias, link_github, ano, status
         FROM projetos
         WHERE status = "publicado"
         ORDER BY ano DESC, id DESC'
    );
    $projetos = $stmt->fetchAll();

    echo json_encode([
        'total' => count($projetos),
        'projetos' => $projetos
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao consultar projetos', 'detalhe' => $e->getMessage()]);
}
