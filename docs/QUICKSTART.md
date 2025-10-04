# 🚀 Guia Rápido - FitnessTracker

## Início Rápido (5 minutos)

### 1. Pré-requisitos
- Docker 24+
- Docker Compose 2+
- 4GB RAM disponível

### 2. Instalação Automática

```bash
# Clone o repositório
git clone <seu-repo>
cd fitness-tracker

# Instalação automatizada
make install
```

Isso irá:
- ✅ Criar arquivo `.env`
- ✅ Build das imagens Docker
- ✅ Iniciar todos os serviços
- ✅ Executar migrations do banco

### 3. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (admin/admin)

### 4. Primeiro Uso

1. Acesse http://localhost:3000
2. Clique em "Cadastrar"
3. Preencha seus dados
4. Faça login
5. Comece a registrar suas medidas!

## Comandos Úteis

```bash
# Ver logs
make logs

# Parar serviços
make down

# Reiniciar
make restart

# Backup do banco
make backup-db

# Rodar migrações
make migrate

# Ver status
make ps
```

## Solução de Problemas

### Porta já em uso
```bash
# Verifique portas em uso
sudo lsof -i :3000
sudo lsof -i :8000

# Pare os serviços e tente novamente
make down
make up
```

### Banco de dados não conecta
```bash
# Verifique status do container
docker-compose ps db

# Veja logs do banco
docker-compose logs db

# Recrie o banco
make clean
make install
```

### Frontend não carrega
```bash
# Limpe cache do Next.js
docker-compose exec frontend rm -rf .next
docker-compose restart frontend
```

## Desenvolvimento

### Backend (FastAPI)
```bash
# Logs do backend
make logs-backend

# Shell do backend
make shell-backend

# Rodar testes
make test-backend

# Criar nova migration
make migrate-create MSG="add_new_field"
```

### Frontend (Next.js)
```bash
# Logs do frontend
make logs-frontend

# Shell do frontend
make shell-frontend

# Rodar testes
make test-frontend
```

## Próximos Passos

1. Leia a [Documentação Completa](../README.md)
2. Veja a [Arquitetura](./architecture/ARCHITECTURE.md)
3. Confira os [Exemplos de API](./api/EXAMPLES.md)
