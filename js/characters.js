/* =========================================================
   characters.js — Quiz "Qual personagem combina comigo?"
   Segue exatamente a mesma arquitetura do Quiz Elemental
   (quizzes.js): perguntas, pontuação, Paimon, revelação
   cinematográfica, resultado, PNG e compartilhamento.
   ========================================================= */

const CHARACTER_QUESTIONS = [
  {
    text: "Como as pessoas descrevem sua personalidade?",
    options: [
      { text: "Calmo(a) e observador(a), como quem já viu de tudo.", scores:{zhongli:3, xiao:1} },
      { text: "Elegante e comedido(a), mas com um lado surpreendentemente caloroso.", scores:{ayaka:3, navia:1} },
      { text: "Espontâneo(a) e cheio(a) de energia, sempre pronto(a) para uma novidade.", scores:{klee:3, venti:1} },
      { text: "Misterioso(a) e difícil de decifrar completamente.", scores:{yaemiko:3, wanderer:1} },
    ],
  },
  {
    text: "Como você se comporta em um grupo grande?",
    options: [
      { text: "Fico observando de longe, mas ajo se for realmente necessário.", scores:{xiao:3, alhaitham:1} },
      { text: "Assumo naturalmente a liderança da conversa.", scores:{raiden:3, navia:1} },
      { text: "Sou o centro das atenções, adoro um bom show.", scores:{hutao:3, furina:1} },
      { text: "Prefiro conversar com poucas pessoas de confiança.", scores:{nahida:3, zhongli:1} },
    ],
  },
  {
    text: "O que você valoriza mais em si mesmo(a)?",
    options: [
      { text: "Minha lealdade e senso de dever com quem confio.", scores:{ayaka:3, xiao:1} },
      { text: "Minha liberdade de pensar e agir do meu próprio jeito.", scores:{venti:3, kazuha:1} },
      { text: "Minha lógica e capacidade de enxergar a verdade das coisas.", scores:{alhaitham:3, neuvillette:1} },
      { text: "Minha capacidade de proteger quem eu amo, custe o que custar.", scores:{arlecchino:3, zhongli:1} },
    ],
  },
  {
    text: "Em um projeto em grupo, qual é o seu papel natural?",
    options: [
      { text: "O(a) estrategista que planeja tudo nos bastidores.", scores:{yaemiko:3, wanderer:1} },
      { text: "O(a) líder que toma as decisões finais.", scores:{raiden:3, navia:1} },
      { text: "A pessoa que resolve os conflitos com justiça.", scores:{zhongli:3, neuvillette:1} },
      { text: "Quem sugere as ideias mais originais.", scores:{nahida:3, kazuha:1} },
    ],
  },
  {
    text: "O que você mais oferece a um amigo?",
    options: [
      { text: "Um ombro tranquilo e um bom conselho ponderado.", scores:{zhongli:3, nahida:1} },
      { text: "Proteção incondicional, mesmo em silêncio.", scores:{xiao:3, arlecchino:1} },
      { text: "Boas risadas e momentos inesquecíveis.", scores:{hutao:3, klee:1} },
      { text: "Companhia para conversas profundas sobre a vida.", scores:{kazuha:3, furina:1} },
    ],
  },
  {
    text: "Qual seria seu maior objetivo de vida?",
    options: [
      { text: "Alcançar um ideal de perfeição e eternidade.", scores:{raiden:3, ayaka:1} },
      { text: "Descobrir toda a verdade sobre o mundo.", scores:{alhaitham:3, nahida:1} },
      { text: "Viver intensamente cada momento, sem arrependimentos.", scores:{hutao:3, klee:1} },
      { text: "Construir algo que proteja as próximas gerações.", scores:{navia:3, zhongli:1} },
    ],
  },
  {
    text: "Como você lida com uma grande responsabilidade?",
    options: [
      { text: "Assumo com seriedade, mesmo que pese sobre mim em silêncio.", scores:{xiao:3, raiden:1} },
      { text: "Encaro com calma, já vi coisas assim antes.", scores:{zhongli:3, neuvillette:1} },
      { text: "Divido com quem confio e sigo em frente com leveza.", scores:{venti:3, kazuha:1} },
      { text: "Assumo o controle e cuido de cada detalhe pessoalmente.", scores:{arlecchino:3, navia:1} },
    ],
  },
  {
    text: "Qual é o seu tipo de humor?",
    options: [
      { text: "Sarcástico e ácido, sem papas na língua.", scores:{wanderer:3, alhaitham:1} },
      { text: "Brincalhão e um pouco travesso.", scores:{yaemiko:3, hutao:1} },
      { text: "Inocente e sincero, rio das coisas simples.", scores:{klee:3, venti:1} },
      { text: "Sutil e teatral, gosto de um bom efeito dramático.", scores:{furina:3, hutao:1} },
    ],
  },
  {
    text: "O que liberdade significa para você?",
    options: [
      { text: "Não responder a ninguém além de mim mesmo(a).", scores:{wanderer:3, xiao:1} },
      { text: "Poder viajar e ver o mundo sem amarras.", scores:{venti:3, kazuha:1} },
      { text: "Ter a mente livre para pensar sem julgamentos.", scores:{alhaitham:3, nahida:1} },
      { text: "Poder escolher por quem eu luto e me protejo.", scores:{arlecchino:3, ayaka:1} },
    ],
  },
  {
    text: "Como você resolve um problema complexo?",
    options: [
      { text: "Analiso cada detalhe com lógica fria.", scores:{alhaitham:3, neuvillette:1} },
      { text: "Busco entender as emoções envolvidas primeiro.", scores:{nahida:3, furina:1} },
      { text: "Confio na experiência e no que já vivi.", scores:{zhongli:3, raiden:1} },
      { text: "Uso um pouco de intuição e um pouco de manha.", scores:{yaemiko:3, hutao:1} },
    ],
  },
  {
    text: "O que te faz agir com coragem?",
    options: [
      { text: "Proteger quem eu amo, sem pensar duas vezes.", scores:{xiao:3, ayaka:1} },
      { text: "Defender minhas convicções, mesmo sozinho(a).", scores:{wanderer:3, arlecchino:1} },
      { text: "Enfrentar o desconhecido só para ver o que há além.", scores:{kazuha:3, venti:1} },
      { text: "Fazer o que é certo, mesmo contra a tradição.", scores:{navia:3, nahida:1} },
    ],
  },
  {
    text: "Diante de um problema urgente, você:",
    options: [
      { text: "Age imediatamente, sem esperar ordens de ninguém.", scores:{klee:3, hutao:1} },
      { text: "Pausa, analisa, e só então decide com precisão.", scores:{alhaitham:3, zhongli:1} },
      { text: "Busca orientação de quem tem mais experiência.", scores:{ayaka:3, nahida:1} },
      { text: "Assume o comando e resolve à sua própria maneira.", scores:{raiden:3, arlecchino:1} },
    ],
  },
  {
    text: "Como você trata pessoas que acabou de conhecer?",
    options: [
      { text: "Com cortesia formal, mantendo distância no início.", scores:{neuvillette:3, ayaka:1} },
      { text: "Com curiosidade genuína — adoro conhecer gente nova.", scores:{klee:3, nahida:1} },
      { text: "Com desconfiança, até que provem que merecem minha atenção.", scores:{wanderer:3, xiao:1} },
      { text: "Com charme — sei como conquistar qualquer plateia.", scores:{furina:3, yaemiko:1} },
    ],
  },
  {
    text: "Sobre justiça, você acredita que:",
    options: [
      { text: "As regras existem para manter a ordem e devem ser respeitadas.", scores:{neuvillette:3, zhongli:1} },
      { text: "A justiça verdadeira às vezes exige quebrar as regras.", scores:{navia:3, wanderer:1} },
      { text: "Cada um deve responder pelas próprias escolhas e contratos.", scores:{zhongli:3, arlecchino:1} },
      { text: "O que importa é o resultado, não o caminho até ele.", scores:{alhaitham:3, raiden:1} },
    ],
  },
  {
    text: "O que mais te motiva no dia a dia?",
    options: [
      { text: "A busca por conhecimento e novas descobertas.", scores:{nahida:3, alhaitham:1} },
      { text: "A companhia de quem você ama.", scores:{hutao:3, kazuha:1} },
      { text: "A liberdade de fazer o que quiser, quando quiser.", scores:{venti:3, klee:1} },
      { text: "A responsabilidade de liderar e proteger os outros.", scores:{navia:3, raiden:1} },
    ],
  },
  {
    text: "Como você encara o seu passado?",
    options: [
      { text: "Ele me define, e eu carrego seu peso com honra.", scores:{xiao:3, raiden:1} },
      { text: "Prefiro deixá-lo para trás e seguir em frente.", scores:{wanderer:3, kazuha:1} },
      { text: "Uso-o como uma lição valiosa para o presente.", scores:{zhongli:3, neuvillette:1} },
      { text: "Não penso muito nisso — vivo o agora.", scores:{klee:3, hutao:1} },
    ],
  },
  {
    text: "Como você demonstra que se importa com alguém?",
    options: [
      { text: "Com pequenos gestos silenciosos e constantes.", scores:{xiao:3, zhongli:1} },
      { text: "Com palavras diretas e sinceras.", scores:{alhaitham:3, navia:1} },
      { text: "Com brincadeiras e provocações carinhosas.", scores:{yaemiko:3, hutao:1} },
      { text: "Com grandes gestos dramáticos e memoráveis.", scores:{furina:3, klee:1} },
    ],
  },
  {
    text: "Para encerrar: se pudesse escolher um destino, qual seria?",
    options: [
      { text: "Viajar o mundo, livre de qualquer caminho traçado.", scores:{venti:3, kazuha:1} },
      { text: "Governar com sabedoria e justiça.", scores:{raiden:3, navia:1} },
      { text: "Descobrir cada segredo que o universo esconde.", scores:{nahida:3, alhaitham:1} },
      { text: "Viver cada dia intensamente, sem medo do amanhã.", scores:{hutao:3, klee:1} },
    ],
  },
];

const CHARACTER_PAIMON_COMMENTS = [
  "Hmm, Paimon está anotando isso com muita atenção!",
  "Interessante... Paimon já tem um palpite!",
  "Ohh, essa resposta combina com alguém que Paimon conhece!",
  "Paimon nunca imaginou que você diria isso!",
  "Só mais um pouco... o destino está se revelando!",
];

const AppCharacterQuiz = (function(){
  const state = {
    currentQuestion: 0,
    scores: {},
    answering: false,
    resultCharacter: null,
    imageGenerated: false,
  };
  let generatedDataUrl = null;
  let lastPaimonQuestionIndex = -3;
  let els = {};

  function init(){
    els = {
      introDialogue: document.getElementById("character-intro-dialogue-text"),
      questionText: document.getElementById("character-question-text"),
      cardsGrid: document.getElementById("character-cards-grid"),
      questionPanel: document.getElementById("character-question-panel"),
      progressFill: document.getElementById("character-progress-fill"),
      progressLabel: document.getElementById("character-progress-label"),
      paimonBubble: document.getElementById("character-paimon-bubble"),
      resultCard: document.getElementById("character-result-card"),
      previewWrap: document.getElementById("character-preview-wrap"),
      previewImg: document.getElementById("character-preview-img"),
      previewDownloadLink: document.getElementById("character-preview-download-link"),
    };

    document.getElementById("btn-character-quiz-start").addEventListener("click", start);
    document.getElementById("btn-character-generate").addEventListener("click", onGenerateClick);
    document.getElementById("btn-character-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-character-share").addEventListener("click", onShareClick);
    document.getElementById("btn-character-save-gallery").addEventListener("click", onSaveGalleryClick);
    document.getElementById("btn-character-restart").addEventListener("click", () => AppRouter.go("character-quiz-intro"));
  }

  function enterIntro(){
    if (els.introDialogue){
      els.introDialogue.textContent = `Vamos descobrir qual habitante de Teyvat combina mais com você, ${PLAYER_PROFILE.name}! São ${CHARACTER_QUESTIONS.length} perguntas — responda com sinceridade!`;
    }
  }

  function start(){
    state.currentQuestion = 0;
    state.scores = Object.fromEntries(CHARACTER_KEYS.map(k => [k, 0]));
    state.imageGenerated = false;
    generatedDataUrl = null;
    AppRouter.go("character-quiz");
    renderQuestion(true);
  }

  function renderQuestion(isFirst){
    const q = CHARACTER_QUESTIONS[state.currentQuestion];
    state.answering = false;

    els.progressLabel.textContent = `Pergunta ${state.currentQuestion + 1} de ${CHARACTER_QUESTIONS.length}`;
    els.progressFill.style.width = `${(state.currentQuestion / CHARACTER_QUESTIONS.length) * 100}%`;
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
    if (state.currentQuestion >= CHARACTER_QUESTIONS.length){
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

    if (state.currentQuestion === CHARACTER_QUESTIONS.length - 2){
      message = `Só mais duas perguntas, ${PLAYER_PROFILE.name}!`;
    } else if (gapOk && roll < 0.4 && state.currentQuestion > 0){
      message = CHARACTER_PAIMON_COMMENTS[Math.floor(Math.random() * CHARACTER_PAIMON_COMMENTS.length)];
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

  function computeResultCharacter(){
    let best = CHARACTER_KEYS[0];
    let bestScore = -Infinity;
    CHARACTER_TIEBREAK_ORDER.forEach(k => {
      if (state.scores[k] > bestScore){
        bestScore = state.scores[k];
        best = k;
      }
    });
    return best;
  }

  function runRevealSequence(){
    AppRouter.go("character-reveal");
    state.resultCharacter = computeResultCharacter();

    const line1 = document.getElementById("character-reveal-line-1");
    const line2 = document.getElementById("character-reveal-line-2");
    const line3 = document.getElementById("character-reveal-line-3");
    const orbit = document.getElementById("character-reveal-orbit");

    [line1, line2, line3].forEach(l => l.classList.remove("show"));
    line2.textContent = "";
    orbit.innerHTML = "";
    orbit.classList.add("orbit-wide");

    const orbitEls = CHARACTER_KEYS.map((key, i) => {
      const data = CHARACTERS[key];
      const el = document.createElement("div");
      el.className = "orbit-symbol small";
      el.style.setProperty("--orbit-radius", "165px");
      el.style.animationDelay = `-${i * 0.35}s`;
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
      const losers = orbitEls.filter(el => el.dataset.key !== state.resultCharacter);
      losers.forEach((el, i) => setTimeout(() => el.classList.add("fading"), i * 90));
      const winnerEl = orbitEls.find(el => el.dataset.key === state.resultCharacter);
      setTimeout(() => {
        const elData = ELEMENTS[CHARACTERS[state.resultCharacter].element];
        winnerEl.classList.add("winner");
        winnerEl.style.setProperty("--el-glow", elData.glow);
        winnerEl.style.borderColor = elData.secondary;
      }, losers.length * 90 + 300);
    }, 1600);

    setTimeout(() => {
      line2.textContent = `${PLAYER_PROFILE.name}, os destinos se entrelaçaram.`;
      line2.classList.add("show");
    }, 3400);

    setTimeout(() => line3.classList.add("show"), 4700);

    setTimeout(() => {
      renderResult(state.resultCharacter);
      AppRouter.go("character-result");
      AppAudio.playSfx("vision");
    }, 6200);
  }

  function renderResult(characterKey){
    const data = CHARACTERS[characterKey];
    const elData = ELEMENTS[data.element];
    document.getElementById("character-result-card").style.setProperty("--el-secondary", elData.secondary);
    document.getElementById("character-result-card").style.setProperty("--el-glow", elData.glow);

    document.getElementById("character-result-player-name").textContent = PLAYER_PROFILE.name;
    document.getElementById("character-result-kicker").textContent = data.title;
    document.getElementById("character-result-name").textContent = data.name;
    document.getElementById("character-result-meta").textContent = `${elData.name} · ${data.region}`;
    document.getElementById("character-result-desc").textContent = data.desc;
    document.getElementById("character-result-quote").textContent = data.quote;

    const portraitWrap = document.getElementById("character-result-portrait-wrap");
    const portraitImg = document.getElementById("character-result-portrait-img");
    portraitWrap.classList.remove("vision-fallback");
    portraitImg.src = data.image;
    portraitImg.alt = data.name;

    const traitsList = document.getElementById("character-traits-list");
    traitsList.innerHTML = "";
    data.traits.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      traitsList.appendChild(li);
    });

    spawnParticles(elData);

    state.imageGenerated = false;
    els.previewWrap.classList.remove("show");

    PLAYER_PROFILE.characterAffinity = data.name;
    PLAYER_PROFILE.stats.quizzesDone++;
    saveProfile();
    markActivityCompleted("character-quiz");
    AppAchievements.unlock("destinos-entrelacados");
    AppNotify.toast("Afinidade adicionada ao perfil.");
  }

  function spawnParticles(elData){
    const layer = document.getElementById("character-result-bg-effects");
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
    return `personagem-genshin-${AppShare.slugify(PLAYER_PROFILE.name)}-${state.resultCharacter}.png`;
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
    const btn = document.getElementById("btn-character-generate");
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
    const data = CHARACTERS[state.resultCharacter];
    await ensureGenerated();
    els.previewWrap.classList.add("show");
    els.previewWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Qual personagem de Genshin combina com você?",
      `Descobri que meu personagem compatível em Teyvat é ${data.name}! Qual seria o seu?`
    );
  }

  function onSaveGalleryClick(){
    AppGallery.saveCharacterResult(state.resultCharacter, PLAYER_PROFILE.name);
  }

  return { init, enterIntro, start };
})();
