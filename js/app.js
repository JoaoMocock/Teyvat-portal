/* =========================================================
   app.js — núcleo do Portal (roteamento SPA, Home, Perfil,
   modais, onboarding). Carregado por último: todos os outros
   módulos (data, profile, notifications, audio, share,
   achievements, gallery, quizzes) já existem quando este roda.
   ========================================================= */

/* ------------------- ROTEADOR ------------------- */
const AppRouter = (function(){
  let currentSoonActivity = null;

  function showScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`screen-${id}`);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function go(routeKey, payload){
    if (typeof updateBottomNavActive === "function") updateBottomNavActive(routeKey);
    switch(routeKey){
      case "home":
        renderHome();
        showScreen("home");
        break;
      case "soon":
        currentSoonActivity = payload;
        renderSoon(payload);
        showScreen("soon");
        break;
      case "quiz-intro":
        AppQuiz.enterIntro();
        showScreen("quiz-intro");
        break;
      case "character-quiz-intro":
        AppCharacterQuiz.enterIntro();
        showScreen("character-quiz-intro");
        break;
      case "region-quiz-intro":
        AppRegionQuiz.enterIntro();
        showScreen("region-quiz-intro");
        break;
      case "creator-intro":
        AppCreator.enterIntro();
        showScreen("creator-intro");
        break;
      case "creator-form":
        AppCreator.enterForm();
        showScreen("creator-form");
        break;
      case "vision-generator-intro":
        AppVisionGenerator.enterIntro();
        showScreen("vision-generator-intro");
        break;
      case "vision-generator-form":
        AppVisionGenerator.enterForm();
        showScreen("vision-generator-form");
        break;
      case "wish-intro":
        showScreen("wish-intro");
        break;
      case "wish-banner":
        showScreen("wish-banner");
        break;
      case "compat-intro":
        showScreen("compat-intro");
        break;
      case "compat-form":
        AppCompat.enterForm();
        showScreen("compat-form");
        break;
      case "encyclopedia":
        AppEncyclopedia.enter();
        showScreen("encyclopedia");
        break;
      case "map":
        AppMap.enter();
        showScreen("map");
        break;
      case "profile":
        renderProfile();
        showScreen("profile");
        break;
      case "achievements":
        AppAchievements.renderAchievementsScreen();
        showScreen("achievements");
        break;
      case "gallery":
        AppGallery.renderGalleryScreen();
        showScreen("gallery");
        break;
      default:
        showScreen(routeKey);
    }
  }

  return { go, showScreen };
})();

/* ------------------- STARFIELD ------------------- */
(function starfield(){
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.3 + .2,
      speed: Math.random()*.15 + .02,
      phase: Math.random()*Math.PI*2,
    }));
  }
  function tick(t){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#f2d38f";
    stars.forEach(s => {
      const twinkle = .5 + Math.sin(t/900 + s.phase) * .5;
      ctx.globalAlpha = twinkle * .8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) s.y = canvas.height + 5;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();

/* ------------------- CURSOR GLOW ------------------- */
(function cursorGlow(){
  const glow = document.getElementById("cursor-glow");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches){
    window.addEventListener("mousemove", e => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      glow.classList.add("active");
    });
    window.addEventListener("mouseleave", () => glow.classList.remove("active"));
  }
})();

/* ------------------- MUTE TOGGLE E BOTÃO DE ATIVAR MÚSICA ------------------- */
const muteToggleBtn = document.getElementById("mute-toggle");
const musicStartBtn = document.getElementById("music-start-btn");

function updateMuteButtonUI(){
  if (!muteToggleBtn) return;
  const muted = AppAudio.isMusicMuted();
  muteToggleBtn.classList.toggle("is-muted", muted);
  muteToggleBtn.setAttribute("aria-pressed", String(muted));
  muteToggleBtn.setAttribute("aria-label", muted ? "Ativar a música de fundo" : "Desativar a música de fundo");
  if (musicStartBtn){
    musicStartBtn.classList.toggle("is-playing", AppAudio.isMusicPlaying() && !muted);
  }
}
if (muteToggleBtn){
  updateMuteButtonUI();
  muteToggleBtn.addEventListener("click", () => {
    const nowMuted = AppAudio.toggleMusicMuted();
    if (!nowMuted) AppAudio.startMusic(); // garante que o áudio realmente comece a tocar
    updateMuteButtonUI();
  });
}
if (musicStartBtn){
  musicStartBtn.addEventListener("click", () => {
    AppAudio.setMusicMuted(false);
    AppAudio.startMusic();
    updateMuteButtonUI();
    AppNotify.toast("Música ativada!");
  });
}

/* ------------------- TELA DE CARREGAMENTO ------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loading-text");
  if (loadingText){
    loadingText.textContent = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
  }

  // Cada módulo é inicializado com segurança: se algum falhar por algum motivo,
  // isso fica só no console, e o Portal continua carregando normalmente em vez
  // de travar para sempre na tela de "Explorando Teyvat...".
  const modules = [
    ["AppQuiz", typeof AppQuiz !== "undefined" && AppQuiz],
    ["AppCharacterQuiz", typeof AppCharacterQuiz !== "undefined" && AppCharacterQuiz],
    ["AppRegionQuiz", typeof AppRegionQuiz !== "undefined" && AppRegionQuiz],
    ["AppCreator", typeof AppCreator !== "undefined" && AppCreator],
    ["AppVisionGenerator", typeof AppVisionGenerator !== "undefined" && AppVisionGenerator],
    ["AppWish", typeof AppWish !== "undefined" && AppWish],
    ["AppCompat", typeof AppCompat !== "undefined" && AppCompat],
    ["AppEncyclopedia", typeof AppEncyclopedia !== "undefined" && AppEncyclopedia],
    ["AppMap", typeof AppMap !== "undefined" && AppMap],
  ];
  modules.forEach(([name, mod]) => {
    try{
      if (mod && typeof mod.init === "function") mod.init();
      else console.warn(`${name} não foi encontrado — verifique se o arquivo js correspondente foi carregado.`);
    } catch(err){
      console.warn(`Falha ao iniciar ${name}:`, err);
    }
  });

  try{ wireModals(); } catch(err){ console.warn("Falha ao preparar os modais:", err); }
  try{ wireProfileActions(); } catch(err){ console.warn("Falha ao preparar o Perfil:", err); }
  try{ wireQuickRoutes(); } catch(err){ console.warn("Falha ao preparar as ações rápidas:", err); }
  try{ wireBottomNav(); } catch(err){ console.warn("Falha ao preparar a navegação inferior:", err); }

  // A transição para a Home SEMPRE acontece, mesmo que algo acima tenha falhado.
  setTimeout(() => {
    try{ AppRouter.go("home"); }
    catch(err){
      console.error("Falha ao abrir o Portal:", err);
      AppRouter.showScreen("home"); // ao menos tira da tela de carregamento
    }
  }, 1800);
});

/* ------------------- HOME / PORTAL ------------------- */
const nameInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const nameForm = document.getElementById("name-form");
const nameError = document.getElementById("name-error");

nameInput.addEventListener("input", () => {
  const valid = nameInput.value.trim().length > 0;
  startBtn.disabled = !valid;
  if (valid) nameError.classList.remove("show");
});

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name){
    nameError.classList.add("show");
    return;
  }
  PLAYER_PROFILE.name = sanitizeText(name);
  saveProfile();
  AppAudio.startMusic();
  renderHome();
});

function sanitizeText(raw){
  const div = document.createElement("div");
  div.textContent = raw;
  return div.innerHTML.slice(0, 20);
}

function avatarSrc(){
  const key = PLAYER_PROFILE.avatar;
  return key ? `assets/characters/${key}.png` : "assets/characters/paimon.png";
}

function progressMessage(){
  if (PLAYER_PROFILE.completedActivities.length === 0) return "Uma nova jornada começa.";
  if (PLAYER_PROFILE.characterAffinity) return "Um novo companheiro cruzou seu caminho.";
  if (PLAYER_PROFILE.region) return "Você encontrou seu lugar em Teyvat.";
  if (PLAYER_PROFILE.element) return "Uma Visão despertou.";
  return "Sua jornada em Teyvat continua.";
}

function renderHome(){
  const hasName = !!PLAYER_PROFILE.name;
  document.getElementById("home-onboarding").style.display = hasName ? "none" : "flex";
  document.getElementById("home-portal").style.display = hasName ? "flex" : "none";
  if (!hasName) return;

  document.getElementById("portal-player-name").textContent = PLAYER_PROFILE.name;
  document.getElementById("portal-progress-message").textContent = progressMessage();

  const avatarWrap = document.getElementById("portal-avatar-wrap");
  avatarWrap.classList.remove("img-fallback");
  document.getElementById("portal-avatar-img").src = avatarSrc();

  const bottomAvatarImg = document.getElementById("bottom-nav-avatar-img");
  if (bottomAvatarImg) bottomAvatarImg.src = avatarSrc();

  const paimonLines = [
    `Qual será nossa próxima aventura, ${PLAYER_PROFILE.name}?`,
    "Paimon está pronta quando você estiver!",
    "Tem tanta coisa em Teyvat para descobrir ainda...",
  ];
  document.getElementById("portal-paimon-text").textContent =
    paimonLines[Math.floor(Math.random() * paimonLines.length)];

  renderActivityGrid();
  renderContinueJourneyButton();
  renderHomeProgress();
  renderHomeProfileSummary();
}

function renderHomeProgress(){
  const pct = explorationPercent();
  const percentEl = document.getElementById("home-progress-percent");
  const barEl = document.getElementById("home-progress-bar");
  const textEl = document.getElementById("home-progress-text");
  if (!percentEl) return;

  percentEl.textContent = `${pct}%`;
  barEl.style.width = `${pct}%`;

  const doneCount = PLAYER_PROFILE.completedActivities.length;
  const total = ACTIVITIES.filter(a => !["profile","achievements","gallery"].includes(a.route)).length;

  if (pct >= 100){
    textEl.textContent = "Você explorou todos os caminhos deste Portal.";
  } else if (PLAYER_PROFILE.characterAffinity){
    textEl.textContent = "Um novo companheiro cruzou seu caminho. Continue explorando Teyvat.";
  } else if (PLAYER_PROFILE.region){
    textEl.textContent = "Você já encontrou seu lugar em Teyvat. Que tal descobrir seu companheiro de jornada?";
  } else if (PLAYER_PROFILE.element){
    textEl.textContent = "Você já despertou sua Visão. Agora descubra qual região de Teyvat combina com você.";
  } else {
    textEl.textContent = "Sua jornada em Teyvat está apenas começando.";
  }
  document.getElementById("home-progress-label").textContent = `Continue sua jornada (${doneCount} de ${total} descobertas)`;
}

function renderHomeProfileSummary(){
  const p = PLAYER_PROFILE;
  const nameEl = document.getElementById("home-profile-name");
  if (!nameEl) return;

  nameEl.textContent = p.name;
  document.getElementById("home-profile-element").textContent = p.element ? ELEMENTS[p.element].name : "???";
  document.getElementById("home-profile-region").textContent = p.region || "???";
  document.getElementById("home-profile-affinity").textContent = p.characterAffinity || "???";

  const pct = explorationPercent();
  document.getElementById("home-profile-percent").textContent = `${pct}%`;
  document.getElementById("home-profile-bar").style.width = `${pct}%`;
}

function renderActivityGrid(){
  const grid = document.getElementById("activity-grid");
  grid.innerHTML = "";
  ACTIVITIES.forEach(activity => {
    const done = PLAYER_PROFILE.completedActivities.includes(activity.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "activity-card" + (activity.status === "soon" ? " is-soon" : "") + (done ? " is-done" : "");
    card.innerHTML = `
      ${done ? '<span class="activity-badge activity-badge-done">Concluída</span>' : ""}
      ${activity.status === "soon" ? '<span class="activity-badge activity-badge-soon">Em breve</span>' : ""}
      <h3>${activity.title}</h3>
      <p>${activity.blurb}</p>
    `;
    card.addEventListener("click", () => {
      AppAudio.startMusic();
      AppAudio.playSfx("click");
      if (activity.status === "soon"){
        AppRouter.go("soon", activity);
      } else {
        AppRouter.go(activity.route);
      }
    });
    grid.appendChild(card);
  });
}

function renderContinueJourneyButton(){
  const btn = document.getElementById("btn-continue-journey");
  const mainJourneys = ACTIVITIES.filter(a =>
    a.status === "available" && !["profile", "achievements", "gallery"].includes(a.route)
  );
  const next = mainJourneys.find(a => !PLAYER_PROFILE.completedActivities.includes(a.id));

  if (next){
    btn.textContent = `Continuar Jornada: ${next.title}`;
    btn.disabled = false;
    btn.onclick = () => { AppAudio.startMusic(); AppRouter.go(next.route); };
  } else {
    const upcoming = ACTIVITIES.find(a => a.status === "soon");
    btn.textContent = upcoming ? `Em breve: ${upcoming.title}` : "Todas as jornadas disponíveis concluídas";
    btn.disabled = !upcoming;
    btn.onclick = upcoming ? () => { AppAudio.startMusic(); AppRouter.go("soon", upcoming); } : null;
  }
}

/* ------------------- TELA "EM BREVE" ------------------- */
function renderSoon(activity){
  document.getElementById("soon-title").textContent = activity.title;
  document.getElementById("soon-blurb").textContent = activity.blurb;
}

/* ------------------- BOTÕES "VOLTAR AO PORTAL" ------------------- */
document.querySelectorAll(".back-to-portal").forEach(btn => {
  btn.addEventListener("click", () => AppRouter.go(btn.dataset.route));
});

/* ------------------- PERFIL DO VIAJANTE ------------------- */
function explorationPercent(){
  const total = ACTIVITIES.filter(a => !["profile","achievements","gallery"].includes(a.route)).length;
  const done = PLAYER_PROFILE.completedActivities.length;
  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
}

function renderProfile(){
  const p = PLAYER_PROFILE;
  document.getElementById("profile-name").textContent = p.name || "Viajante";
  document.getElementById("profile-player-title").textContent = p.title || "Viajante de Teyvat";

  const avatarWrap = document.getElementById("profile-avatar-wrap");
  avatarWrap.classList.remove("img-fallback");
  document.getElementById("profile-avatar-img").src = avatarSrc();

  document.getElementById("profile-field-element").textContent = p.element ? ELEMENTS[p.element].name : "???";
  document.getElementById("profile-field-region").textContent = p.region || "???";
  document.getElementById("profile-field-weapon").textContent = p.weapon || "???";
  document.getElementById("profile-field-affinity").textContent = p.characterAffinity || "???";
  document.getElementById("profile-field-achievements").textContent = p.achievements.length;
  document.getElementById("profile-field-journeys").textContent = p.stats.journeysCompleted;

  const pct = explorationPercent();
  document.getElementById("profile-exploration-percent").textContent = `${pct}%`;
  document.getElementById("profile-exploration-bar").style.width = `${pct}%`;

  document.getElementById("stat-quizzes").textContent = p.stats.quizzesDone;
  document.getElementById("stat-cards").textContent = p.stats.cardsGenerated;
  document.getElementById("stat-wishes").textContent = p.stats.wishesDone;
  document.getElementById("stat-characters").textContent = p.stats.charactersCreated;

  // aplica a cor do elemento no card do perfil, se já tiver uma Visão
  const card = document.getElementById("profile-card");
  if (p.element){
    const data = ELEMENTS[p.element];
    card.style.setProperty("--el-secondary", data.secondary);
    card.style.setProperty("--el-glow", data.glow);
    card.classList.add("has-element");
  } else {
    card.classList.remove("has-element");
  }

  document.getElementById("profile-preview-wrap").classList.remove("show");
}

function wireProfileActions(){
  document.getElementById("btn-change-avatar").addEventListener("click", openAvatarModal);
  document.getElementById("btn-edit-name").addEventListener("click", openEditNameModal);
  document.getElementById("btn-open-reset").addEventListener("click", () => openModal("modal-reset"));
  document.getElementById("btn-confirm-reset").addEventListener("click", () => {
    resetProfile();
    closeModal("modal-reset");
    AppRouter.go("home");
  });

  document.getElementById("btn-generate-profile-card").addEventListener("click", async () => {
    const btn = document.getElementById("btn-generate-profile-card");
    btn.disabled = true;
    try{
      const dataUrl = await AppShare.generateCardImage(document.getElementById("profile-card"));
      const img = document.getElementById("profile-preview-img");
      img.src = dataUrl;
      const link = document.getElementById("profile-preview-download-link");
      link.href = dataUrl;
      link.download = `card-viajante-${AppShare.slugify(PLAYER_PROFILE.name)}.png`;
      document.getElementById("profile-preview-wrap").classList.add("show");
      AppNotify.toast("Imagem gerada!");
    } catch(err){
      AppNotify.toast("Não foi possível gerar o card agora.");
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("btn-download-profile-card").addEventListener("click", async () => {
    try{
      const dataUrl = await AppShare.generateCardImage(document.getElementById("profile-card"));
      const filename = `card-viajante-${AppShare.slugify(PLAYER_PROFILE.name)}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    } catch(err){
      AppNotify.toast("Não foi possível baixar o card agora.");
    }
  });

  document.getElementById("btn-share-profile-card").addEventListener("click", async () => {
    try{
      const dataUrl = await AppShare.generateCardImage(document.getElementById("profile-card"));
      const filename = `card-viajante-${AppShare.slugify(PLAYER_PROFILE.name)}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Meu Perfil no Portal de Teyvat",
        `Meu card de viajante em Teyvat! Confira o seu também.`
      );
    } catch(err){
      AppNotify.toast("Não foi possível compartilhar agora.");
    }
  });
}

/* ------------------- MODAIS ------------------- */
function openModal(id){ document.getElementById(id).classList.add("show"); }
function closeModal(id){ document.getElementById(id).classList.remove("show"); }

function wireModals(){
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("show");
    });
  });

  document.getElementById("edit-name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("edit-name-input");
    const val = input.value.trim();
    if (!val) return;
    PLAYER_PROFILE.name = sanitizeText(val);
    saveProfile();
    closeModal("modal-edit-name");
    renderProfile();
    AppNotify.toast("Nome atualizado!");
  });
}

function openEditNameModal(){
  document.getElementById("edit-name-input").value = PLAYER_PROFILE.name;
  openModal("modal-edit-name");
}

function openAvatarModal(){
  const grid = document.getElementById("avatar-grid");
  grid.innerHTML = "";
  const options = ELEMENT_KEYS.map(k => ({ key: ELEMENTS[k].character, name: ELEMENTS[k].characterName }));

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "avatar-option" + (PLAYER_PROFILE.avatar === opt.key ? " selected" : "");
    btn.innerHTML = `<img src="assets/characters/${opt.key}.png" alt="${opt.name}" onerror="this.style.display='none'"><span>${opt.name}</span>`;
    btn.addEventListener("click", () => {
      PLAYER_PROFILE.avatar = opt.key;
      saveProfile();
      closeModal("modal-avatar");
      renderHome();
      renderProfile();
      AppNotify.toast("Avatar atualizado!");
    });
    grid.appendChild(btn);
  });
}

/* ------------------- AÇÕES RÁPIDAS (avatar clicável + cards com data-route) ------------------- */
function wireQuickRoutes(){
  document.querySelectorAll("[data-route]:not(.back-to-portal)").forEach(btn => {
    btn.addEventListener("click", () => {
      AppAudio.startMusic();
      AppAudio.playSfx("click");
      AppRouter.go(btn.dataset.route);
    });
  });
}

/* ------------------- NAVEGAÇÃO INFERIOR (MOBILE) ------------------- */
// Agrupa cada rota da SPA sob uma das cinco áreas da barra inferior,
// para destacar a área correta conforme a tela atual.
const BOTTOM_NAV_GROUPS = {
  home: ["home"],
  jornadas: [
    "quiz-intro", "quiz", "reveal", "result",
    "character-quiz-intro", "character-quiz", "character-reveal", "character-result",
    "region-quiz-intro", "region-quiz", "region-reveal", "region-result",
    "creator-intro", "creator-form", "creator-result",
    "vision-generator-intro", "vision-generator-form", "vision-generator-result",
  ],
  explorar: [
    "wish-intro", "wish-banner", "wish-reveal",
    "compat-intro", "compat-form", "compat-result",
    "encyclopedia", "map", "soon",
  ],
  achievements: ["achievements"],
  profile: ["profile"],
};

function updateBottomNavActive(routeKey){
  const items = document.querySelectorAll(".bottom-nav-item");
  if (!items.length) return;
  let activeGroup = null;
  for (const [group, routes] of Object.entries(BOTTOM_NAV_GROUPS)){
    if (routes.includes(routeKey)){ activeGroup = group; break; }
  }
  items.forEach(item => item.classList.toggle("active", item.dataset.nav === activeGroup));
}

function wireBottomNav(){
  document.querySelectorAll(".bottom-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      AppAudio.startMusic();
      AppAudio.playSfx("click");
      const key = btn.dataset.nav;
      if (key === "explorar"){
        openModal("modal-explore-menu");
        return;
      }
      if (key === "jornadas"){
        AppRouter.go("home");
        setTimeout(() => {
          const grid = document.querySelector(".quick-actions-grid");
          if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
        return;
      }
      AppRouter.go(key);
    });
  });
}
