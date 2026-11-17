# DoubleCup Studios — Landing Page (LandingPageCode)

Reconstrução da LandingPage10 (a que está em https://doublecup.vercel.app/), mantendo o visual
roxo/PS1, o copo 3D (com o "glitch" da textura preservado) e o layout de landing page — agora
mais limpa, com **Devlog** e links da Steam.

## Estrutura

```

LandingPageCode/
├── index.html                     ← página única
├── README.md
├── devlog/<id>/index.html         ← GERADO: página de compartilhamento de cada post (preview)
├── tools/build-share-pages.js     ← gera a pasta devlog/ a partir do devlog-data.js
└── assets/
    ├── css/styles.css             ← todo o estilo
    ├── js/
    │   ├── cup-geometry.js        ← geometria do copo 3D (NÃO EDITAR — gera o glitch)
    │   ├── i18n.js                ← todos os textos EN / PT-BR
    │   ├── devlog-data.js         ← posts do Devlog  ← é aqui que você publica atualizações
    │   └── main.js                ← viewer 3D, devlog, lightbox, menu, idioma
    └── images/
        ├── favicon*.png
        ├── gallery/               ← imagens da seção "Trabalhos em produção"
        └── devlog/                ← coloque aqui as imagens dos posts
```

## Como rodar

Abrir o `index.html` direto no navegador já funciona (não usa `fetch`). Para testar como no Vercel:

```bash
python -m http.server 8080 --directory LandingPageCode
```

Deploy no Vercel: apontar o projeto para a pasta `LandingPageCode` (site estático, sem build).

## Como postar uma atualização no Devlog

1. Coloque as imagens em `assets/images/devlog/`.
2. Abra `assets/js/devlog-data.js`, copie o **TEMPLATE** do topo e cole no início da lista.
3. Preencha `id`, `date` (`AAAA-MM-DD`), `category` (`update`, `devlog`, `art`, `news`),
   `version` (ex.: `'v0.0.2'` ou `null`), `title`, `summary`, `body` (HTML) e `images` — sempre em `en` e `pt`.
4. Gere as páginas de compartilhamento (precisa do Node instalado):

   ```bash
   node tools/build-share-pages.js
   ```

5. Faça commit (incluindo a pasta `devlog/` gerada) e o deploy. Os posts são ordenados por data
   automaticamente; os 5 mais recentes aparecem na página e o resto fica atrás de "Ver todas as atualizações".

### Link para compartilhar (com preview do post)

Use **`https://doublecup.vercel.app/devlog/<id>/`**, que é o link copiado pelo botão "Copiar link" dentro do post.
No Discord, WhatsApp, X etc. esse link mostra o título, o resumo e a **primeira imagem do post**
(ou a imagem em `cover`, se definida). Quem clica é levado direto ao post no site.

O link antigo `/#devlog/<id>` continua abrindo o post, mas o preview dele sempre será o do site
(logo DoubleCup): as redes sociais não leem a parte depois do `#` nem executam JavaScript.

O idioma do preview é definido em `SHARE_LANG` dentro de `tools/build-share-pages.js` (padrão: `pt`).

> As redes guardam previews em cache. Se um link já foi postado antes da mudança, o preview antigo
> pode continuar aparecendo nele por um tempo; um link novo já sai com a imagem certa.

> ⚠️ Os posts `skull-operative` e `v0-0-1` são **exemplos** feitos com as imagens que já existiam
> na galeria — troque datas e textos pelos reais (ou apague-os).

## O que foi encontrado no site atual e corrigido

| Problema na LandingPage10 | Correção |
|---|---|
| Convite do Discord `XGrxY46A` expirado ("Unknown Invite") | Novo convite permanente `discord.gg/XQsXQTaBcH` |
| Stat "<10 Elite Team" e "∞ Projects in stealth" não condiziam com a realidade | "2 — Equipe · Dev solo + Designer solo", "2026 — Fundação" |
| 🇧🇷 em emoji aparecia como letras "BR" no Windows | "BR" estilizado de propósito |
| Letreiro "DOUBLECUP" em SVG desenhado à mão com polígonos quebrados (E, C, P deformados) | Wordmark em fonte block (Bungee) com extrusão 3D roxa via CSS — mesmo estilo, nítido |
| Galeria com rótulos trocados (a arte do copo aparecia como "Shadow Warrior" e "Dark Operative") e imagem duplicada | Rótulos corretos, duplicata removida |
| Print do base mesh mostrando a UI da ferramenta (botão "+$20", painel) | Imagem recortada |
| Imagens JPEG salvas com extensão `.png` | Renomeadas para `.jpg` |
| Katanas (imagens finas e altas) cortadas pelo `cover` | Exibidas inteiras (`contain`) |
| Sem menu no celular (links somem abaixo de 768px) | Menu hambúrguer |
| Cursor quadrado customizado (aparecia fixo no canto no celular) | Removido — cursor padrão |
| Tradução PT incompleta (manifesto não traduzia, títulos fixos no JS) e idioma não era lembrado | Dicionário único `i18n.js`, detecta PT pelo navegador e lembra a escolha |
| Ao arrastar o copo depois da rotação automática, ele "pulava" de volta | Arrasto continua do ângulo atual |
| Render 3D rodando sempre, mesmo fora da tela | Pausa quando o hero sai da tela / aba oculta |
| Sem fallback se o Three.js falhar | Mostra imagem estática do copo |
| Sem meta tags de compartilhamento | Open Graph / Twitter card |
| Animações sem respeitar `prefers-reduced-motion` | Respeita |
| Muitos efeitos competindo (flicker em tudo, grid piscando, 8 seções com divisórias) | Efeitos mais sutis, Essência + Manifesto unidos, nav transparente no topo |

## Dependências externas

- Three.js **r128** (cdnjs) — manter essa versão para preservar o visual do copo.
- Google Fonts: VT323, Share Tech Mono, Cinzel, Bungee.
