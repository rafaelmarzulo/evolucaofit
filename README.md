# 🏋️ EvolucaoFit - Sistema de Acompanhamento de Evolução Física

Sistema fullstack moderno para acompanhamento pessoal de evolução física com métricas, fotos, treinos e nutrição.

## ✨ Funcionalidades

### Para o Usuário
- **Dashboard de Progresso**: Visão geral da evolução com gráficos interativos
- **Registro de Medidas**: Peso, medidas corporais, % de gordura, IMC
- **Fotos de Progresso**: Upload e comparação visual entre períodos
- **Diário de Treinos**: Registro de exercícios, séries, repetições e carga
- **Controle Nutricional**: Registro de refeições, água, macros
- **Comparação Temporal**: Compare sua evolução entre datas específicas
- **Metas e Objetivos**: Defina e acompanhe suas metas
- **Relatórios**: Gere relatórios detalhados de progresso

### Recursos Técnicos
- Autenticação JWT com refresh tokens
- Upload seguro de imagens
- Gráficos interativos de evolução
- Sistema de notificações
- Export de dados (PDF, CSV)
- PWA - Funciona offline
- Responsive design

## 🚀 Stack Tecnológica

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Validação**: Pydantic V2
- **Auth**: JWT (python-jose)
- **Storage**: S3-compatible (MinIO/AWS S3)
- **Cache**: Redis
- **Testing**: pytest

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **State**: Zustand
- **Styling**: TailwindCSS + shadcn/ui
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library + Playwright

### DevOps
- **Containers**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Loki + Promtail

## 📦 Estrutura do Projeto

```
evolucaofit/
├── apps/
│   ├── backend/              # API FastAPI
│   │   ├── src/
│   │   │   ├── api/         # Endpoints REST
│   │   │   ├── core/        # Config, security, dependencies
│   │   │   ├── database/    # Models, migrations
│   │   │   └── shared/      # Utils, constants
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── frontend/            # Next.js App
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom hooks
│       │   ├── store/       # Zustand stores
│       │   └── lib/         # Utils, API client
│       ├── public/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   ├── shared/              # Código compartilhado
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilidades comuns
│   │   └── validation/     # Schemas de validação
│   └── ui-components/       # Componentes reutilizáveis
├── infrastructure/
│   ├── docker/             # Docker configs
│   └── monitoring/         # Prometheus, Grafana
├── docs/                   # Documentação
├── scripts/                # Scripts de automação
└── docker-compose.yml
```

## 🚀 Como Executar

### Pré-requisitos
- Docker 24+
- Docker Compose 2+
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd evolucaofit
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Execute com Docker Compose

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Grafana**: http://localhost:3001
- **MinIO Console**: http://localhost:9001

## 🛠️ Desenvolvimento

### Backend (FastAPI)

```bash
cd apps/backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependências
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Rodar migrations
alembic upgrade head

# Executar em modo dev
uvicorn src.main:app --reload --port 8000

# Rodar testes
pytest
pytest --cov=src tests/
```

### Frontend (Next.js)

```bash
cd apps/frontend

# Instalar dependências
npm install

# Executar em modo dev
npm run dev

# Build de produção
npm run build

# Rodar testes
npm test
npm run test:e2e
```

## 📊 Banco de Dados

### Modelos Principais

- **users**: Usuários do sistema
- **body_measurements**: Medidas corporais (peso, altura, circunferências)
- **progress_photos**: Fotos de evolução
- **workouts**: Treinos realizados
- **exercises**: Exercícios dos treinos
- **meals**: Refeições registradas
- **goals**: Metas definidas pelo usuário

### Migrations

```bash
# Criar nova migration
cd apps/backend
alembic revision --autogenerate -m "descrição"

# Aplicar migrations
alembic upgrade head

# Reverter última migration
alembic downgrade -1
```

## 🔒 Segurança

- ✅ HTTPS obrigatório em produção
- ✅ JWT com refresh tokens
- ✅ Rate limiting em endpoints críticos
- ✅ CORS configurado adequadamente
- ✅ Validação de input em todas as camadas
- ✅ SQL injection prevention (ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secrets management com variáveis de ambiente
- ✅ Upload de imagens com validação e sanitização

## 🧪 Testes

### Backend
```bash
# Unit tests
pytest tests/unit

# Integration tests
pytest tests/integration

# Coverage report
pytest --cov=src --cov-report=html
```

### Frontend
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deploy

### Docker Compose (Recomendado)

```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose ps

# Logs
docker-compose logs -f app
```

### Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://user:pass@db:5432/evolucaofit
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET_KEY=<seu-secret-seguro>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Storage
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=evolucaofit

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASSWORD=sua-senha

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📈 Monitoramento

- **Prometheus**: Métricas da aplicação
- **Grafana**: Dashboards de visualização
- **Loki**: Agregação de logs
- **Sentry**: Error tracking (opcional)

## 📝 API Documentation

A documentação interativa da API está disponível em:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit com conventional commits (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Conventional Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

## 📄 Licença

MIT License - veja LICENSE para detalhes

## 🙏 Agradecimentos

Desenvolvido com base nas melhores práticas de:
- Clean Architecture
- SOLID Principles
- Domain-Driven Design
- Test-Driven Development

---

💪 **EvolucaoFit** - Acompanhe sua evolução, conquiste seus objetivos!
