/* =========================================================
   creator.js — "Crie seu Personagem de Genshin"
   Diferente dos quizzes: não há pontuação, é uma ferramenta de
   criação livre. Segue a mesma arquitetura de tela/roteamento e
   o mesmo sistema de geração/compartilhamento de PNG.
   ========================================================= */

const AppCreator = (function(){
  const state = {
    name: "",
    element: "anemo",
    weapon: WEAPONS[0],
    region: "mondstadt",
    rarity: 4,
    role: ROLES[0],
    personality: "",
    constellation: "",
    phrase: "",
    uploadedImageDataUrl: null,
  };
  let generatedDataUrl = null;
  let imageGenerated = false;
  let els = {};

  function init(){
    els = {
      introDialogue: document.getElementById("creator-intro-dialogue-text"),
      nameInput: document.getElementById("creator-name-input"),
      nameError: document.getElementById("creator-name-error"),
      personalityInput: document.getElementById("creator-personality-input"),
      constellationInput: document.getElementById("creator-constellation-input"),
      phraseInput: document.getElementById("creator-phrase-input"),
      imageUpload: document.getElementById("creator-image-upload"),
      imagePreviewWrap: document.getElementById("creator-image-preview-wrap"),
      imagePreview: document.getElementById("creator-image-preview"),
      resultCard: document.getElementById("creator-result-card"),
      previewWrap: document.getElementById("creator-preview-wrap"),
      previewImg: document.getElementById("creator-preview-img"),
      previewDownloadLink: document.getElementById("creator-preview-download-link"),
    };

    renderChipGroup("creator-element-group",
      ELEMENT_KEYS.map(k => ({ value: k, label: ELEMENTS[k].name, color: ELEMENTS[k].secondary })),
      () => state.element, (v) => { state.element = v; });

    renderChipGroup("creator-weapon-group",
      WEAPONS.map(w => ({ value: w, label: w })),
      () => state.weapon, (v) => { state.weapon = v; });

    renderChipGroup("creator-region-group",
      REGION_KEYS.map(k => ({ value: k, label: REGIONS[k].name })),
      () => state.region, (v) => { state.region = v; });

    renderChipGroup("creator-rarity-group",
      RARITIES.map(r => ({ value: r, label: `${r}\u2605` })),
      () => state.rarity, (v) => { state.rarity = v; });

    renderChipGroup("creator-role-group",
      ROLES.map(r => ({ value: r, label: r })),
      () => state.role, (v) => { state.role = v; });

    els.nameInput.addEventListener("input", () => {
      state.name = els.nameInput.value;
      if (state.name.trim()) els.nameError.classList.remove("show");
    });
    els.personalityInput.addEventListener("input", () => { state.personality = els.personalityInput.value; });
    els.constellationInput.addEventListener("input", () => { state.constellation = els.constellationInput.value; });
    els.phraseInput.addEventListener("input", () => { state.phrase = els.phraseInput.value; });

    els.imageUpload.addEventListener("change", onImageUpload);

    document.getElementById("btn-creator-start").addEventListener("click", () => AppRouter.go("creator-form"));
    document.getElementById("btn-creator-randomize").addEventListener("click", randomize);
    document.getElementById("btn-creator-generate-card").addEventListener("click", onGenerateCard);
    document.getElementById("btn-creator-generate").addEventListener("click", onGenerateImageClick);
    document.getElementById("btn-creator-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-creator-share").addEventListener("click", onShareClick);
    document.getElementById("btn-creator-save-gallery").addEventListener("click", onSaveGalleryClick);
    document.getElementById("btn-creator-another").addEventListener("click", () => AppRouter.go("creator-form"));
  }

  function enterIntro(){
    if (els.introDialogue){
      els.introDialogue.textContent = `Vamos criar um personagem original juntos, ${PLAYER_PROFILE.name}! Escolha cada detalhe, ou peça para Paimon sortear tudo por você.`;
    }
  }

  function enterForm(){
    // reseta o formulário para uma criação limpa (evita dados residuais da criação anterior)
    state.name = "";
    state.personality = "";
    state.constellation = "";
    state.phrase = "";
    state.uploadedImageDataUrl = null;

    els.nameInput.value = "";
    els.personalityInput.value = "";
    els.constellationInput.value = "";
    els.phraseInput.value = "";
    els.nameError.classList.remove("show");
    els.imageUpload.value = "";
    els.imagePreviewWrap.classList.remove("show");

    document.querySelectorAll(".chip-group").forEach(refreshChipGroupSelection);
  }

  /* ---------- Grupo de botões seletores (chips) ---------- */
  const chipGroups = {}; // id -> { options, getSelected, onSelect }

  function renderChipGroup(containerId, options, getSelected, onSelect){
    const container = document.getElementById(containerId);
    container.classList.add("chip-group");
    chipGroups[containerId] = { options, getSelected, onSelect };
    container.innerHTML = "";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-option";
      btn.textContent = opt.label;
      btn.dataset.value = opt.value;
      if (opt.color) btn.style.setProperty("--chip-color", opt.color);
      btn.addEventListener("click", () => {
        onSelect(opt.value);
        refreshChipGroupSelection(container);
      });
      container.appendChild(btn);
    });
    refreshChipGroupSelection(container);
  }

  function refreshChipGroupSelection(container){
    const id = container.id;
    const group = chipGroups[id];
    if (!group) return;
    const selected = group.getSelected();
    Array.from(container.children).forEach(btn => {
      // compara como string para lidar com raridade numérica
      btn.classList.toggle("selected", String(btn.dataset.value) === String(selected));
    });
  }

  /* ---------- Upload de imagem ---------- */
  function onImageUpload(e){
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)){
      AppNotify.toast("Envie uma imagem em PNG ou JPG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.uploadedImageDataUrl = reader.result;
      els.imagePreview.src = reader.result;
      els.imagePreviewWrap.classList.add("show");
    };
    reader.readAsDataURL(file);
  }

  /* ---------- Sortear para mim ---------- */
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function randomize(){
    state.name = pick(CREATOR_NAME_POOL);
    state.element = pick(ELEMENT_KEYS);
    state.weapon = pick(WEAPONS);
    state.region = pick(REGION_KEYS);
    state.rarity = pick(RARITIES);
    state.role = pick(ROLES);
    state.personality = pick(CREATOR_PERSONALITY_POOL);
    state.constellation = `${pick(CREATOR_CONSTELLATION_PREFIXES)} ${pick(CREATOR_CONSTELLATION_SUFFIXES)}`;
    state.phrase = pick(CREATOR_PHRASE_POOL);

    els.nameInput.value = state.name;
    els.personalityInput.value = state.personality;
    els.constellationInput.value = state.constellation;
    els.phraseInput.value = state.phrase;
    els.nameError.classList.remove("show");

    document.querySelectorAll(".chip-group").forEach(refreshChipGroupSelection);
    AppAudio.playSfx("click");
    AppNotify.toast("Personagem sorteado!");
  }

  /* ---------- Gerar card ---------- */
  function onGenerateCard(){
    const name = state.name.trim();
    if (!name){
      els.nameError.classList.add("show");
      return;
    }
    state.name = sanitizeText(name);

    // preenche detalhes vazios com um sorteio discreto, para o card nunca ficar incompleto
    if (!state.personality.trim()) state.personality = pick(CREATOR_PERSONALITY_POOL);
    if (!state.constellation.trim()) state.constellation = `${pick(CREATOR_CONSTELLATION_PREFIXES)} ${pick(CREATOR_CONSTELLATION_SUFFIXES)}`;
    if (!state.phrase.trim()) state.phrase = pick(CREATOR_PHRASE_POOL);

    renderResultCard();
    AppRouter.go("creator-result");

    PLAYER_PROFILE.stats.charactersCreated++;
    saveProfile();
    markActivityCompleted("character-creator");
    AppAchievements.unlock("artesao-de-teyvat");
    AppNotify.toast("Personagem criado!");
  }

  function renderResultCard(){
    const elData = ELEMENTS[state.element];
    const regionName = REGIONS[state.region].name;

    document.getElementById("creator-result-card").style.setProperty("--el-secondary", elData.secondary);
    document.getElementById("creator-result-card").style.setProperty("--el-glow", elData.glow);

    document.getElementById("creator-result-player-name").textContent = `Criado por ${PLAYER_PROFILE.name}`;
    document.getElementById("creator-result-name").textContent = state.name;
    document.getElementById("creator-result-stars").textContent = "\u2605".repeat(state.rarity);
    document.getElementById("creator-result-meta").textContent =
      `${elData.name} · ${state.weapon} · ${regionName} · ${state.role}`;
    document.getElementById("creator-result-personality").textContent = state.personality;
    document.getElementById("creator-result-quote").textContent = `\u201C${state.phrase}\u201D`;

    const traitsList = document.getElementById("creator-traits-list");
    traitsList.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = `Constelação: ${state.constellation}`;
    traitsList.appendChild(li);

    const visionImg = document.getElementById("creator-vision-img");
    document.getElementById("creator-vision-wrap").classList.remove("vision-fallback");
    visionImg.src = elData.vision;
    visionImg.alt = `Visão de ${elData.name}`;

    const portraitImg = document.getElementById("creator-result-portrait-img");
    portraitImg.parentElement.classList.remove("img-fallback");
    if (state.uploadedImageDataUrl){
      portraitImg.src = state.uploadedImageDataUrl;
      portraitImg.alt = state.name;
    } else {
      portraitImg.removeAttribute("src");
      portraitImg.parentElement.classList.add("img-fallback");
    }

    spawnParticles(elData);
    imageGenerated = false;
    els.previewWrap.classList.remove("show");
  }

  function spawnParticles(elData){
    const layer = document.getElementById("creator-result-bg-effects");
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

  function sanitizeText(raw){
    const div = document.createElement("div");
    div.textContent = raw;
    return div.innerHTML.slice(0, 24);
  }

  function getFileName(){
    return `personagem-criado-${AppShare.slugify(state.name)}.png`;
  }

  async function ensureGenerated(){
    if (!imageGenerated){
      generatedDataUrl = await AppShare.generateCardImage(els.resultCard);
      imageGenerated = true;
      els.previewImg.src = generatedDataUrl;
      if (els.previewDownloadLink){
        els.previewDownloadLink.href = generatedDataUrl;
        els.previewDownloadLink.download = getFileName();
      }
    }
  }

  async function onGenerateImageClick(){
    const btn = document.getElementById("btn-creator-generate");
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
    await ensureGenerated();
    els.previewWrap.classList.add("show");
    els.previewWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Criei meu personagem de Genshin!",
      `Criei ${state.name}, um(a) personagem original de Teyvat! Vem criar o seu também.`
    );
  }

  function onSaveGalleryClick(){
    AppGallery.saveCreationResult({
      name: state.name,
      element: state.element,
      weapon: state.weapon,
      region: state.region,
      rarity: state.rarity,
      role: state.role,
      personality: state.personality,
      constellation: state.constellation,
      phrase: state.phrase,
      playerName: PLAYER_PROFILE.name,
      // a imagem enviada pelo usuário não é salva na Galeria (metadados leves apenas)
    });
  }

  return { init, enterIntro, enterForm };
})();
