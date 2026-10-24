# 🐾 PetShop Manager

 Primeiro projeto que consome uma API externa que fiz, com o objetivo se servir como introdução a requisições para uma API real

O projeto integra a The Cat API para consultar raças de gatos, nome, idade etc. 

## ✨ Funcionalidades

- 👤 Cadastro, consulta, edição e exclusão de clientes.
- 🐾 Cadastro, consulta, edição e exclusão de pets.
- 🔎 Pesquisa de clientes pelo nome do tutor ou do animal.
- 📋 Visualização e edição dos detalhes dos cadastros.
- 🗑️ Exclusão de clientes e seus pets associados.
- 🐈 Consulta de raças de gatos por meio da The Cat API.
- 💻 Interface com cards, formulários, navegação lateral e notificações.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES Modules)
- Node.js
- Express
- JSON Server
- Vite
- The Cat API
- dotenv
- CORS

## 🚀 Como executar o projeto

### 1. Pré-requisitos

Instale o [Node.js](https://nodejs.org/), que inclui o npm.

### 2. Clone o repositório

```bash
git clone https://github.com/AllaanDEV/Petshop-manager.git
cd Petshop-manager
```

### 3. Instale as dependências

Na raiz do projeto, execute:

```bash
npm install
```

### 4. Obtenha sua chave da The Cat API

O projeto utiliza a The Cat API para consultar informações sobre raças de gatos.

1. Acesse o site oficial: [The Cat API](https://thecatapi.com/).
2. Faça seu cadastro para solicitar uma chave de API.
3. Confira seu e-mail, pois a chave é enviada por lá.
4. Copie a chave recebida. Você precisará dela na configuração do ambiente.

Documentação oficial: [Getting Started — The Cat API](https://docs.thecatapi.com/docs/intro).

### 5. Configure as variáveis de ambiente

Na raiz do projeto, você encontrará o arquivo `.env.example`, que serve como modelo de configuração.

Crie uma cópia dele com o nome **`.env`**, no mesmo diretório do `package.json` e do `server.js`.

Abra o arquivo `.env` e preencha a variável com sua chave real:

```env
CAT_API_KEY=sua_chave_real_aqui
```

Substitua `sua_chave_real_aqui` pela chave que recebeu por e-mail, sem aspas.

**Importante:**
- O arquivo `.env.example` deve conter apenas um exemplo, sem sua chave privada.
- O arquivo `.env` não deve ser enviado ao GitHub.
- Confira se `.env` está listado no `.gitignore`.
- Não compartilhe sua chave de API publicamente.

### 6. Inicie os servidores

Abra três terminais na pasta do projeto.

**Terminal 1 — Frontend**

```bash
npm run dev
```

O Vite exibirá o endereço local para acessar a aplicação, geralmente `http://localhost:5173`.

**Terminal 2 — API de clientes e pets**

```bash
npm run server
```

O JSON Server ficará disponível em `http://localhost:3000`.

**Terminal 3 — Backend da The Cat API**

```bash
npm run api
```

O backend Express ficará disponível em `http://localhost:3001`.

Mantenha os três terminais abertos enquanto estiver utilizando o projeto.

## 🔌 APIs

| API | Finalidade |
|---|---|
| JSON Server | Armazenamento e gerenciamento local de clientes e pets |
| Express | Backend que intermedeia as requisições à The Cat API |
| The Cat API | Consulta de informações sobre raças de gatos |

## 📁 Estrutura do projeto

```text
Petshop-manager/
├── scripts/
│   ├── api.js
│   ├── main.js
│   └── db.json
├── server.js
├── index.html
├── style.css
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 🏗️ Build de produção

Para gerar os arquivos de produção do frontend, execute:

```bash
npm run build
```

O Vite criará a pasta `dist` com os arquivos compilados.

Para executar o frontend em modo de desenvolvimento, utilize `npm run dev`.

**Observação:** o build prepara o frontend para produção, mas não hospeda automaticamente o backend nem o JSON Server. A aplicação, na configuração atual, depende dos serviços locais.

## 🎯 Objetivo do projeto

Projeto desenvolvido para praticar JavaScript, operações CRUD, consumo de APIs, gerenciamento de dados e integração entre frontend e backend.

---

