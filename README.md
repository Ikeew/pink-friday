# Corrida da Quebra de Preços

Painel de gamificação de vendas da Catarinna's Energia Solar.
React 19, TypeScript, Tailwind CSS 4 e Vite, com vendas vindas da API da Groner.

## Configuração

Copie `.env.example` para `.env.local` e preencha o token. Na hospedagem, defina
`GRONER_API_URL` e `GRONER_API_TOKEN` como variáveis de ambiente.

O token e o SQL ficam só no servidor. Nunca use o prefixo `VITE_` nessas variáveis
nem chame a Groner direto do navegador: a rota dela executa o SQL que receber.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento, já com a rota /api/dashboard
npm test          # testes das métricas
npm run build     # checagem de tipos e build em dist/
npm start         # produção: serve dist/ e a API (porta 3000 ou PORT); requer Node 22.18+
```

Em produção é preciso um servidor Node. Hospedagem só de arquivos estáticos não basta.

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Datas e metas dos ciclos, Meta Geral, meta por vendedor | `src/data/dashboard.ts` |
| Foto e aparência de cada pessoa | `profiles`, em `src/data/dashboard.ts` |
| Consultas SQL | `server/groner.ts` |
| Regras de cálculo (falta, %, posição na pista) | `src/lib/metrics.ts` |
| Cores, fontes e sombras | bloco `@theme` em `src/styles.css` |

## De onde vem cada número

| No painel | Origem |
| --- | --- |
| Meta do ciclo, Meta Geral | manual |
| Realizado, Número de vendas | soma de todos os vendedores do período |
| Corrida | Top 5 vendedores do período |
| Ranking Geral | consultas de equipes e de SDRs do período |
| Ticket médio | consulta de ticket médio do período |
| Vendas no dia | vendas de hoje (São Paulo), em qualquer ciclo |

A tela atualiza a cada 10 minutos (após uma falha, tenta de novo em 1 minuto), e o servidor guarda cada resultado por 9 minutos.

## Layout

- A partir de 1280px, ou em qualquer tela larga na horizontal (900px ou mais, proporção 8:5 ou maior), o painel ocupa uma tela e escala em proporção à janela, de notebook a TV.
- Nos demais casos, o conteúdo reflui em colunas, com fonte fixa de 16px.
- Animações usam `transform` e opacidade, e respeitam `prefers-reduced-motion`.
