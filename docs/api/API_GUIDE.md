# 📡 Guia da API - FitnessTracker

## Base URL

```
http://localhost:8000/api/v1
```

## Documentação Interativa

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Autenticação

Todas as rotas protegidas requerem um JWT Bearer token no header:

```http
Authorization: Bearer <access_token>
```

### Fluxo de Autenticação

1. **Registro**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "full_name": "João Silva",
  "password": "senhaSegura123",
  "height_cm": 175,
  "gender": "male",
  "date_of_birth": "1990-01-15"
}
```

Resposta (201):
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "full_name": "João Silva",
  "height_cm": 175,
  "gender": "male",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-20T10:00:00Z"
}
```

2. **Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senhaSegura123"
}
```

Resposta (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Endpoints

### Usuários

#### Obter Perfil
```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

#### Atualizar Perfil
```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "João Pedro Silva",
  "target_weight_kg": 80
}
```

### Medidas Corporais

#### Criar Medida
```http
POST /api/v1/measurements
Authorization: Bearer <token>
Content-Type: application/json

{
  "measurement_date": "2024-01-20",
  "weight_kg": 85.5,
  "body_fat_percentage": 18.5,
  "chest_cm": 100,
  "waist_cm": 85,
  "hips_cm": 98,
  "right_bicep_cm": 38,
  "left_bicep_cm": 37.5,
  "notes": "Medida após treino matinal"
}
```

Resposta (201):
```json
{
  "id": 1,
  "user_id": 1,
  "measurement_date": "2024-01-20",
  "weight_kg": 85.5,
  "body_fat_percentage": 18.5,
  "bmi": 27.96,
  "chest_cm": 100,
  "waist_cm": 85,
  "hips_cm": 98,
  "right_bicep_cm": 38,
  "left_bicep_cm": 37.5,
  "notes": "Medida após treino matinal",
  "created_at": "2024-01-20T10:00:00Z",
  "updated_at": "2024-01-20T10:00:00Z"
}
```

#### Listar Medidas
```http
GET /api/v1/measurements?start_date=2024-01-01&end_date=2024-01-31&limit=50
Authorization: Bearer <token>
```

Resposta (200):
```json
[
  {
    "id": 1,
    "measurement_date": "2024-01-20",
    "weight_kg": 85.5,
    "bmi": 27.96,
    ...
  }
]
```

#### Obter Última Medida
```http
GET /api/v1/measurements/latest
Authorization: Bearer <token>
```

#### Obter Medida Específica
```http
GET /api/v1/measurements/1
Authorization: Bearer <token>
```

#### Atualizar Medida
```http
PUT /api/v1/measurements/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight_kg": 85.0,
  "notes": "Peso corrigido"
}
```

#### Deletar Medida
```http
DELETE /api/v1/measurements/1
Authorization: Bearer <token>
```

### Treinos (Futuro)

```http
POST /api/v1/workouts
GET /api/v1/workouts
GET /api/v1/workouts/{id}
PUT /api/v1/workouts/{id}
DELETE /api/v1/workouts/{id}
```

### Refeições (Futuro)

```http
POST /api/v1/meals
GET /api/v1/meals
GET /api/v1/meals/{id}
PUT /api/v1/meals/{id}
DELETE /api/v1/meals/{id}
```

### Metas (Futuro)

```http
POST /api/v1/goals
GET /api/v1/goals
GET /api/v1/goals/{id}
PUT /api/v1/goals/{id}
DELETE /api/v1/goals/{id}
```

## Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Sucesso sem conteúdo (DELETE) |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |

## Validações

### Peso
- Mínimo: 20 kg
- Máximo: 500 kg

### Altura
- Mínimo: 50 cm
- Máximo: 300 cm

### Percentual de Gordura
- Mínimo: 0%
- Máximo: 100%

### Circunferências
- Mínimo: 0 cm
- Máximo: 200 cm (dependendo da medida)

## Rate Limiting

- **API Geral**: 60 requisições/minuto
- **Login**: 5 tentativas/hora
- **Registro**: 3 tentativas/hora

## Erros

Formato padrão de erro:

```json
{
  "detail": "Mensagem de erro descritiva"
}
```

Validação de campos:

```json
{
  "detail": [
    {
      "loc": ["body", "weight_kg"],
      "msg": "ensure this value is greater than 20",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

## Exemplos com cURL

### Registro
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "full_name": "João Silva",
    "password": "senha123",
    "height_cm": 175
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'
```

### Criar Medida
```bash
TOKEN="seu-access-token-aqui"

curl -X POST http://localhost:8000/api/v1/measurements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "measurement_date": "2024-01-20",
    "weight_kg": 85.5,
    "body_fat_percentage": 18.5
  }'
```

### Listar Medidas
```bash
curl -X GET "http://localhost:8000/api/v1/measurements?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Webhooks (Futuro)

Notificações de eventos para integrações externas.

## Versionamento

A API usa versionamento no path:
- v1: `/api/v1/...`
- v2 (futuro): `/api/v2/...`

Mudanças breaking sempre criam nova versão.
