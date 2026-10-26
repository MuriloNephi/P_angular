#!/bin/bash
# testar-tranca.sh - roda os testes da tranca e guarda as respostas em respostas-curl.txt
URL=http://localhost:3000
EMAIL='murilonefidefaria@gmail.com'
SAIDA=respostas-curl.txt

if [ -z "$SENHA" ]; then
  echo "Rode assim: SENHA='sua senha' bash testar-tranca.sh"
  exit 1
fi

: > "$SAIDA"

rodar() {
  titulo="$1"; exibido="$2"; shift 2
  curl -i -s "$@" | tr -d '\r' > /tmp/ultima.txt
  { echo; echo "### $titulo"; echo "\$ $exibido"; cat /tmp/ultima.txt; echo; } | tee -a "$SAIDA"
}

json() { node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).$1"; }

JSON="Content-Type: application/json"

rodar "1. Login sem email e senha (400)" \
  "curl -i -X POST $URL/api/login -H \"$JSON\" -d '{}'" \
  -X POST $URL/api/login -H "$JSON" -d '{}'

rodar "2. Login com senha errada (401)" \
  "curl -i -X POST $URL/api/login -H \"$JSON\" -d '{\"email\":\"$EMAIL\",\"senha\":\"errada\"}'" \
  -X POST $URL/api/login -H "$JSON" -d "{\"email\":\"$EMAIL\",\"senha\":\"errada\"}"

rodar "3. Login certo (200 e token)" \
  "curl -i -X POST $URL/api/login -H \"$JSON\" -d '{\"email\":\"$EMAIL\",\"senha\":\"<senha>\"}'" \
  -X POST $URL/api/login -H "$JSON" -d "{\"email\":\"$EMAIL\",\"senha\":\"$SENHA\"}"

TOKEN=$(tail -n1 /tmp/ultima.txt | json token)
if [ -z "$TOKEN" ] || [ "$TOKEN" = "undefined" ]; then
  echo; echo "ERRO: o login nao devolveu token. Veja a resposta do teste 3 acima."; exit 1
fi

rodar "4. POST de projeto SEM token (401)" \
  "curl -i -X POST $URL/api/projetos -H \"$JSON\" -d '{\"nome\":\"Teste da tranca\"}'" \
  -X POST $URL/api/projetos -H "$JSON" -d '{"nome":"Teste da tranca"}'

rodar "5. POST de projeto COM token (201)" \
  "curl -i -X POST $URL/api/projetos -H \"Authorization: Bearer <token>\" -H \"$JSON\" -d '{\"nome\":\"Teste da tranca\"}'" \
  -X POST $URL/api/projetos -H "Authorization: Bearer $TOKEN" -H "$JSON" -d '{"nome":"Teste da tranca"}'

ID=$(tail -n1 /tmp/ultima.txt | json id)

rodar "6. DELETE de projeto SEM token (401)" \
  "curl -i -X DELETE $URL/api/projetos/$ID" \
  -X DELETE $URL/api/projetos/$ID

rodar "7. DELETE de projeto COM token (204)" \
  "curl -i -X DELETE $URL/api/projetos/$ID -H \"Authorization: Bearer <token>\"" \
  -X DELETE $URL/api/projetos/$ID -H "Authorization: Bearer $TOKEN"

rodar "8. GET de projetos continua publico (200)" \
  "curl -i $URL/api/projetos" \
  $URL/api/projetos

rodar "9. PUT de projeto SEM token (401)" \
  "curl -i -X PUT $URL/api/projetos/1 -H \"$JSON\" -d '{\"nome\":\"X\"}'" \
  -X PUT $URL/api/projetos/1 -H "$JSON" -d '{"nome":"X"}'

rodar "10. POST de tecnologia SEM token (401)" \
  "curl -i -X POST $URL/api/tecnologias -H \"$JSON\" -d '{\"nome\":\"Node\",\"categoria\":\"Backend\"}'" \
  -X POST $URL/api/tecnologias -H "$JSON" -d '{"nome":"Node","categoria":"Backend"}'

rodar "11. POST de tecnologia COM token (201)" \
  "curl -i -X POST $URL/api/tecnologias -H \"Authorization: Bearer <token>\" -H \"$JSON\" -d '{\"nome\":\"Node\",\"categoria\":\"Backend\",\"ano_criacao\":2009}'" \
  -X POST $URL/api/tecnologias -H "Authorization: Bearer $TOKEN" -H "$JSON" -d '{"nome":"Node","categoria":"Backend","ano_criacao":2009}'

TID=$(tail -n1 /tmp/ultima.txt | json id)

rodar "12. DELETE de tecnologia COM token (204)" \
  "curl -i -X DELETE $URL/api/tecnologias/$TID -H \"Authorization: Bearer <token>\"" \
  -X DELETE $URL/api/tecnologias/$TID -H "Authorization: Bearer $TOKEN"

echo; echo "PRONTO. As respostas tambem ficaram salvas em api-node/$SAIDA"