/* =========================================================
   compat.js — "Compatibilidade Elemental"
   Comparação divertida entre duas Visões. Sempre apresentado
   claramente como entretenimento, nunca como avaliação real.
   ========================================================= */

const AppCompat = (function(){
  const state = {
    myElement: "anemo",
    companionName: "",
    companionElement: "anemo",
  };
  let currentResult = null;
  let generatedDataUrl = null;
  let imageGenerated = false;
  let els = {};
  const chipGroups = {};

  function init(){
    els = {
      companionInput: document.getElementById("compat-companion-input"),
      companionError: document.getElementById("compat-companion-error"),
      resultCard: document.getElementById("compat-result-card"),
      previewWrap: document.getElementById("compat-preview-wrap"),
      previewImg: document.getElementById("compat-preview-img"),
      previewDownloadLink: document.getElementById("compat-preview-download-link"),
    };

    renderChipGroup("compat-my-element-group",
      ELEMENT_KEYS.map(k => ({ value: k, label: ELEMENTS[k].name, color: ELEMENTS[k].secondary })),
      () => state.myElement, (v) => { state.myElement = v; });

    renderChipGroup("compat-companion-element-group",
      ELEMENT_KEYS.map(k => ({ value: k, label: ELEMENTS[k].name, color: ELEMENTS[k].secondary })),
      () => state.companionElement, (v) => { state.companionElement = v; });

    els.companionInput.addEventListener("input", () => {
      state.companionName = els.companionInput.value;
      if (state.companionName.trim()) els.companionError.classList.remove("show");
    });

    document.getElementById("btn-compat-start").addEventListener("click", () => AppRouter.go("compat-form"));
    document.getElementById("btn-compat-calculate").addEventListener("click", onCalculate);
    document.getElementById("btn-compat-generate").addEventListener("click", onGenerateClick);
    document.getElementById("btn-compat-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-compat-share").addEventListener("click", onShareClick);
    document.getElementById("btn-compat-another").addEventListener("click", () => AppRouter.go("compat-form"));
  }

  function enterForm(){
    // pré-seleciona minha Visão automaticamente, se já tiver sido descoberta
    if (PLAYER_PROFILE.element) state.myElement = PLAYER_PROFILE.element;
    state.companionName = "";
    els.companionInput.value = "";
    els.companionError.classList.remove("show");
    document.querySelectorAll("#screen-compat-form .chip-group").forEach(refreshChipGroupSelection);
  }

  /* ---------- Grupo de botões seletores (chips) ---------- */
  function renderChipGroup(containerId, options, getSelected, onSelect){
    const container = document.getElementById(containerId);
    container.classList.add("chip-group");
    chipGroups[containerId] = { getSelected };
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
    const group = chipGroups[container.id];
    if (!group) return;
    const selected = group.getSelected();
    Array.from(container.children).forEach(btn => {
      btn.classList.toggle("selected", String(btn.dataset.value) === String(selected));
    });
  }

  /* ---------- Cálculo (determinístico, baseado nas reações do jogo) ---------- */
  function getCompatibility(elA, elB){
    const iA = ELEMENT_KEYS.indexOf(elA), iB = ELEMENT_KEYS.indexOf(elB);
    const [first, second] = iA <= iB ? [elA, elB] : [elB, elA];
    return ELEMENT_COMPATIBILITY[`${first}-${second}`];
  }

  function sanitizeText(raw){
    const div = document.createElement("div");
    div.textContent = raw;
    return div.innerHTML.slice(0, 24);
  }

  function onCalculate(){
    const name = state.companionName.trim();
    if (!name){
      els.companionError.classList.add("show");
      return;
    }
    state.companionName = sanitizeText(name);
    currentResult = getCompatibility(state.myElement, state.companionElement);

    renderResultCard();
    AppRouter.go("compat-result");

    markActivityCompleted("compatibility");
    AppAchievements.unlock("alquimia-elemental");
    AppNotify.toast("Compatibilidade calculada!");
  }

  function renderResultCard(){
    const myData = ELEMENTS[state.myElement];
    const compData = ELEMENTS[state.companionElement];

    document.getElementById("compat-result-card").style.setProperty("--el-secondary", myData.secondary);
    document.getElementById("compat-result-card").style.setProperty("--el-glow", myData.glow);

    document.getElementById("compat-my-name").textContent = PLAYER_PROFILE.name;
    document.getElementById("compat-companion-name").textContent = state.companionName;

    const myVisionImg = document.getElementById("compat-my-vision-img");
    document.getElementById("compat-my-vision-wrap").classList.remove("vision-fallback");
    myVisionImg.src = myData.vision;
    myVisionImg.alt = `Visão de ${myData.name}`;
    myVisionImg.parentElement.style.setProperty("--el-glow", myData.glow);

    const compVisionImg = document.getElementById("compat-companion-vision-img");
    document.getElementById("compat-companion-vision-wrap").classList.remove("vision-fallback");
    compVisionImg.src = compData.vision;
    compVisionImg.alt = `Visão de ${compData.name}`;
    compVisionImg.parentElement.style.setProperty("--el-glow", compData.glow);

    document.getElementById("compat-percent").textContent = `${currentResult.percent}%`;
    document.getElementById("compat-title").textContent = currentResult.title;
    document.getElementById("compat-elements-label").textContent = `${myData.name} + ${compData.name}`;

    const strengthsList = document.getElementById("compat-strengths-list");
    strengthsList.innerHTML = "";
    currentResult.strengths.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      strengthsList.appendChild(li);
    });

    const conflictsList = document.getElementById("compat-conflicts-list");
    conflictsList.innerHTML = "";
    currentResult.conflicts.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      conflictsList.appendChild(li);
    });

    document.getElementById("compat-dynamic").textContent = currentResult.dynamic;
    document.getElementById("compat-quote").textContent = currentResult.quote;

    imageGenerated = false;
    els.previewWrap.classList.remove("show");
  }

  /* ---------- Geração de imagem / compartilhamento ---------- */
  function getFileName(){
    return `compatibilidade-genshin-${AppShare.slugify(PLAYER_PROFILE.name)}-${AppShare.slugify(state.companionName)}.png`;
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

  async function onGenerateClick(){
    const btn = document.getElementById("btn-compat-generate");
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
      "Compatibilidade Elemental em Teyvat",
      `Eu e ${state.companionName} temos ${currentResult.percent}% de compatibilidade elemental: "${currentResult.title}"! Testa a sua também (é só uma brincadeira).`
    );
  }

  return { init, enterForm };
})();
