/* =========================================================
   regions.js — Quiz "Onde em Teyvat você deveria viver?"
   Mesma arquitetura de quizzes.js e characters.js.
   ========================================================= */

const REGION_QUESTIONS = [
  {
    text: "O que mais representa liberdade para você?",
    options: [
      { text: "Viver sem regras rígidas, seguindo meu próprio ritmo.", scores:{mondstadt:3, natlan:1} },
      { text: "Ter a mente livre para questionar e aprender sempre.", scores:{sumeru:3, fontaine:1} },
      { text: "Poder buscar meus próprios objetivos, mesmo sozinho(a).", scores:{snezhnaya:3, inazuma:1} },
      { text: "Viver de acordo com tradições que me dão identidade.", scores:{liyue:3, inazuma:1} },
    ],
  },
  {
    text: "Qual sua relação com tradições e costumes antigos?",
    options: [
      { text: "Prezo profundamente por eles — são a base de tudo.", scores:{inazuma:3, liyue:1} },
      { text: "Vejo tradições como histórias interessantes, mas questionáveis.", scores:{fontaine:3, sumeru:1} },
      { text: "Prefiro criar meus próprios costumes.", scores:{mondstadt:3, natlan:1} },
      { text: "Respeito, mas acredito que podem e devem evoluir.", scores:{sumeru:3, fontaine:1} },
    ],
  },
  {
    text: "Como você encara rotina e disciplina?",
    options: [
      { text: "Essenciais — sem elas nada se constrói de verdade.", scores:{inazuma:3, liyue:1} },
      { text: "Prefiro flexibilidade — cada dia é uma nova oportunidade.", scores:{mondstadt:3, natlan:1} },
      { text: "Gosto de estrutura, mas com espaço para descoberta.", scores:{sumeru:3, fontaine:1} },
      { text: "Sigo minha própria disciplina, do meu próprio jeito.", scores:{inazuma:3, snezhnaya:1} },
    ],
  },
  {
    text: "O que mais desperta sua curiosidade?",
    options: [
      { text: "Como as coisas funcionam por dentro, na teoria e na prática.", scores:{sumeru:3, fontaine:1} },
      { text: "Histórias antigas e os contratos que moldaram o presente.", scores:{liyue:3, inazuma:1} },
      { text: "Lugares novos e culturas diferentes das minhas.", scores:{natlan:3, mondstadt:1} },
      { text: "Segredos que a maioria das pessoas prefere não descobrir.", scores:{snezhnaya:3, fontaine:1} },
    ],
  },
  {
    text: "O que significa justiça para você?",
    options: [
      { text: "Seguir a lei à risca, sem exceções.", scores:{fontaine:3, inazuma:1} },
      { text: "Fazer o que é certo, mesmo contra as regras.", scores:{natlan:3, mondstadt:1} },
      { text: "Honrar os acordos e contratos feitos.", scores:{liyue:3, fontaine:1} },
      { text: "Cada um responde pelas próprias escolhas, sem intervenções.", scores:{snezhnaya:3, sumeru:1} },
    ],
  },
  {
    text: "Como você reage à ideia de uma grande aventura?",
    options: [
      { text: "Topo na hora, sem pensar duas vezes.", scores:{natlan:3, mondstadt:1} },
      { text: "Prefiro aventuras intelectuais a físicas.", scores:{sumeru:3, fontaine:1} },
      { text: "Encaro com cautela, mas não recuo se for necessário.", scores:{inazuma:3, liyue:1} },
      { text: "Prefiro observar o perigo de longe, com sabedoria.", scores:{fontaine:3, sumeru:1} },
    ],
  },
  {
    text: "Qual é o tamanho da sua ambição?",
    options: [
      { text: "Grande — quero deixar minha marca no mundo.", scores:{snezhnaya:3, inazuma:1} },
      { text: "Prefiro prosperar com equilíbrio e sem pressa.", scores:{liyue:3, mondstadt:1} },
      { text: "Quero entender tudo que puder sobre o universo.", scores:{sumeru:3, fontaine:1} },
      { text: "Quero provar minha força e coragem para todos.", scores:{natlan:3, inazuma:1} },
    ],
  },
  {
    text: "Que tipo de paisagem mais combina com você?",
    options: [
      { text: "Colinas verdes, moinhos de vento e céu aberto.", scores:{mondstadt:3, sumeru:1} },
      { text: "Portos movimentados e montanhas históricas.", scores:{liyue:3, inazuma:1} },
      { text: "Vulcões ativos e terras vibrantes de tribos guerreiras.", scores:{natlan:3, fontaine:1} },
      { text: "Neve interminável e paisagens imponentes.", scores:{snezhnaya:3, inazuma:1} },
    ],
  },
  {
    text: "Qual estilo de vida mais te atrai?",
    options: [
      { text: "Simples, livre, cercado de arte e boa companhia.", scores:{mondstadt:3, liyue:1} },
      { text: "Estruturado, elegante, guiado por regras claras.", scores:{fontaine:3, inazuma:1} },
      { text: "Intenso, competitivo, sempre testando meus limites.", scores:{natlan:3, snezhnaya:1} },
      { text: "Acadêmico, contemplativo, cercado de livros e descobertas.", scores:{sumeru:3, fontaine:1} },
    ],
  },
  {
    text: "Qual é a sua relação com a comunidade ao seu redor?",
    options: [
      { text: "Prefiro agir sozinho(a), confiando na minha própria força.", scores:{snezhnaya:3, natlan:1} },
      { text: "Valorizo profundamente laços antigos e duradouros.", scores:{liyue:3, inazuma:1} },
      { text: "Gosto de conviver com pessoas livres e despreocupadas.", scores:{mondstadt:3, natlan:1} },
      { text: "Prefiro comunidades voltadas ao estudo e à troca de ideias.", scores:{sumeru:3, fontaine:1} },
    ],
  },
  {
    text: "O que te faz sentir mais corajoso(a)?",
    options: [
      { text: "Enfrentar batalhas e provar meu valor fisicamente.", scores:{natlan:3, inazuma:1} },
      { text: "Desafiar tradições antigas em nome da justiça.", scores:{fontaine:3, mondstadt:1} },
      { text: "Enfrentar o desconhecido sozinho(a), sem medo da distância.", scores:{snezhnaya:3, sumeru:1} },
      { text: "Defender meus valores mesmo sob pressão social.", scores:{liyue:3, inazuma:1} },
    ],
  },
  {
    text: "Como você vê o mundo ao seu redor?",
    options: [
      { text: "Cheio de beleza simples que merece ser apreciada.", scores:{mondstadt:3, liyue:1} },
      { text: "Cheio de mistérios esperando para serem desvendados.", scores:{sumeru:3, snezhnaya:1} },
      { text: "Um lugar onde só os fortes prosperam de verdade.", scores:{natlan:3, snezhnaya:1} },
      { text: "Regido por acordos que precisam ser respeitados.", scores:{liyue:3, fontaine:1} },
    ],
  },
  {
    text: "Se você liderasse um grupo, como seria?",
    options: [
      { text: "Com liberdade total para cada um seguir seu talento.", scores:{mondstadt:3, natlan:1} },
      { text: "Com regras claras e um código de honra bem definido.", scores:{inazuma:3, fontaine:1} },
      { text: "Com base em sabedoria acumulada e experiência.", scores:{liyue:3, sumeru:1} },
      { text: "Com pulso firme, sem espaço para fraquezas.", scores:{snezhnaya:3, natlan:1} },
    ],
  },
  {
    text: "Diante do desconhecido, você:",
    options: [
      { text: "Sente um chamado inevitável para explorar.", scores:{natlan:3, mondstadt:1} },
      { text: "Estuda cuidadosamente antes de se aproximar.", scores:{sumeru:3, fontaine:1} },
      { text: "Trata com cautela e respeito pelas tradições locais.", scores:{liyue:3, inazuma:1} },
      { text: "Encara com frieza e determinação, sem hesitar.", scores:{snezhnaya:3, inazuma:1} },
    ],
  },
  {
    text: "Para encerrar: qual frase você escolheria para viver?",
    options: [
      { text: "\u201CLiberdade é o único caminho verdadeiro.\u201D", scores:{mondstadt:3, natlan:1} },
      { text: "\u201CTradição e contrato sustentam tudo que importa.\u201D", scores:{liyue:3, inazuma:1} },
      { text: "\u201CO conhecimento é a chave para qualquer porta.\u201D", scores:{sumeru:3, fontaine:1} },
      { text: "\u201CSó a força e a vontade resistem ao tempo.\u201D", scores:{snezhnaya:3, natlan:1} },
    ],
  },
];

const REGION_PAIMON_COMMENTS = [
  "Hmm, Paimon já consegue imaginar você lá!",
  "Interessante escolha... Paimon está com um palpite!",
  "Ohh, isso soa muito a uma das Sete Nações!",
  "Paimon nunca tinha pensado nisso dessa forma!",
  "Só mais um pouco... o mapa está se revelando!",
];

const AppRegionQuiz = (function(){
  const state = {
    currentQuestion: 0,
    scores: {},
    answering: false,
    resultRegion: null,
    imageGenerated: false,
  };
  let generatedDataUrl = null;
  let lastPaimonQuestionIndex = -3;
  let els = {};

  function init(){
    els = {
      introDialogue: document.getElementById("region-intro-dialogue-text"),
      questionText: document.getElementById("region-question-text"),
      cardsGrid: document.getElementById("region-cards-grid"),
      questionPanel: document.getElementById("region-question-panel"),
      progressFill: document.getElementById("region-progress-fill"),
      progressLabel: document.getElementById("region-progress-label"),
      paimonBubble: document.getElementById("region-paimon-bubble"),
      resultCard: document.getElementById("region-result-card"),
      previewWrap: document.getElementById("region-preview-wrap"),
      previewImg: document.getElementById("region-preview-img"),
      previewDownloadLink: document.getElementById("region-preview-download-link"),
    };

    document.getElementById("btn-region-quiz-start").addEventListener("click", start);
    document.getElementById("btn-region-generate").addEventListener("click", onGenerateClick);
    document.getElementById("btn-region-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-region-share").addEventListener("click", onShareClick);
    document.getElementById("btn-region-save-gallery").addEventListener("click", onSaveGalleryClick);
    document.getElementById("btn-region-restart").addEventListener("click", () => AppRouter.go("region-quiz-intro"));
  }

  function enterIntro(){
    if (els.introDialogue){
      els.introDialogue.textContent = `Vamos descobrir qual nação de Teyvat combina com o seu jeito de ser, ${PLAYER_PROFILE.name}! São ${REGION_QUESTIONS.length} perguntas rápidas.`;
    }
  }

  function start(){
    state.currentQuestion = 0;
    state.scores = Object.fromEntries(REGION_KEYS.map(k => [k, 0]));
    state.imageGenerated = false;
    generatedDataUrl = null;
    AppRouter.go("region-quiz");
    renderQuestion(true);
  }

  function renderQuestion(isFirst){
    const q = REGION_QUESTIONS[state.currentQuestion];
    state.answering = false;

    els.progressLabel.textContent = `Pergunta ${state.currentQuestion + 1} de ${REGION_QUESTIONS.length}`;
    els.progressFill.style.width = `${(state.currentQuestion / REGION_QUESTIONS.length) * 100}%`;
    els.questionText.textContent = q.text;

    els.cardsGrid.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const card = document.createElement("button");
      card.className = "answer-card answer-card-enter";
      card.type = "button";
      card.style.animationDelay = `${idx * 70}ms`;
      card.innerHTML = `<span class="card-icon">✦</span><span>${opt.text}</span>`;
      card.addEventListener("click", () => selectAnswer(card, opt));
      els.cardsGrid.appendChild(card);
    });

    els.questionPanel.classList.remove("q-exit");
    if (!isFirst){
      els.questionPanel.classList.add("q-enter");
      setTimeout(() => els.questionPanel.classList.remove("q-enter"), 600);
    }

    maybeShowPaimonComment();
  }

  function selectAnswer(cardEl, option){
    if (state.answering) return;
    state.answering = true;
    AppAudio.playSfx("click");

    Object.entries(option.scores).forEach(([key, pts]) => {
      state.scores[key] = (state.scores[key] || 0) + pts;
    });

    cardEl.classList.add("selected");
    const burst = document.createElement("span");
    burst.className = "spark-burst";
    cardEl.appendChild(burst);

    Array.from(els.cardsGrid.children).forEach(c => {
      if (c !== cardEl) c.classList.add("dim");
    });
    setTimeout(() => {
      Array.from(els.cardsGrid.children).forEach(c => {
        if (c !== cardEl) c.classList.add("fade-out");
      });
    }, 250);

    setTimeout(() => els.questionPanel.classList.add("q-exit"), 550);
    setTimeout(() => advanceQuestion(), 950);
  }

  function advanceQuestion(){
    state.currentQuestion++;
    if (state.currentQuestion >= REGION_QUESTIONS.length){
      els.progressFill.style.width = "100%";
      setTimeout(runRevealSequence, 400);
      return;
    }
    renderQuestion(false);
  }

  function maybeShowPaimonComment(){
    els.paimonBubble.classList.remove("show");
    const gapOk = (state.currentQuestion - lastPaimonQuestionIndex) >= 2;
    const roll = Math.random();
    let message = null;

    if (state.currentQuestion === REGION_QUESTIONS.length - 2){
      message = `Só mais duas perguntas, ${PLAYER_PROFILE.name}!`;
    } else if (gapOk && roll < 0.4 && state.currentQuestion > 0){
      message = REGION_PAIMON_COMMENTS[Math.floor(Math.random() * REGION_PAIMON_COMMENTS.length)];
    }

    if (message){
      lastPaimonQuestionIndex = state.currentQuestion;
      setTimeout(() => {
        els.paimonBubble.textContent = message;
        els.paimonBubble.classList.add("show");
        setTimeout(() => els.paimonBubble.classList.remove("show"), 3200);
      }, 500);
    }
  }

  function computeResultRegion(){
    let best = REGION_KEYS[0];
    let bestScore = -Infinity;
    REGION_TIEBREAK_ORDER.forEach(k => {
      if (state.scores[k] > bestScore){
        bestScore = state.scores[k];
        best = k;
      }
    });
    return best;
  }

  function runRevealSequence(){
    AppRouter.go("region-reveal");
    state.resultRegion = computeResultRegion();

    const line1 = document.getElementById("region-reveal-line-1");
    const line2 = document.getElementById("region-reveal-line-2");
    const line3 = document.getElementById("region-reveal-line-3");
    const orbit = document.getElementById("region-reveal-orbit");

    [line1, line2, line3].forEach(l => l.classList.remove("show"));
    line2.textContent = "";
    orbit.innerHTML = "";

    const orbitEls = REGION_KEYS.map((key, i) => {
      const data = REGIONS[key];
      const el = document.createElement("div");
      el.className = "orbit-symbol";
      el.style.animationDelay = `-${i * 0.7}s`;
      el.dataset.key = key;
      const img = document.createElement("img");
      img.src = data.image;
      img.alt = data.name;
      img.onerror = () => el.classList.add("vision-fallback");
      el.appendChild(img);
      orbit.appendChild(el);
      return el;
    });

    setTimeout(() => line1.classList.add("show"), 200);

    setTimeout(() => {
      const losers = orbitEls.filter(el => el.dataset.key !== state.resultRegion);
      losers.forEach((el, i) => setTimeout(() => el.classList.add("fading"), i * 220));
      const winnerEl = orbitEls.find(el => el.dataset.key === state.resultRegion);
      setTimeout(() => {
        const elData = ELEMENTS[REGIONS[state.resultRegion].element];
        winnerEl.classList.add("winner");
        winnerEl.style.setProperty("--el-glow", elData.glow);
        winnerEl.style.borderColor = elData.secondary;
      }, losers.length * 220 + 300);
    }, 1600);

    setTimeout(() => {
      line2.textContent = `${PLAYER_PROFILE.name}, o mapa de Teyvat encontrou seu lugar.`;
      line2.classList.add("show");
    }, 3600);

    setTimeout(() => line3.classList.add("show"), 5000);

    setTimeout(() => {
      renderResult(state.resultRegion);
      AppRouter.go("region-result");
      AppAudio.playSfx("vision");
    }, 6600);
  }

  function renderResult(regionKey){
    const data = REGIONS[regionKey];
    const elData = ELEMENTS[data.element];
    document.getElementById("region-result-card").style.setProperty("--el-secondary", elData.secondary);
    document.getElementById("region-result-card").style.setProperty("--el-glow", elData.glow);

    document.getElementById("region-result-player-name").textContent = PLAYER_PROFILE.name;
    document.getElementById("region-result-kicker").textContent = data.kicker;
    document.getElementById("region-result-name").textContent = data.name;
    document.getElementById("region-result-desc").textContent = data.desc;
    document.getElementById("region-result-quote").textContent = data.quote;

    const bannerWrap = document.getElementById("region-banner-wrap");
    const bannerImg = document.getElementById("region-banner-img");
    bannerWrap.classList.remove("img-fallback");
    bannerImg.src = data.image;
    bannerImg.alt = data.name;

    const traitsList = document.getElementById("region-traits-list");
    traitsList.innerHTML = "";
    data.traits.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      traitsList.appendChild(li);
    });

    spawnParticles(elData);

    state.imageGenerated = false;
    els.previewWrap.classList.remove("show");

    PLAYER_PROFILE.region = data.name;
    PLAYER_PROFILE.stats.quizzesDone++;
    saveProfile();
    markActivityCompleted("region-quiz");
    AppAchievements.unlock("lugar-para-chamar-de-lar");
    AppNotify.toast("Região adicionada ao perfil.");
  }

  function spawnParticles(elData){
    const layer = document.getElementById("region-result-bg-effects");
    layer.innerHTML = "";
    const glyphs = ["✦", "●", "◆"];
    for (let i = 0; i < 22; i++){
      const p = document.createElement("span");
      p.className = "el-particle";
      p.style.left = Math.random() * 100 + "vw";
      p.style.bottom = "-5vh";
      p.style.fontSize = (10 + Math.random() * 14) + "px";
      p.style.color = elData.secondary;
      p.style.opacity = "0";
      p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
      p.style.animationDuration = (6 + Math.random() * 8) + "s";
      p.style.animationDelay = (Math.random() * 6) + "s";
      layer.appendChild(p);
    }
  }

  function getFileName(){
    return `regiao-genshin-${AppShare.slugify(PLAYER_PROFILE.name)}-${state.resultRegion}.png`;
  }

  async function ensureGenerated(){
    if (!state.imageGenerated){
      generatedDataUrl = await AppShare.generateCardImage(els.resultCard);
      state.imageGenerated = true;
      els.previewImg.src = generatedDataUrl;
      if (els.previewDownloadLink){
        els.previewDownloadLink.href = generatedDataUrl;
        els.previewDownloadLink.download = getFileName();
      }
    }
  }

  async function onGenerateClick(){
    const btn = document.getElementById("btn-region-generate");
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Gerando...";
    try{
      await ensureGenerated();
      els.previewWrap.classList.add("show");
      AppNotify.toast("Imagem gerada!");
    } catch(err){
      AppNotify.toast("Não foi possível gerar a imagem agora.");
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  async function onDownloadClick(){
    try{
      await ensureGenerated();
      els.previewWrap.classList.add("show");
      AppShare.downloadImage(generatedDataUrl, getFileName());
      AppNotify.toast("Download iniciado!");
    } catch(err){
      AppNotify.toast("Não foi possível baixar a imagem.");
    }
  }

  async function onShareClick(){
    const data = REGIONS[state.resultRegion];
    await ensureGenerated();
    els.previewWrap.classList.add("show");
    els.previewWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Onde em Teyvat você deveria viver?",
      `Descobri que meu lugar em Teyvat seria ${data.name}! Qual seria o seu?`
    );
  }

  function onSaveGalleryClick(){
    AppGallery.saveRegionResult(state.resultRegion, PLAYER_PROFILE.name);
  }

  return { init, enterIntro, start };
})();
