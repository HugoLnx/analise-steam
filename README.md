# 📊 Steam Analytics - Importação e Visualização de Dados

## 📌 Descrição

Este projeto tem como objetivo importar dados de jogos extraídos da Steam (via bot) a partir de um arquivo JSON e armazená-los em um banco de dados, permitindo visualização e análise através do Django Admin.

---

## ⚙️ Tecnologias utilizadas

* Python
* Django
* SQLite (banco de dados padrão)

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

```
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

```
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

### 8. Acessar o sistema

Abrir no navegador:

```
http://127.0.0.1:8000/admin
```

Fazer login com o usuário criado.

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
