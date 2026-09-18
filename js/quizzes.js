/* =========================================================
   quizzes.js — Quiz Elemental ("Descobrir minha Visão")
   Toda a lógica original preservada (20 perguntas, pontuação,
   Paimon, transições, revelação, resultado, geração de PNG e
   compartilhamento), agora integrada ao Portal e ao perfil.
   ========================================================= */

const QUESTIONS = [
  {
    text: "Como você costuma enfrentar um problema difícil?",
    options: [
      { text: "Ataco de frente, sem hesitar.", icon:"🔥", scores:{pyro:2} },
      { text: "Analiso com calma antes de agir.", icon:"🌿", scores:{dendro:2} },
      { text: "Peço ajuda e escuto outras opiniões.", icon:"💧", scores:{hydro:2} },
      { text: "Improviso uma solução criativa na hora.", icon:"🍃", scores:{anemo:2} },
    ],
  },
  {
    text: "Uma mudança inesperada acontece no seu dia. Qual é sua reação?",
    options: [
      { text: "Encaro como uma nova aventura.", icon:"🍃", scores:{anemo:2} },
      { text: "Fico incomodado, mas me adapto aos poucos.", icon:"❄️", scores:{cryo:2} },
      { text: "Já reorganizo tudo com um novo plano.", icon:"⛰️", scores:{geo:2} },
      { text: "Sinto animação e curiosidade imediata.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "O que você mais valoriza em uma amizade?",
    options: [
      { text: "Lealdade acima de tudo.", icon:"🔥", scores:{pyro:2} },
      { text: "Compreensão e apoio emocional.", icon:"💧", scores:{hydro:2} },
      { text: "Confiança que resiste ao tempo.", icon:"⛰️", scores:{geo:2} },
      { text: "Trocas de ideias e boas conversas.", icon:"🌿", scores:{dendro:2} },
    ],
  },
  {
    text: "Você presencia uma injustiça. O que faz?",
    options: [
      { text: "Confronto na hora, sem medo das consequências.", icon:"🔥", scores:{pyro:2, electro:1} },
      { text: "Busco a forma mais justa e equilibrada de resolver.", icon:"⛰️", scores:{geo:2} },
      { text: "Ajo com estratégia, no momento certo.", icon:"❄️", scores:{cryo:2} },
      { text: "Tento entender todos os lados primeiro.", icon:"💧", scores:{hydro:2} },
    ],
  },
  {
    text: "Como você toma decisões importantes?",
    options: [
      { text: "Confio no instinto e sigo em frente.", icon:"🔥", scores:{pyro:2} },
      { text: "Penso em todas as possibilidades com calma.", icon:"🌿", scores:{dendro:2} },
      { text: "Peso os prós e contras com método.", icon:"⛰️", scores:{geo:2} },
      { text: "Decido rápido e ajusto o rumo depois.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "Você prefere estabilidade ou aventura?",
    options: [
      { text: "Aventura, sempre. A rotina me sufoca.", icon:"🍃", scores:{anemo:2} },
      { text: "Estabilidade. Gosto de construir algo sólido.", icon:"⛰️", scores:{geo:2} },
      { text: "Um pouco dos dois, dependendo do momento.", icon:"💧", scores:{hydro:1} },
      { text: "Aventura, desde que eu esteja no controle.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "O que mais te motiva a seguir em frente?",
    options: [
      { text: "Provar do que sou capaz.", icon:"🔥", scores:{pyro:2} },
      { text: "Ajudar quem está ao meu redor.", icon:"💧", scores:{hydro:2} },
      { text: "Aprender algo novo todos os dias.", icon:"🌿", scores:{dendro:2} },
      { text: "Deixar minha marca e mudar as coisas.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "Como você reage quando algo dá muito errado?",
    options: [
      { text: "Frustração imediata, mas reajo rápido.", icon:"🔥", scores:{pyro:2} },
      { text: "Fico quieto e processo tudo internamente.", icon:"❄️", scores:{cryo:2} },
      { text: "Busco apoio de alguém de confiança.", icon:"💧", scores:{hydro:2} },
      { text: "Já penso em como reconstruir com calma.", icon:"⛰️", scores:{geo:2} },
    ],
  },
  {
    text: "Você prefere liderar ou observar?",
    options: [
      { text: "Liderar. Gosto de tomar a frente.", icon:"🔥", scores:{pyro:1, electro:2} },
      { text: "Observar primeiro, agir depois.", icon:"🌿", scores:{dendro:2} },
      { text: "Prefiro liderar pelo exemplo, em silêncio.", icon:"⛰️", scores:{geo:2} },
      { text: "Depende do grupo e da situação.", icon:"🍃", scores:{anemo:1, hydro:1} },
    ],
  },
  {
    text: "Qual tipo de ambiente combina mais com você?",
    options: [
      { text: "Lugares agitados, cheios de energia.", icon:"⚡", scores:{electro:2} },
      { text: "Espaços abertos e naturais.", icon:"🌿", scores:{dendro:2} },
      { text: "Um cantinho tranquilo e silencioso.", icon:"❄️", scores:{cryo:2} },
      { text: "Qualquer lugar novo que eu ainda não conheça.", icon:"🍃", scores:{anemo:2} },
    ],
  },
  {
    text: "Como você lida com críticas?",
    options: [
      { text: "Levo para o lado pessoal, mas uso como combustível.", icon:"🔥", scores:{pyro:2} },
      { text: "Analiso com racionalidade antes de reagir.", icon:"⛰️", scores:{geo:2} },
      { text: "Absorvo tudo em silêncio e reflito depois.", icon:"❄️", scores:{cryo:2} },
      { text: "Pergunto mais para entender o ponto de vista.", icon:"🌿", scores:{dendro:2} },
    ],
  },
  {
    text: "O que você faria num dia totalmente livre, sem compromissos?",
    options: [
      { text: "Sairia para explorar algum lugar novo.", icon:"🍃", scores:{anemo:2} },
      { text: "Passaria tempo com pessoas queridas.", icon:"💧", scores:{hydro:2} },
      { text: "Organizaria e cuidaria de projetos pessoais.", icon:"⛰️", scores:{geo:2} },
      { text: "Aprenderia algo novo ou leria bastante.", icon:"🌿", scores:{dendro:2} },
    ],
  },
  {
    text: "Como as pessoas costumam te descrever?",
    options: [
      { text: "Intenso(a) e apaixonado(a).", icon:"🔥", scores:{pyro:2} },
      { text: "Gentil e compreensivo(a).", icon:"💧", scores:{hydro:2} },
      { text: "Confiável e firme.", icon:"⛰️", scores:{geo:2} },
      { text: "Imprevisível e cheio(a) de ideias.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "Diante de um conflito entre amigos, você:",
    options: [
      { text: "Tenta mediar com calma e imparcialidade.", icon:"💧", scores:{hydro:2} },
      { text: "Fala a verdade sem rodeios, mesmo que doa.", icon:"❄️", scores:{cryo:2} },
      { text: "Busca uma solução prática e justa.", icon:"⛰️", scores:{geo:2} },
      { text: "Prefere manter distância até tudo se acalmar.", icon:"🍃", scores:{anemo:1, cryo:1} },
    ],
  },
  {
    text: "O que representa mais o seu jeito de amar ou se importar com alguém?",
    options: [
      { text: "Proteger com intensidade e dedicação total.", icon:"🔥", scores:{pyro:2} },
      { text: "Cuidar nos pequenos detalhes, todos os dias.", icon:"💧", scores:{hydro:2} },
      { text: "Estar presente, mesmo sem dizer muito.", icon:"⛰️", scores:{geo:2} },
      { text: "Incentivar a pessoa a crescer e se libertar.", icon:"🍃", scores:{anemo:2} },
    ],
  },
  {
    text: "Você recebe uma proposta arriscada, mas promissora. O que faz?",
    options: [
      { text: "Aceito na hora, sem pensar duas vezes.", icon:"🔥", scores:{pyro:2} },
      { text: "Calculo os riscos com atenção antes de decidir.", icon:"🌿", scores:{dendro:2} },
      { text: "Aceito, mas com um plano B pronto.", icon:"⛰️", scores:{geo:2} },
      { text: "Aceito porque adoro o imprevisível.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "Como você recarrega suas energias?",
    options: [
      { text: "Praticando algo fisicamente intenso.", icon:"🔥", scores:{pyro:2} },
      { text: "Em silêncio, sozinho(a), sem pressa.", icon:"❄️", scores:{cryo:2} },
      { text: "Conversando com quem eu gosto.", icon:"💧", scores:{hydro:2} },
      { text: "Explorando algo novo e diferente.", icon:"🍃", scores:{anemo:2} },
    ],
  },
  {
    text: "O que mais te incomoda no comportamento de outras pessoas?",
    options: [
      { text: "Falta de compromisso e desonestidade.", icon:"⛰️", scores:{geo:2} },
      { text: "Indiferença com os sentimentos alheios.", icon:"💧", scores:{hydro:2} },
      { text: "Falta de iniciativa e acomodação.", icon:"⚡", scores:{electro:2} },
      { text: "Excesso de rigidez e falta de flexibilidade.", icon:"🍃", scores:{anemo:2} },
    ],
  },
  {
    text: "Se você tivesse que escolher uma missão para cumprir, seria:",
    options: [
      { text: "Proteger os mais fracos, custe o que custar.", icon:"🔥", scores:{pyro:2} },
      { text: "Espalhar conhecimento e sabedoria pelo mundo.", icon:"🌿", scores:{dendro:2} },
      { text: "Trazer equilíbrio e paz onde houver conflito.", icon:"💧", scores:{hydro:2} },
      { text: "Quebrar tradições que já não fazem sentido.", icon:"⚡", scores:{electro:2} },
    ],
  },
  {
    text: "Por fim: qual frase mais combina com você?",
    options: [
      { text: "\u201CEu prefiro arder intensamente a apagar devagar.\u201D", icon:"🔥", scores:{pyro:2} },
      { text: "\u201CA verdadeira força mora na calma.\u201D", icon:"❄️", scores:{cryo:2} },
      { text: "\u201CNão existe muro que o vento não contorne.\u201D", icon:"🍃", scores:{anemo:2} },
      { text: "\u201CComo a montanha, eu sustento quem precisa.\u201D", icon:"⛰️", scores:{geo:2} },
    ],
  },
];

const PAIMON_COMMENTS = [
  "Hmm... interessante!",
  "Paimon está começando a descobrir sua Visão!",
  "Essa escolha diz bastante sobre você!",
  "Uhh, Paimon não esperava essa resposta!",
  "Paimon está anotando tudo isso...",
  "Curioso... muito curioso mesmo!",
];

const AppQuiz = (function(){
  const state = {
    currentQuestion: 0,
    scores: {},
    answering: false,
    resultElement: null,
    imageGenerated: false,
  };
  let generatedDataUrl = null;
  let lastPaimonQuestionIndex = -3;

  let els = {}; // cache de elementos DOM, preenchido em init()

  function init(){
    els = {
      introDialogue: document.getElementById("quiz-intro-dialogue-text"),
      questionText: document.getElementById("question-text"),
      cardsGrid: document.getElementById("cards-grid"),
      questionPanel: document.getElementById("question-panel"),
      progressFill: document.getElementById("progress-fill"),
      progressLabel: document.getElementById("quiz-progress-label"),
      paimonBubble: document.getElementById("paimon-bubble"),
      resultCard: document.getElementById("result-card"),
      previewWrap: document.getElementById("preview-wrap"),
      previewImg: document.getElementById("preview-img"),
      previewDownloadLink: document.getElementById("preview-download-link"),
    };

    document.getElementById("btn-quiz-start").addEventListener("click", start);
    document.getElementById("btn-generate").addEventListener("click", onGenerateClick);
    document.getElementById("btn-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-share").addEventListener("click", onShareClick);
    document.getElementById("btn-save-gallery").addEventListener("click", onSaveGalleryClick);
    document.getElementById("btn-restart").addEventListener("click", () => AppRouter.go("quiz-intro"));
  }

  function enterIntro(){
    if (els.introDialogue){
      els.introDialogue.textContent = `Ei, ${PLAYER_PROFILE.name}! Paimon preparou 20 perguntas para descobrir qual elemento combina mais com você!`;
    }
  }

  function start(){
    state.currentQuestion = 0;
    state.scores = Object.fromEntries(ELEMENT_KEYS.map(k => [k, 0]));
    state.imageGenerated = false;
    generatedDataUrl = null;
    AppRouter.go("quiz");
    renderQuestion(true);
  }

  function renderQuestion(isFirst){
    const q = QUESTIONS[state.currentQuestion];
    state.answering = false;

    els.progressLabel.textContent = `Pergunta ${state.currentQuestion + 1} de ${QUESTIONS.length}`;
    els.progressFill.style.width = `${(state.currentQuestion / QUESTIONS.length) * 100}%`;
    els.questionText.textContent = q.text;

    els.cardsGrid.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const card = document.createElement("button");
      card.className = "answer-card answer-card-enter";
      card.type = "button";
      card.style.animationDelay = `${idx * 70}ms`;
      card.innerHTML = `<span class="card-icon">${opt.icon || "✦"}</span><span>${opt.text}</span>`;
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

    Object.entries(option.scores).forEach(([el, pts]) => {
      state.scores[el] = (state.scores[el] || 0) + pts;
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
    if (state.currentQuestion >= QUESTIONS.length){
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

    if (state.currentQuestion === QUESTIONS.length - 2){
      message = `Estamos quase lá, ${PLAYER_PROFILE.name}!`;
    } else if (gapOk && roll < 0.42 && state.currentQuestion > 0){
      message = PAIMON_COMMENTS[Math.floor(Math.random() * PAIMON_COMMENTS.length)];
      if (Math.random() < 0.3){
        message = `Hmm, ${PLAYER_PROFILE.name}... escolha interessante!`;
      }
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

  function computeResultElement(){
    let best = ELEMENT_KEYS[0];
    let bestScore = -Infinity;
    const priority = ["pyro","hydro","anemo","electro","dendro","cryo","geo"];
    priority.forEach(k => {
      if (state.scores[k] > bestScore){
        bestScore = state.scores[k];
        best = k;
      }
    });
    return best;
  }

  function runRevealSequence(){
    AppRouter.go("reveal");
    state.resultElement = computeResultElement();

    const line1 = document.getElementById("reveal-line-1");
    const line2 = document.getElementById("reveal-line-2");
    const line3 = document.getElementById("reveal-line-3");
    const orbit = document.getElementById("reveal-orbit");

    [line1, line2, line3].forEach(l => l.classList.remove("show"));
    line2.textContent = "";
    orbit.innerHTML = "";

    const orbitEls = ELEMENT_KEYS.map((key, i) => {
      const data = ELEMENTS[key];
      const el = document.createElement("div");
      el.className = "orbit-symbol";
      el.style.animationDelay = `-${i * 0.7}s`;
      el.dataset.key = key;
      const img = document.createElement("img");
      img.src = data.vision;
      img.alt = data.name;
      img.onerror = () => el.classList.add("vision-fallback");
      el.appendChild(img);
      orbit.appendChild(el);
      return el;
    });

    setTimeout(() => line1.classList.add("show"), 200);

    setTimeout(() => {
      const losers = orbitEls.filter(el => el.dataset.key !== state.resultElement);
      losers.forEach((el, i) => setTimeout(() => el.classList.add("fading"), i * 220));
      const winnerEl = orbitEls.find(el => el.dataset.key === state.resultElement);
      setTimeout(() => {
        winnerEl.classList.add("winner");
        winnerEl.style.setProperty("--el-glow", ELEMENTS[state.resultElement].glow);
        winnerEl.style.borderColor = ELEMENTS[state.resultElement].secondary;
      }, losers.length * 220 + 300);
    }, 1600);

    setTimeout(() => {
      line2.textContent = `${PLAYER_PROFILE.name}, uma Visão escolheu você.`;
      line2.classList.add("show");
    }, 3600);

    setTimeout(() => line3.classList.add("show"), 5000);

    setTimeout(() => {
      renderResult(state.resultElement);
      AppRouter.go("result");
      AppAudio.playSfx("vision");
    }, 6600);
  }

  function renderResult(elementKey){
    const data = ELEMENTS[elementKey];
    document.body.style.setProperty("--el-primary", data.primary);
    document.body.style.setProperty("--el-secondary", data.secondary);
    document.body.style.setProperty("--el-glow", data.glow);

    document.getElementById("result-player-name").textContent = PLAYER_PROFILE.name;
    document.getElementById("result-kicker").textContent = data.kicker;
    document.getElementById("result-element-name").textContent = data.name;
    document.getElementById("result-desc").textContent = data.desc;
    document.getElementById("result-quote").textContent = data.quote;

    const visionWrap = document.getElementById("result-symbol-wrap");
    const visionImg = document.getElementById("result-vision-img");
    visionWrap.classList.remove("vision-fallback");
    visionImg.src = data.vision;
    visionImg.alt = `Visão de ${data.name}`;
    spawnVisionParticles(elementKey);

    const traitsList = document.getElementById("traits-list");
    traitsList.innerHTML = "";
    data.traits.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      traitsList.appendChild(li);
    });

    const charImg = document.getElementById("result-char-img");
    charImg.parentElement.classList.remove("img-fallback");
    charImg.src = `assets/characters/${data.character}.png`;
    charImg.alt = data.characterName;
    document.getElementById("result-affinity-name").textContent = data.characterName;

    spawnElementParticles(elementKey);

    state.imageGenerated = false;
    els.previewWrap.classList.remove("show");

    // ---- Integração com o Portal ----
    PLAYER_PROFILE.element = elementKey;
    PLAYER_PROFILE.stats.quizzesDone++;
    saveProfile();
    markActivityCompleted("elemental-quiz");
    AppAchievements.unlock("primeira-visao");
    AppNotify.toast("Visão adicionada ao perfil.");
  }

  function spawnElementParticles(elementKey){
    const layer = document.getElementById("result-bg-effects");
    layer.innerHTML = "";
    const data = ELEMENTS[elementKey];
    const glyphs = ["✦", "●", "◆"];
    for (let i = 0; i < 26; i++){
      const p = document.createElement("span");
      p.className = "el-particle";
      p.style.left = Math.random() * 100 + "vw";
      p.style.bottom = "-5vh";
      p.style.fontSize = (10 + Math.random() * 14) + "px";
      p.style.color = data.secondary;
      p.style.opacity = "0";
      p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
      p.style.animationDuration = (6 + Math.random() * 8) + "s";
      p.style.animationDelay = (Math.random() * 6) + "s";
      layer.appendChild(p);
    }
  }

  function spawnVisionParticles(elementKey){
    const layer = document.getElementById("vision-particles");
    layer.innerHTML = "";
    const data = ELEMENTS[elementKey];
    for (let i = 0; i < 8; i++){
      const dot = document.createElement("span");
      const size = 3 + Math.random() * 4;
      const radius = 62 + Math.random() * 40;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.top = "50%";
      dot.style.left = "50%";
      dot.style.marginTop = -(size/2) + "px";
      dot.style.marginLeft = -(size/2) + "px";
      dot.style.background = data.secondary;
      dot.style.setProperty("--r", radius + "px");
      dot.style.animationDuration = (3.2 + Math.random() * 2.4) + "s";
      dot.style.animationDelay = -(Math.random() * 4) + "s";
      layer.appendChild(dot);
    }
  }

  function getFileName(){
    return `resultado-genshin-${AppShare.slugify(PLAYER_PROFILE.name)}-${state.resultElement}.png`;
  }

  async function onGenerateClick(){
    const btn = document.getElementById("btn-generate");
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Gerando...";
    try{
      generatedDataUrl = await AppShare.generateCardImage(els.resultCard);
      state.imageGenerated = true;
      els.previewImg.src = generatedDataUrl;
      if (els.previewDownloadLink){
        els.previewDownloadLink.href = generatedDataUrl;
        els.previewDownloadLink.download = getFileName();
      }
      els.previewWrap.classList.add("show");
      AppNotify.toast("Imagem gerada!");
    } catch(err){
      AppNotify.toast("Não foi possível gerar a imagem agora.");
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
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
    const data = ELEMENTS[state.resultElement];
    await ensureGenerated();
    els.previewWrap.classList.add("show");
    els.previewWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Qual é o seu Elemento em Teyvat?",
      `Minha Visão em Genshin Impact é ${data.name}! Qual seria a sua?`
    );
  }

  function onSaveGalleryClick(){
    AppGallery.saveElementalResult(state.resultElement, PLAYER_PROFILE.name);
  }

  return { init, enterIntro, start };
})();
