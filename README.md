# BLADE & CO. — Site Premium para Barbearia (Modelo Demonstrativo)

Landing page comercial moderna, responsiva e acessível desenvolvida para barbearias de alto padrão, com foco em identidade visual marcante, SEO local e conversão de agendamentos pelo WhatsApp.

## Destaques do Projeto

- **Identidade visual editorial:** paleta *obsidian*, ardósia fosca e latão champagne (`#C9AD82`), combinando `Oswald` (sólida e vazada), `Cormorant Garamond`, `IBM Plex Sans` e `IBM Plex Mono`.
- **10 seções completas:** Header responsivo com drawer mobile, Hero editorial, Sobre a barbearia, Serviços e preços com filtros por categoria, Galeria lookbook com lightbox nativo (`<dialog>`), Diferenciais, Avaliações (estrutura transparente sem depoimentos fictícios), Agendamento interativo com prévia da mensagem WhatsApp, Localização/Horários configuráveis e Footer.
- **Performance e acessibilidade:** HTML5 semântico, CSS modular sem dependências externas, JavaScript vanilla, imagens otimizadas (`~900 KB` total) e conformidade com princípios WCAG 2.2.

## Como Personalizar com Dados Reais

Todas as informações comerciais ficam centralizadas em [`scripts/site-config.js`](scripts/site-config.js):

- Nome da marca e subtítulos
- Número oficial do WhatsApp (`whatsappNumber`, formato `55DDDNUMERO`) para ativar redirecionamento direto via `wa.me`
- Telefone, e-mail, Instagram e link do Google Avaliações
- Endereço completo, horários de funcionamento e URL de incorporação do Google Maps (`mapEmbedUrl`)
- Tabela oficial de serviços e preços

## Como Executar Localmente

Necessário apenas Node.js (zero dependências externas):

```bash
node server.mjs
```

Depois, abra `http://127.0.0.1:4174` no navegador.
