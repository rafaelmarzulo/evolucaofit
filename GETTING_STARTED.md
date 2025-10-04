# 🎯 Como Começar - EvolucaoFit

## ⚡ Instalação Rápida (2 minutos)

```bash
cd /home/rafael/projetos/evolucaofit

# Instalação automatizada
make install
```

Isso irá configurar tudo automaticamente! ✨

## 🌐 Acessar a Aplicação

Após a instalação, acesse:

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (user: minioadmin, pass: minioadmin)

## 📝 Primeiro Uso

### 1. Criar sua Conta

1. Acesse http://localhost:3000
2. Clique em **"Cadastrar"**
3. Preencha:
   - Email
   - Nome completo
   - Senha (mínimo 8 caracteres)
   - Altura (opcional)
   - Data de nascimento (opcional)
4. Clique em **"Criar Conta"**

### 2. Fazer Login

1. Use seu email e senha
2. Você receberá um token JWT
3. Será redirecionado para o dashboard

### 3. Registrar Primeira Medida

1. No dashboard, clique em **"Nova Medida"**
2. Preencha:
   - Data da medida
   - Peso (obrigatório)
   - Percentual de gordura (opcional)
   - Circunferências (opcional)
3. Salve!

### 4. Ver Evolução

- Gráficos mostrarão sua evolução ao longo do tempo
- Compare medidas entre diferentes períodos
- Exporte relatórios em PDF

## 🛠️ Comandos Essenciais

```bash
# Ver todos os comandos disponíveis
make help

# Iniciar serviços
make up

# Ver logs em tempo real
make logs

# Parar serviços
make down

# Reiniciar tudo
make restart

# Backup do banco de dados
make backup-db
```

## 📊 Estrutura do Projeto

```
evolucaofit/
├── apps/
│   ├── backend/          # API FastAPI
│   └── frontend/         # Next.js App
├── docs/                 # Documentação
├── infrastructure/       # Docker configs
├── Makefile             # Comandos úteis
├── docker-compose.yml   # Orquestração
└── README.md            # Documentação principal
```

## 🔧 Desenvolvimento

### Backend

```bash
# Acessar container do backend
make shell-backend

# Ver logs do backend
make logs-backend

# Rodar testes
make test-backend

# Criar nova migration
make migrate-create MSG="adiciona_campo_peso"

# Aplicar migrations
make migrate
```

### Frontend

```bash
# Acessar container do frontend
make shell-frontend

# Ver logs do frontend
make logs-frontend

# Rodar testes
make test-frontend
```

### Banco de Dados

```bash
# Acessar PostgreSQL
make db-shell

# Backup
make backup-db

# Restore (após criar backup)
make restore-db FILE=backups/backup_20240120.sql
```

## 📚 Recursos

### Documentação

- [Guia Rápido](docs/QUICKSTART.md)
- [Arquitetura](docs/architecture/ARCHITECTURE.md)
- [API Guide](docs/api/API_GUIDE.md)
- [README Principal](README.md)

### API

A API está documentada de forma interativa:

- **Swagger UI**: http://localhost:8000/docs
  - Teste todos os endpoints
  - Veja exemplos de request/response
  - Execute requisições direto da interface

- **ReDoc**: http://localhost:8000/redoc
  - Documentação mais limpa
  - Ideal para leitura

## 🐛 Solução de Problemas

### Porta já em uso

```bash
# Verificar o que está usando a porta
sudo lsof -i :3000  # Frontend
sudo lsof -i :8000  # Backend
sudo lsof -i :5432  # PostgreSQL

# Parar e recriar
make down
make up
```

### Erro de conexão com banco

```bash
# Ver status do container
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Recriar banco
make clean
make install
```

### Frontend não atualiza

```bash
# Limpar cache do Next.js
docker-compose exec frontend rm -rf .next
docker-compose restart frontend
```

### Backend com erro de import

```bash
# Reconstruir imagem
docker-compose build backend
docker-compose up -d backend
```

## 🚀 Próximos Passos

### Implementar Funcionalidades

1. **Fotos de Progresso**
   - Upload de imagens
   - Comparação visual

2. **Treinos**
   - Registro de exercícios
   - Evolução de carga

3. **Nutrição**
   - Diário alimentar
   - Controle de macros

4. **Metas**
   - Definir objetivos
   - Acompanhar progresso

### Personalizar

1. **Tema/Design**
   - Edite `apps/frontend/src/app/globals.css`
   - Ajuste cores em `tailwind.config.ts`

2. **Adicionar Campos**
   - Backend: Crie migration com `make migrate-create`
   - Frontend: Adicione ao formulário

3. **Novas Features**
   - Crie novo service no backend
   - Adicione route correspondente
   - Implemente UI no frontend

## 📞 Suporte

Se precisar de ajuda:

1. Verifique a [Documentação](README.md)
2. Veja os [Issues do GitHub](https://github.com/seu-usuario/evolucaofit/issues)
3. Consulte os logs: `make logs`

## ✅ Checklist de Setup

- [ ] Docker e Docker Compose instalados
- [ ] Executou `make install`
- [ ] Acessou http://localhost:3000
- [ ] Criou sua conta
- [ ] Registrou primeira medida
- [ ] Explorou a API em http://localhost:8000/docs

## 🎉 Pronto!

Agora você está pronto para começar a usar o EvolucaoFit!

**Dicas:**
- Registre suas medidas semanalmente
- Tire fotos de progresso mensalmente
- Acompanhe gráficos de evolução
- Defina metas realistas

Boa sorte na sua jornada fitness! 💪
