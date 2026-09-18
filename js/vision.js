/* =========================================================
   vision.js — "Crie sua Visão"
   Ferramenta simples de geração: nome + elemento + região.
   Sem pontuação, sem quiz — só uma grande Visão animada e um
   card para compartilhar, seguindo a mesma arquitetura das
   outras telas (roteamento, AppShare, AppGallery, AppNotify).
   ========================================================= */

const AppVisionGenerator = (function(){
  const state = {
    name: "",
    element: "anemo",
    region: "mondstadt",
  };
  let generatedDataUrl = null;
  let imageGenerated = false;
  let els = {};
  const chipGroups = {};

  function init(){
    els = {
      introDialogue: document.getElementById("visiongen-intro-dialogue-text"),
      nameInput: document.getElementById("visiongen-name-input"),
      nameError: document.getElementById("visiongen-name-error"),
      resultCard: document.getElementById("visiongen-result-card"),
      previewWrap: document.getElementById("visiongen-preview-wrap"),
      previewImg: document.getElementById("visiongen-preview-img"),
      previewDownloadLink: document.getElementById("visiongen-preview-download-link"),
    };

    renderChipGroup("visiongen-element-group",
      ELEMENT_KEYS.map(k => ({ value: k, label: ELEMENTS[k].name, color: ELEMENTS[k].secondary })),
      () => state.element, (v) => { state.element = v; });

    renderChipGroup("visiongen-region-group",
      REGION_KEYS.map(k => ({ value: k, label: REGIONS[k].name })),
      () => state.region, (v) => { state.region = v; });

    els.nameInput.addEventListener("input", () => {
      state.name = els.nameInput.value;
      if (state.name.trim()) els.nameError.classList.remove("show");
    });

    document.getElementById("btn-visiongen-start").addEventListener("click", () => AppRouter.go("vision-generator-form"));
    document.getElementById("btn-visiongen-use-my-name").addEventListener("click", useMyName);
    document.getElementById("btn-visiongen-generate-card").addEventListener("click", onGenerateCard);
    document.getElementById("btn-visiongen-generate").addEventListener("click", onGenerateImageClick);
    document.getElementById("btn-visiongen-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-visiongen-share").addEventListener("click", onShareClick);
    document.getElementById("btn-visiongen-save-gallery").addEventListener("click", onSaveGalleryClick);
    document.getElementById("btn-visiongen-another").addEventListener("click", () => AppRouter.go("vision-generator-form"));
  }

  function enterIntro(){
    if (els.introDialogue){
      els.introDialogue.textContent = `Vamos conceder uma Visão personalizada, ${PLAYER_PROFILE.name}! Escolha um nome, um elemento e uma região.`;
    }
  }

  function enterForm(){
    // começa com o nome do próprio viajante preenchido, mas pode ser trocado livremente
    state.name = PLAYER_PROFILE.name || "";
    els.nameInput.value = state.name;
    els.nameError.classList.remove("show");
    document.querySelectorAll("#screen-vision-generator-form .chip-group").forEach(refreshChipGroupSelection);
  }

  function useMyName(){
    state.name = PLAYER_PROFILE.name || "";
    els.nameInput.value = state.name;
    if (state.name.trim()) els.nameError.classList.remove("show");
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

  /* ---------- Gerar Visão ---------- */
  function onGenerateCard(){
    const name = state.name.trim();
    if (!name){
      els.nameError.classList.add("show");
      return;
    }
    state.name = sanitizeText(name);

    renderResultCard();
    AppRouter.go("vision-generator-result");

    markActivityCompleted("vision-generator");
    AppNotify.toast("Visão concedida!");
  }

  function renderResultCard(){
    const elData = ELEMENTS[state.element];
    const regionName = REGIONS[state.region].name;

    document.getElementById("visiongen-result-card").style.setProperty("--el-secondary", elData.secondary);
    document.getElementById("visiongen-result-card").style.setProperty("--el-glow", elData.glow);

    document.getElementById("visiongen-result-title").textContent = `Visão concedida a ${state.name}`;
    document.getElementById("visiongen-result-meta").textContent = `Elemento: ${elData.name}  ·  Região: ${regionName}`;
    document.getElementById("visiongen-result-quote").textContent = elData.quote;

    const visionImg = document.getElementById("visiongen-vision-img");
    document.getElementById("visiongen-vision-wrap").classList.remove("vision-fallback");
    visionImg.src = elData.vision;
    visionImg.alt = `Visão de ${elData.name}`;

    spawnParticles(elData);
    imageGenerated = false;
    els.previewWrap.classList.remove("show");
  }

  function spawnParticles(elData){
    const layer = document.getElementById("visiongen-particles");
    layer.innerHTML = "";
    const count = 10;
    for (let i = 0; i < count; i++){
      const dot = document.createElement("span");
      const size = 3 + Math.random() * 5;
      const radius = 78 + Math.random() * 55;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.top = "50%";
      dot.style.left = "50%";
      dot.style.marginTop = -(size/2) + "px";
      dot.style.marginLeft = -(size/2) + "px";
      dot.style.background = elData.secondary;
      dot.style.setProperty("--r", radius + "px");
      dot.style.animationDuration = (3 + Math.random() * 2.6) + "s";
      dot.style.animationDelay = -(Math.random() * 4) + "s";
      layer.appendChild(dot);
    }

    const bgLayer = document.getElementById("visiongen-result-bg-effects");
    bgLayer.innerHTML = "";
    const glyphs = ["✦", "●", "◆"];
    for (let i = 0; i < 20; i++){
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
      bgLayer.appendChild(p);
    }
  }

  function sanitizeText(raw){
    const div = document.createElement("div");
    div.textContent = raw;
    return div.innerHTML.slice(0, 24);
  }

  function getFileName(){
    return `visao-genshin-${AppShare.slugify(state.name)}-${state.element}.png`;
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
    const btn = document.getElementById("btn-visiongen-generate");
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
    const elData = ELEMENTS[state.element];
    await ensureGenerated();
    els.previewWrap.classList.add("show");
    els.previewWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Criei minha Visão em Teyvat!",
      `Recebi uma Visão de ${elData.name} em Teyvat! Vem criar a sua também.`
    );
  }

  function onSaveGalleryClick(){
    AppGallery.saveVisionGenResult({
      name: state.name,
      element: state.element,
      region: state.region,
    });
  }

  return { init, enterIntro, enterForm };
})();
