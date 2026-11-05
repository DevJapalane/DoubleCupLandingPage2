// ════════════════════════════════════════════════════════
//  DoubleCup Studios — devlog-data.js
//  Devlog / patch-notes entries shown in the "Devlog" section.
//
//  HOW TO POST A NEW UPDATE
//  1. Put the images in  assets/images/devlog/  (jpg/png/webp).
//  2. Copy the TEMPLATE below, paste it at the TOP of the list and fill it in.
//  3. Save and deploy. Posts are sorted by date automatically (newest first);
//     the 5 most recent show on the page, the rest behind "View all updates".
//
//  FIELDS
//  id        unique, url-friendly (letters, numbers, dashes). Used in the
//            shareable link:  https://site/#devlog/<id>
//  date      'YYYY-MM-DD'
//  category  'update' | 'devlog' | 'art' | 'news'   (sets the colored tag)
//  version   optional, e.g. 'v0.0.2'  (use null to hide)
//  title     { en, pt }
//  summary   { en, pt }  one or two lines shown in the list
//  body      { en, pt }  HTML: <p>, <h3>, <ul><li>, <strong>, <a>, <img>, <figure>
//  images    optional gallery at the end of the post (click = fullscreen)
//            [{ src: 'assets/images/devlog/file.jpg', caption: { en, pt } }]
//  cover     optional thumbnail for the list (defaults to the first image)
//
//  TEMPLATE ─────────────────────────────────────────────
//  {
//    id: 'v0-0-2',
//    date: '2026-12-01',
//    category: 'update',
//    version: 'v0.0.2',
//    title:   { en: 'Version 0.0.2 — Combat improvements', pt: 'Versão 0.0.2 — Melhorias no combate' },
//    summary: { en: 'Short line for the list.', pt: 'Linha curta para a lista.' },
//    body: {
//      en: `<p>Intro paragraph.</p>
//           <h3>What's new</h3>
//           <ul><li>Item one</li><li>Item two</li></ul>`,
//      pt: `<p>Parágrafo de introdução.</p>
//           <h3>Novidades</h3>
//           <ul><li>Item um</li><li>Item dois</li></ul>`
//    },
//    images: [
//      { src: 'assets/images/devlog/v0-0-2-combat.jpg', caption: { en: 'New hit effects', pt: 'Novos efeitos de impacto' } }
//    ]
//  },
// ════════════════════════════════════════════════════════

window.DEVLOG_POSTS = [

  {
    id: 'site-relaunch',
    date: '2026-11-05',
    category: 'news',
    version: null,
    title: {
      en: 'New official site & devlog',
      pt: 'Novo site oficial & devlog'
    },
    summary: {
      en: 'A cleaner home for the studio — and a place to follow every step of development.',
      pt: 'Uma casa mais limpa para o estúdio — e um lugar para acompanhar cada passo do desenvolvimento.'
    },
    body: {
      en: `<p>Welcome to the new DoubleCup Studios site. We cleaned things up and added this <strong>devlog</strong>, where we will post version notes, progress reports and behind-the-scenes images as the game takes shape.</p>
           <h3>What changed</h3>
           <ul>
             <li>Devlog section with full posts, images and shareable links</li>
             <li>Steam Group and Steam Curator links</li>
             <li>New permanent Discord invite</li>
             <li>Cleaner layout, mobile menu and full EN / PT-BR support</li>
           </ul>
           <p>Want to follow along more closely? Join us on <a href="https://discord.gg/XQsXQTaBcH" target="_blank" rel="noopener noreferrer">Discord</a>.</p>`,
      pt: `<p>Bem-vindo ao novo site da DoubleCup Studios. Deixamos tudo mais limpo e adicionamos este <strong>devlog</strong>, onde vamos publicar notas de versão, relatórios de progresso e imagens de bastidores conforme o jogo ganha forma.</p>
           <h3>O que mudou</h3>
           <ul>
             <li>Seção de devlog com posts completos, imagens e links compartilháveis</li>
             <li>Links para o Grupo Steam e a Curadoria Steam</li>
             <li>Novo convite permanente do Discord</li>
             <li>Layout mais limpo, menu mobile e suporte completo a EN / PT-BR</li>
           </ul>
           <p>Quer acompanhar mais de perto? Entre no nosso <a href="https://discord.gg/XQsXQTaBcH" target="_blank" rel="noopener noreferrer">Discord</a>.</p>`
    },
    images: [
      { src: 'assets/images/gallery/key-art.jpg', caption: { en: 'DoubleCup key art', pt: 'Key art DoubleCup' } }
    ]
  },

  // ── EXAMPLE POST (replace text/date with the real info) ──
  {
    id: 'skull-operative',
    date: '2026-10-20',
    category: 'art',
    version: null,
    title: {
      en: 'Character art: Skull Operative',
      pt: 'Arte de personagem: Skull Operative'
    },
    summary: {
      en: 'From base mesh to textured character — a look at our first operative.',
      pt: 'Do base mesh ao personagem texturizado — um olhar sobre nosso primeiro operativo.'
    },
    body: {
      en: `<p>Our first character went from a ~3K triangle base mesh to a fully textured low poly model, keeping the faceted look that defines the game.</p>
           <ul>
             <li>Base mesh with roughly <strong>3,000 triangles</strong></li>
             <li>Hand-placed facets to keep the silhouette readable</li>
             <li>Texturing pass with the Papa V Line suit details</li>
           </ul>`,
      pt: `<p>Nosso primeiro personagem saiu de um base mesh com ~3K triângulos para um modelo low poly totalmente texturizado, mantendo o visual facetado que define o jogo.</p>
           <ul>
             <li>Base mesh com cerca de <strong>3.000 triângulos</strong></li>
             <li>Facetas posicionadas à mão para manter a silhueta legível</li>
             <li>Texturização com os detalhes do traje Papa V Line</li>
           </ul>`
    },
    images: [
      { src: 'assets/images/gallery/skull-operative.jpg', caption: { en: 'Final textured model', pt: 'Modelo final texturizado' } },
      { src: 'assets/images/gallery/base-mesh.jpg',       caption: { en: 'Base mesh wireframe',  pt: 'Wireframe do base mesh' } }
    ]
  },

  // ── EXAMPLE POST (replace text/date with the real info) ──
  {
    id: 'v0-0-1',
    date: '2026-09-30',
    category: 'update',
    version: 'v0.0.1',
    title: {
      en: 'Version 0.0.1 — First in-engine prototype',
      pt: 'Versão 0.0.1 — Primeiro protótipo in-engine'
    },
    summary: {
      en: 'The first playable blockout: movement, camera and a rune-covered test arena.',
      pt: 'O primeiro blockout jogável: movimentação, câmera e uma arena de testes coberta de runas.'
    },
    body: {
      en: `<p>The very first build running inside the engine. Nothing pretty yet — just the foundations.</p>
           <h3>Implemented</h3>
           <ul>
             <li>Character controller and third-person camera</li>
             <li>Test arena with glowing rune decals</li>
             <li>Blockout character for scale reference</li>
           </ul>`,
      pt: `<p>A primeira build rodando dentro da engine. Nada bonito ainda — apenas as fundações.</p>
           <h3>Implementado</h3>
           <ul>
             <li>Controle do personagem e câmera em terceira pessoa</li>
             <li>Arena de testes com runas brilhantes no chão</li>
             <li>Personagem blockout como referência de escala</li>
           </ul>`
    },
    images: [
      { src: 'assets/images/gallery/prototype-engine.jpg', caption: { en: 'Blockout in the test arena', pt: 'Blockout na arena de testes' } }
    ]
  }

];
