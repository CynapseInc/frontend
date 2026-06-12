# Encanto Personalizados - Frontend

Interface web do sistema Encanto Personalizados, desenvolvida com React, TypeScript e Vite. O frontend atende o catalogo publico, carrinho e as areas internas de operacao, pedidos, produtos, clientes, funcionarios e dashboards.

## Tecnologias

- React 19
- TypeScript
- Vite 7
- React Router
- Axios
- Recharts
- Radix UI
- Lucide React e React Icons
- ESLint
- Selenium para testes automatizados de interface
- Docker e Nginx para build de producao

## Estrutura

```text
frontend/
├── EncantoFrontend/         # Aplicacao React/Vite
│   ├── src/
│   │   ├── components/      # Telas, modais e componentes reutilizaveis
│   │   ├── interfaces/      # Tipagens TypeScript
│   │   ├── provider/        # Rotas, protecao de rotas e cliente HTTP
│   │   ├── services/        # Chamadas para a API
│   │   └── assets/          # Imagens e icones
│   ├── selenium/            # Testes E2E em Python/Selenium
│   ├── package.json         # Scripts e dependencias
│   ├── Dockerfile           # Build estatico com Nginx
│   └── vite.config.ts       # Configuracao do Vite
└── package-lock.json
```

## Requisitos

- Node.js compativel com o projeto
- npm
- Backend rodando em `http://localhost:8080` para uso em desenvolvimento

## Como rodar localmente

Entre na pasta da aplicacao:

```powershell
cd frontend\EncantoFrontend
```

Instale as dependencias:

```powershell
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O Vite exibira a URL local no terminal, normalmente `http://localhost:5173`.

## Integracao com a API

O cliente HTTP fica em `EncantoFrontend/src/provider/api.ts`.

Em desenvolvimento, as chamadas usam:

```text
http://localhost:8080
```

Em producao, as chamadas usam:

```text
/api
```

O token JWT e enviado automaticamente no header `Authorization: Bearer <token>` quando encontrado em `localStorage` ou `sessionStorage`.

## Rotas principais

Rotas publicas:

- `/login`
- `/catalogo`
- `/detalhe-produto/:id`
- `/carrinho`
- `/pesquisa-produtos`

Rotas internas protegidas:

- `/home`
- `/kanban`
- `/pedidos`
- `/pedidos/cadastro`
- `/pedidos/detalhes/:id`
- `/clientes`
- `/lista-produtos`
- `/produtos`
- `/produtos/editar/:id`
- `/produtos/fotos/:id`
- `/dashboard`
- `/dashboard-gestao`
- `/funcionarios`
- `/movimentacao`

As permissoes de acesso sao controladas em `EncantoFrontend/src/provider/ProtectedRoutes.jsx`.

## Comandos uteis

Rodar em desenvolvimento:

```powershell
npm run dev
```

Gerar build de producao:

```powershell
npm run build
```

Executar lint:

```powershell
npm run lint
```

Visualizar o build localmente:

```powershell
npm run preview
```

## Testes Selenium

Os testes ficam em `EncantoFrontend/selenium`.

Instale as dependencias Python:

```powershell
cd frontend\EncantoFrontend\selenium
pip install -r requirements.txt
```

Com frontend e backend rodando, execute um dos arquivos de teste:

```powershell
python testes_basicos.py
python carrinho_testes.py
```

## Build com Docker

Na pasta `frontend/EncantoFrontend`:

```powershell
docker build -t encanto-frontend .
docker run --rm -p 8081:80 encanto-frontend
```

A aplicacao estatica ficara disponivel em `http://localhost:8081`.

## Observacoes de desenvolvimento

- Algumas telas ainda usam `http://localhost:8080` diretamente para montar URLs de imagens ou chamadas especificas.
- O backend deve estar ativo para login, catalogo, pedidos, dashboards e cadastros funcionarem.
- O projeto usa componentes de UI locais em `src/components/ui` e componentes especificos por tela em `src/components`.
