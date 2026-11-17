// ════════════════════════════════════════════════════════
//  DoubleCup Studios — devlog-data.js
//  Devlog / patch-notes entries shown in the "Devlog" section.
//
//  HOW TO POST A NEW UPDATE
//  1. Put the images in  assets/images/devlog/  (jpg/png/webp).
//  2. Copy the TEMPLATE below, paste it at the TOP of the list and fill it in.
//  3. Run  node tools/build-share-pages.js  (creates the shareable link with the
//     post's image as preview: https://site/devlog/<id>/), then commit and deploy.
//     Posts are sorted by date automatically (newest first); the 5 most recent
//     show on the page, the rest behind "View all updates".
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
//    category: 'devlog',
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
    id: 'smooth-locomotion-hold-combo',
    date: '2026-11-17',
    category: 'devlog',
    version: null,
    title: {
      en: 'Smooth walk/run and hold-to-combo',
      pt: 'Andar/correr fluido e combo segurando o botão'
    },
    summary: {
      en: 'No more bobbing head while moving, feet planted on the ground, and the full 3-hit combo by holding the left mouse button.',
      pt: 'Fim da cabeça subindo e descendo ao se mover, pés firmes no chão e o combo de 3 golpes segurando o botão esquerdo.'
    },
    body: {
      en: `<h3>1. Head bobbing up and down: fixed</h3>
           <p><strong>Cause:</strong> the body height was recalculated every frame so the lowest point touched the ground. During a stride it followed the geometry of the supporting leg: higher with the leg vertical, lower with the leg angled. Unity also places the body by its center of mass, so the swinging legs moved the hips too. Result: a large, jerky up-and-down motion.</p>
           <p><strong>Fix:</strong> the standard technique used in games.</p>
           <ul>
             <li><strong>Hips:</strong> while moving, they follow the average height over one step, plus a small, smooth wave. Running bounce dropped from 5 to 3 cm and walking bounce from 2 to 1.2 cm.</li>
             <li><strong>Supporting foot:</strong> <code>HumanoidFootPlanting</code> (the foot IK) now also works while moving and keeps on the ground the foot that the step phase says is planted. The knee absorbs the difference and bends mid-stance, like in a real run.</li>
             <li><strong>Stepping foot:</strong> when the front leg can't reach the ground, the hips lower smoothly by the average amount needed, without any jerk.</li>
             <li>No foot goes through the ground.</li>
             <li><strong>Slopes and steps:</strong> the ground height under each foot is read with a raycast.</li>
             <li>Idle, airborne and slide work as before.</li>
           </ul>
           <p>New option in <code>ProceduralHumanoidAnimator</code>: <strong>Smooth Locomotion Height</strong> (on).</p>

           <h3>2. Hold the left button = the 3 hits</h3>
           <ul>
             <li><strong>Click and hold:</strong> the 3 hits come out in sequence.</li>
             <li><strong>After the third:</strong> holding does nothing else. Release and click (and hold) again for another 3.</li>
             <li><strong>Release early:</strong> the combo stops at the current hit.</li>
             <li><strong>Clicks:</strong> still work as before, one hit per click, chaining.</li>
           </ul>`,
      pt: `<h3>1. Cabeça subindo e descendo: corrigido</h3>
           <p><strong>Causa:</strong> a altura do corpo era recalculada a cada quadro para encostar o ponto mais baixo no chão. Durante a passada ela seguia a geometria da perna de apoio: mais alto com a perna vertical, mais baixo com a perna inclinada. O Unity ainda posiciona o corpo pelo centro de massa, então as pernas balançando também mexiam o quadril. Resultado: um sobe-e-desce grande e com trancos.</p>
           <p><strong>Correção:</strong> é a técnica padrão de jogos.</p>
           <ul>
             <li><strong>Quadril:</strong> em movimento, segue a média da altura ao longo de um passo, mais uma ondulação suave e pequena. O bounce da corrida caiu de 5 para 3 cm e o da caminhada de 2 para 1,2 cm.</li>
             <li><strong>Pé de apoio:</strong> o <code>HumanoidFootPlanting</code> (o IK de pés) agora também age em movimento e mantém no chão o pé que a fase do passo diz estar apoiado. O joelho absorve a diferença e flexiona no meio do apoio, como numa corrida real.</li>
             <li><strong>Pé que pisa:</strong> quando a perna da frente não alcança o chão, o quadril desce suavemente o necessário, em média, sem criar tranco.</li>
             <li>Nenhum pé atravessa o chão.</li>
             <li><strong>Rampas e degraus:</strong> a altura do chão sob cada pé é lida com um raio.</li>
             <li>Parado, no ar e no slide continua como antes.</li>
           </ul>
           <p>Opção nova no <code>ProceduralHumanoidAnimator</code>: <strong>Smooth Locomotion Height</strong> (ligada).</p>

           <h3>2. Segurar o botão esquerdo = os 3 golpes</h3>
           <ul>
             <li><strong>Clicar e segurar:</strong> os 3 golpes saem em sequência.</li>
             <li><strong>Depois do terceiro:</strong> segurar não faz mais nada. É preciso soltar e clicar (e segurar) de novo para outros 3.</li>
             <li><strong>Soltar antes:</strong> o combo para no golpe atual.</li>
             <li><strong>Cliques:</strong> continuam funcionando como antes, um golpe por clique, encadeando.</li>
           </ul>`
    },
    images: [
      { src: 'assets/images/devlog/2026-11-17-locomotion-combo.jpg', caption: { en: 'Locomotion and combo test scene in Unity', pt: 'Cena de testes de locomoção e combo na Unity' } }
    ]
  },

  {
    id: 'character-rig-animation',
    date: '2026-11-16',
    category: 'devlog',
    version: null,
    title: {
      en: 'Work in progress: character rig & animation',
      pt: 'Em andamento: rig e animação de personagens'
    },
    summary: {
      en: 'The player character is now rigged as a Humanoid in Unity, ready to receive animations.',
      pt: 'O personagem do jogador agora está com rig Humanoid na Unity, pronto para receber animações.'
    },
    body: {
      en: `<p>This week the focus is on bringing our characters to life. The player model got its skeleton and is now configured as a <strong>Humanoid avatar</strong> in Unity, the base we need to animate it and reuse animations across characters.</p>
           <h3>In progress</h3>
           <ul>
             <li>Rig of the player model, with the bones of body, head, arms and legs</li>
             <li>Humanoid avatar mapping in Unity, with every required bone assigned</li>
             <li>First movement tests in the Animator</li>
           </ul>
           <h3>Next steps</h3>
           <ul>
             <li>Hook up movement and combat animations to the player</li>
             <li>Tweak muscles and joint limits so poses stay clean</li>
           </ul>`,
      pt: `<p>Nesta semana o foco é dar vida aos personagens. O modelo do jogador ganhou seu esqueleto e agora está configurado como <strong>avatar Humanoid</strong> na Unity, a base que precisamos para animá-lo e reaproveitar animações entre personagens.</p>
           <h3>Em andamento</h3>
           <ul>
             <li>Rig do modelo do jogador, com os ossos de corpo, cabeça, braços e pernas</li>
             <li>Mapeamento do avatar Humanoid na Unity, com todos os ossos obrigatórios definidos</li>
             <li>Primeiros testes de movimentação no Animator</li>
           </ul>
           <h3>Próximos passos</h3>
           <ul>
             <li>Ligar as animações de movimentação e combate ao jogador</li>
             <li>Ajustar músculos e limites das articulações para as poses ficarem limpas</li>
           </ul>`
    },
    images: [
      { src: 'assets/images/devlog/2026-11-16-rig-unity.jpg', caption: { en: 'Humanoid avatar configuration in Unity', pt: 'Configuração do avatar Humanoid na Unity' } }
    ]
  },

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
    category: 'devlog',
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
