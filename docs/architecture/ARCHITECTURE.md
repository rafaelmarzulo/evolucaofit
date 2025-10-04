# 🏗️ Arquitetura do FitnessTracker

## Visão Geral

O FitnessTracker é uma aplicação fullstack moderna construída com:
- **Backend**: FastAPI (Python) - API REST
- **Frontend**: Next.js 14 (TypeScript) - App Router
- **Banco de Dados**: PostgreSQL 15
- **Cache**: Redis
- **Storage**: MinIO (S3-compatible)
- **Proxy**: Nginx

## Diagrama de Arquitetura

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│    Nginx Reverse Proxy      │
│  - Rate Limiting            │
│  - Security Headers         │
└────────┬──────────┬─────────┘
         │          │
         ▼          ▼
┌────────────┐  ┌──────────────┐
│  Next.js   │  │   FastAPI    │
│  Frontend  │  │   Backend    │
│            │  │              │
│  - React   │  │  - REST API  │
│  - Zustand │  │  - JWT Auth  │
│  - TanStack│  │  - Pydantic  │
└────────────┘  └───┬──────┬───┘
                    │      │
         ┌──────────┘      └──────────┐
         ▼                             ▼
    ┌──────────┐                 ┌─────────┐
    │PostgreSQL│                 │  Redis  │
    │ Database │                 │  Cache  │
    └──────────┘                 └─────────┘
         ▲
         │
         ▼
    ┌──────────┐
    │  MinIO   │
    │  S3      │
    └──────────┘
```

## Backend - Clean Architecture

A estrutura do backend segue os princípios de Clean Architecture e SOLID:

```
apps/backend/
├── src/
│   ├── api/                    # Camada de Apresentação
│   │   ├── routes/            # Endpoints REST
│   │   │   ├── auth.py        # Autenticação
│   │   │   ├── users.py       # Usuários
│   │   │   └── body_measurements.py
│   │   ├── schemas/           # Validação Pydantic
│   │   │   ├── user.py
│   │   │   └── body_measurement.py
│   │   └── services/          # Business Logic
│   │       ├── auth_service.py
│   │       └── body_measurement_service.py
│   │
│   ├── core/                   # Núcleo da Aplicação
│   │   ├── config.py          # Configurações
│   │   ├── database.py        # Conexão DB
│   │   ├── security.py        # JWT, Hash
│   │   └── dependencies.py    # FastAPI Dependencies
│   │
│   ├── database/               # Camada de Dados
│   │   └── models/            # SQLAlchemy Models
│   │       ├── user.py
│   │       ├── body_measurement.py
│   │       ├── workout.py
│   │       └── meal.py
│   │
│   └── shared/                 # Utilitários
│       └── utils.py
│
├── alembic/                    # Migrations
├── tests/                      # Testes
└── requirements.txt
```

### Princípios Aplicados

#### 1. Separação de Responsabilidades

- **Routes**: Apenas recebem requisições e retornam respostas
- **Services**: Contêm toda a lógica de negócio
- **Models**: Representam entidades do domínio
- **Schemas**: Validação de entrada/saída

#### 2. Dependency Injection

```python
# FastAPI DI para database session
@router.get("/measurements")
async def get_measurements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return BodyMeasurementService.get_user_measurements(db, current_user.id)
```

#### 3. Service Layer Pattern

```python
class BodyMeasurementService:
    @staticmethod
    def create_measurement(db: Session, user: User, data: BodyMeasurementCreate):
        # Business logic aqui
        measurement = BodyMeasurement(**data.dict())
        db.add(measurement)
        db.commit()
        return measurement
```

## Frontend - Component Architecture

```
apps/frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── providers.tsx      # React Query provider
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       └── measurements/
│   │
│   ├── components/             # Componentes Reutilizáveis
│   │   ├── ui/                # Componentes base
│   │   ├── forms/             # Formulários
│   │   └── charts/            # Gráficos
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useMeasurements.ts
│   │
│   ├── store/                  # Zustand State
│   │   └── authStore.ts
│   │
│   ├── lib/                    # Utilidades
│   │   └── api.ts             # Axios client
│   │
│   └── types/                  # TypeScript types
│       └── index.ts
│
├── public/                     # Assets estáticos
└── package.json
```

### Padrões do Frontend

#### 1. Server Components (RSC)
```tsx
// app/dashboard/page.tsx - Server Component por padrão
export default async function Dashboard() {
  // Pode fazer fetch direto no servidor
  return <DashboardContent />
}
```

#### 2. Client Components
```tsx
'use client'
// Para interatividade
export function MeasurementForm() {
  const { register, handleSubmit } = useForm()
  // ...
}
```

#### 3. Data Fetching com React Query
```tsx
function useMeasurements() {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const { data } = await api.get('/measurements')
      return data
    }
  })
}
```

## Fluxo de Dados

### 1. Autenticação

```
Usuario → Login Form → POST /api/v1/auth/login
                            ↓
                    AuthService.authenticate_user()
                            ↓
                    Gera JWT access_token e refresh_token
                            ↓
                    Retorna tokens para frontend
                            ↓
                    Armazena em localStorage
                            ↓
                    Todas requests incluem: Authorization: Bearer <token>
```

### 2. Criação de Medida

```
Usuario → Formulário → Client Validation (Zod)
                            ↓
                POST /api/v1/measurements
                            ↓
                Pydantic Schema Validation
                            ↓
        BodyMeasurementService.create_measurement()
                            ↓
                Calcula BMI automaticamente
                            ↓
                Salva no PostgreSQL
                            ↓
                Retorna BodyMeasurementResponse
                            ↓
                React Query invalida cache
                            ↓
                UI atualiza automaticamente
```

## Segurança

### 1. Autenticação JWT
- Access token: 30 minutos
- Refresh token: 7 dias
- Refresh automático quando access token expira

### 2. Validação em Camadas
```
Request → Pydantic Schema → Service Layer → Database
          (tipo + formato)   (regras de negócio)  (constraints)
```

### 3. Rate Limiting
```nginx
# Nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
```

### 4. Headers de Segurança
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## Escalabilidade

### Horizontal Scaling
```yaml
# docker-compose.yml
backend:
  deploy:
    replicas: 3
```

### Caching Strategy
1. Redis para session/cache
2. React Query para client-side cache
3. HTTP caching headers

### Database Optimization
- Indexes em campos de busca frequente
- Connection pooling (SQLAlchemy)
- Query optimization

## Monitoramento

### Logs Estruturados
```python
import structlog
logger = structlog.get_logger()
logger.info("measurement_created", user_id=user.id, weight=measurement.weight_kg)
```

### Health Checks
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

## Performance

### Backend
- Async/await com FastAPI
- Connection pooling
- Lazy loading de relationships

### Frontend
- Code splitting automático (Next.js)
- Image optimization
- React Server Components
- React Query caching

## Testes

### Backend
```python
# pytest
def test_create_measurement(client, auth_headers):
    response = client.post(
        "/api/v1/measurements",
        json={"weight_kg": 75, "measurement_date": "2024-01-01"},
        headers=auth_headers
    )
    assert response.status_code == 201
```

### Frontend
```typescript
// Jest + React Testing Library
test('renders measurement form', () => {
  render(<MeasurementForm />)
  expect(screen.getByLabelText('Peso')).toBeInTheDocument()
})
```

## Deploy

### Docker Compose (Desenvolvimento)
```bash
make up
```

### Production (Kubernetes)
```bash
kubectl apply -f k8s/
```

### CI/CD (GitHub Actions)
```yaml
- Build → Test → Deploy
- Automated migrations
- Zero-downtime deployment
```
