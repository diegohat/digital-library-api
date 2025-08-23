# 📚 Digital Library API

> API para gerenciamento de livros, usuários e empréstimos, construída com **NestJS**, **Prisma** e **PostgreSQL**.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)  
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14-blue)  
[![Swagger Docs](https://img.shields.io/badge/Swagger-UI-brightgreen)](#-documentação-com-swagger)

![NestJS](https://nestjs.com/img/logo-small.svg)

---

## 📖 Sumário
- [Sobre o projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Uso rápido](#-uso-rápido)
- [Documentação com Swagger](#-documentação-com-swagger)
- [Endpoints principais](#-endpoints-principais)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 💡 Sobre o projeto

A **Digital Library API** é uma solução para controle de bibliotecas, permitindo:
- 📕 Cadastro e listagem de livros (com filtros)
- 👤 Gerenciamento de usuários
- 🔄 Empréstimos e devoluções com atualização de status
- ✅ Validação e testes automatizados com Jest

---

## 🛠 Tecnologias
- [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- [Jest](https://jestjs.io/) (Testes)
- [Winston](https://github.com/winstonjs/winston) (Logger)
- [Class-validator](https://github.com/typestack/class-validator) (Validação)
- [Swagger](https://swagger.io/) (Documentação interativa)

---

## 📋 Pré-requisitos
- Node.js >= 18
- Yarn >= 1.22
- PostgreSQL >= 14

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/digital-library-api.git
cd digital-library-api

# Instale as dependências
yarn install
```

---

## 🗄 Configuração do Banco de Dados

Crie um arquivo `.env` baseado no exemplo abaixo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/digital_library"
```

Depois, execute:

```bash
# Aplica migrações
yarn prisma migrate deploy

# Gera o cliente Prisma
yarn prisma generate
```

---

## ⚡ Uso rápido

```bash
# Desenvolvimento (hot reload)
yarn start:dev

# Produção
yarn start
```

Exemplo de requisição:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin"}'
```

---

## 📑 Documentação com Swagger

[![Abrir Swagger UI](https://img.shields.io/badge/Abrir%20Swagger%20UI-Localhost%203000-brightgreen)](http://localhost:3000/api)

A API possui documentação interativa via **Swagger** para facilitar o uso e teste dos endpoints.

📍 Acesse após iniciar o projeto:  
```
http://localhost:3000/api
```

📍 Especificação em JSON:  
```
http://localhost:3000/api-json
```

### Configuração no `main.ts`
```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Digital Library API')
  .setDescription('API para gerenciamento de livros, usuários e empréstimos')
  .setVersion('1.0')
  .addTag('books')
  .addTag('users')
  .addTag('loans')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### Anotações nos Endpoints
Uso de decorators como `@ApiTags`, `@ApiOperation` e `@ApiResponse` para descrever as rotas:

```ts
@ApiTags('books')
@Post()
@ApiOperation({ summary: 'Create a new book' })
@ApiResponse({ status: 201, description: 'The book has been successfully created.' })
async create(@Body() dto: CreateBookDto) {
  return await this.booksService.create(dto);
}
```

---

## 📌 Endpoints principais

| Método | Rota                     | Descrição                           | Parâmetros/Corpo |
|--------|--------------------------|--------------------------------------|------------------|
| POST   | `/books`                  | Cadastra um novo livro               | `{ title, author }` |
| GET    | `/books?status=&title=`   | Lista livros com filtros             | Query: `status`, `title` |
| PATCH  | `/books/:id/status`       | Atualiza status do livro             | `{ status }` |
| POST   | `/users`                  | Cadastra um novo usuário             | `{ name, email }` |
| POST   | `/loans`                  | Realiza empréstimo de livro          | `{ userId, bookId }` |
| PATCH  | `/loans/:id/return`       | Devolve livro                        | — |

---

## 🧪 Testes

```bash
# Executa testes
yarn test

# Gera relatório de cobertura
yarn test:cov
```
---

## 📄 Licença

Este projeto está sob a licença **GPL-3.0** — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---