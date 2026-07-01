# 📊 Steam Analytics - Importação e Visualização de Dados

> **⚠️ TODO: #26**
>
> * Expandir a seção de Descrição incluindo os objetivos do projeto e o Modelo Conceitual BFD (Basic Functional Design).
> * Adicionar seção detalhada de Autoria e Responsabilidade mapeando as contribuições de cada participante do grupo.

> **⚠️ TODO: #21 - Setup Docker & Docker-Compose**
>
> * Criar `Dockerfile` na raiz para o Backend Django (utilizar Python 3.x-slim e expor porta 8000).
> * Criar `Dockerfile` dentro da pasta `frontend/` para o React (utilizar Node.js para build e opcionalmente Nginx para servir os estáticos ou apenas node para dev).
> * Criar `docker-compose.yml` na raiz orquestrando dois serviços independentes:
>    * `backend`: Deve montar volume para o `db.sqlite3` para persistência e rodar as migrations no startup.
>    * `frontend`: Deve se comunicar com o backend via URL de API configurável (variável de ambiente).
>
> * Garantir que a `CORS_ALLOWED_ORIGINS` no Django aceite a origem do container frontend.

## 📌 Descrição

Este projeto tem como objetivo importar dados de jogos extraídos da Steam (via bot) a partir de um arquivo JSON e armazená-los em um banco de dados, permitindo visualização e análise através do Django Admin.

---

## ⚙️ Tecnologias utilizadas

* Python
* Django
* SQLite (banco de dados padrão)
* React
* Docker

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/JoaoLopes07/analise-steam.git
cd steam_analytics


```

---

### 2. Criar ambiente virtual (opcional)

```bash
python -m venv venv
venv\Scripts\activate  # Windows


```

---

### 3. Instalar dependências

```bash
pip install django


```

---

### 4. Rodar as migrations (criar banco de dados)

```bash
python manage.py makemigrations
python manage.py migrate


```

---

### 5. Importar os dados do JSON

Coloque o arquivo JSON na raiz do projeto (mesma pasta do `manage.py`).

Exemplo:

```ini
steam_analytics/
 ├── import_json.py
 ├── manage.py
 ├── games.json


```

Rodar:

```bash
python import_json.py games.json


```

Se tudo estiver correto, será exibido:

```sh
Importação finalizada!


```

---

### 6. Criar usuário admin

```bash
python manage.py createsuperuser


```

Preencher:

* usuário
* email
* senha

---

### 7. Rodar o servidor

```bash
python manage.py runserver


```

---

### 8. Rodar os testes

A suíte de testes usa SQLite em memória — não é necessário configuração extra.

```bash
cd steam_analytics
python manage.py test games --verbosity=2


```

Para rodar apenas os testes da API de jogos:

```bash
python manage.py test games.tests.test_list_games --verbosity=2


```

---

### 9. Acessar o sistema

Abrir no navegador:

```sh
http://127.0.0.1:8000/admin


```

Fazer login com o usuário criado.

---

### 10. Configurar o front

Acesse o diretório e instale as dependências:

```sh
.\venv\Scripts\pip.exe install django-cors-headers

cd frontend
npm i


```

---

### 11. Rodar o front

Acesse o diretório e inicie o front:

```sh
cd frontend
npm run dev

Frontend React rodando em http://localhost:5173


```

## 🚀 Como rodar o projeto (Docker)

### 1. Rodar com Docker (Docker Compose)

#### Passos

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend (admin): http://localhost:8000/admin


---

## 📊 Visualização dos dados

No painel administrativo será possível visualizar:

* **Jogos**
* **Tags**
* **Rankings**

Funcionalidades disponíveis:

* Busca por nome de jogo
* Ordenação por receita, avaliações, etc.
* Filtros básicos

---

## 🧠 Estrutura dos dados

Os dados são organizados em três entidades principais:

* **Game**: informações principais do jogo (nome, preço, avaliações, receita)
* **Tag**: categorias associadas ao jogo
* **Ranking**: posição do jogo em diferentes categorias

---

## 🔄 Fluxo do sistema

1. O bot gera um arquivo JSON com dados da Steam
2. O script `import_json.py` processa o JSON
3. Os dados são normalizados e salvos no banco
4. O Django Admin permite visualizar e filtrar os dados

---

## 📌 Conclusão

Este sistema elimina a necessidade de análise manual em Excel, permitindo:

* organização dos dados
* consultas rápidas
* base para futuras análises e dashboards

---
