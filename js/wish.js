/* =========================================================
   wish.js — "Desejos de Teyvat"
   Simulador puramente visual, inspirado no sistema de Wishes.
   SEM dinheiro real, SEM compras, SEM apostas — apenas
   entretenimento com taxas fictícias (ver data.js).
   ========================================================= */

const AppWish = (function(){
  let els = {};
  let lastResults = [];
  let generatedDataUrl = null;
  let imageGenerated = false;
  let skipRequested = false;

  function init(){
    els = {
      captureCard: document.getElementById("wish-capture-card"),
      cardsGrid: document.getElementById("wish-cards-grid"),
      resultsWrap: document.getElementById("wish-results-wrap"),
      stage: document.getElementById("wish-stage"),
      star: document.getElementById("wish-star"),
      boom: document.getElementById("wish-boom"),
      skipBtn: document.getElementById("btn-wish-skip"),
      previewWrap: document.getElementById("wish-preview-wrap"),
      previewImg: document.getElementById("wish-preview-img"),
      previewDownloadLink: document.getElementById("wish-preview-download-link"),
    };

    document.getElementById("btn-wish-intro-start").addEventListener("click", () => AppRouter.go("wish-banner"));
    document.getElementById("btn-wish-x1").addEventListener("click", () => startWish(1));
    document.getElementById("btn-wish-x10").addEventListener("click", () => startWish(10));
    document.getElementById("btn-wish-skip").addEventListener("click", () => { skipRequested = true; });
    document.getElementById("btn-wish-again").addEventListener("click", () => AppRouter.go("wish-banner"));
    document.getElementById("btn-wish-generate").addEventListener("click", onGenerateClick);
    document.getElementById("btn-wish-download").addEventListener("click", onDownloadClick);
    document.getElementById("btn-wish-share").addEventListener("click", onShareClick);
  }

  /* ---------- Sorteio (fictício, apenas entretenimento) ---------- */
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function rollOne(){
    const r = Math.random();
    if (r < WISH_RATES.legendary) return pick(WISH_ITEMS.legendary);
    if (r < WISH_RATES.legendary + WISH_RATES.rare) return pick(WISH_ITEMS.rare);
    return pick(WISH_ITEMS.common);
  }

  function rollBatch(count){
    const results = Array.from({ length: count }, rollOne);
    if (count === 10 && !results.some(r => r.tier >= 4)){
      // garantia simples: todo desejo x10 inclui pelo menos um item raro ou lendário
      const legendaryShare = WISH_RATES.legendary / (WISH_RATES.legendary + WISH_RATES.rare);
      results[9] = Math.random() < legendaryShare ? pick(WISH_ITEMS.legendary) : pick(WISH_ITEMS.rare);
    }
    return results;
  }

  /* ---------- Fluxo do desejo ---------- */
  function startWish(count){
    lastResults = rollBatch(count);
    imageGenerated = false;
    skipRequested = false;
    els.previewWrap.classList.remove("show");

    AppRouter.go("wish-reveal");
    els.resultsWrap.classList.remove("show");
    els.stage.classList.add("active");
    els.cardsGrid.innerHTML = "";

    const bestTier = Math.max(...lastResults.map(r => r.tier));
    const tierColor = { 3: "var(--wish-common)", 4: "var(--wish-rare)", 5: "var(--wish-legendary)" }[bestTier];
    els.star.style.setProperty("--wish-color", tierColor);
    els.boom.style.setProperty("--wish-color", tierColor);
    els.star.classList.remove("fly"); els.boom.classList.remove("boom");
    void els.star.offsetWidth; // força reflow para reiniciar a animação

    els.star.classList.add("fly");

    const flightDuration = 1700;
    waitOrSkip(flightDuration).then(() => {
      els.boom.classList.add("boom");
      return waitOrSkip(500);
    }).then(() => {
      els.stage.classList.remove("active");
      revealResults(count);
    });
  }

  function waitOrSkip(ms){
    return new Promise(resolve => {
      const start = Date.now();
      const check = () => {
        if (skipRequested || Date.now() - start >= ms) return resolve();
        requestAnimationFrame(check);
      };
      check();
    });
  }

  function revealResults(count){
    document.getElementById("wish-results-title").textContent =
      count === 1 ? "Seu Desejo" : "Seus 10 Desejos";
    document.getElementById("wish-result-player-name").textContent = PLAYER_PROFILE.name;

    els.cardsGrid.innerHTML = "";
    lastResults.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = `wish-card tier-${item.tier}`;
      card.innerHTML = `
        <div class="wish-card-glow"></div>
        <img src="${item.image}" alt="${item.name}" onerror="this.style.visibility='hidden'">
        <span class="wish-card-stars">${"\u2605".repeat(item.tier)}</span>
        <span class="wish-card-name">${item.name}</span>
      `;
      card.style.animationDelay = skipRequested ? "0s" : `${i * 0.18}s`;
      els.cardsGrid.appendChild(card);
    });

    els.resultsWrap.classList.add("show");
    AppAudio.playSfx("wish");

    PLAYER_PROFILE.stats.wishesDone += count;
    saveProfile();
    markActivityCompleted("wish-simulator");
    AppAchievements.unlock("sob-as-estrelas");
    if (count === 10){
      AppAchievements.unlock("dez-destinos");
    }

    const bestTier = Math.max(...lastResults.map(r => r.tier));
    if (bestTier === 5){
      AppNotify.toast("Um item lendário apareceu!");
    }
  }

  /* ---------- Geração de imagem / compartilhamento ---------- */
  function getFileName(){
    return `desejos-genshin-${AppShare.slugify(PLAYER_PROFILE.name)}-${lastResults.length}x.png`;
  }

  async function ensureGenerated(){
    if (!imageGenerated){
      generatedDataUrl = await AppShare.generateCardImage(els.captureCard);
      imageGenerated = true;
      els.previewImg.src = generatedDataUrl;
      if (els.previewDownloadLink){
        els.previewDownloadLink.href = generatedDataUrl;
        els.previewDownloadLink.download = getFileName();
      }
    }
  }

  async function onGenerateClick(){
    const btn = document.getElementById("btn-wish-generate");
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
    const bestTier = Math.max(...lastResults.map(r => r.tier));
    const bestItem = lastResults.find(r => r.tier === bestTier);
    await AppShare.shareImage(
      generatedDataUrl, getFileName(),
      "Desejos de Teyvat",
      `Fiz um Desejo em Teyvat e recebi ${bestItem.name}! Vem tentar a sua sorte também (é só uma brincadeira, sem nada real envolvido).`
    );
  }

  return { init };
})();
