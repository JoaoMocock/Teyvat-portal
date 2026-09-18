/* =========================================================
   gallery.js — Minha Galeria
   Guarda apenas metadados leves no LocalStorage (nunca a
   imagem em Base64); o card em PNG é reconstruído sob demanda
   a partir desses dados, evitando estourar o limite do
   LocalStorage.
   ========================================================= */

const AppGallery = (function(){

  function saveElementalResult(elementKey, playerName){
    const data = ELEMENTS[elementKey];
    const entry = addToGallery({
      type: "elemental",
      title: `Visão ${data.name}`,
      elementKey,
      playerName,
      quote: data.quote,
    });
    AppNotify.toast("Card salvo na Galeria.");
    if (PLAYER_PROFILE.gallery.length >= 5){
      AppAchievements.unlock("arquivista");
    }
    return entry;
  }

  function saveCharacterResult(characterKey, playerName){
    const data = CHARACTERS[characterKey];
    const entry = addToGallery({
      type: "character",
      title: data.name,
      characterKey,
      playerName,
      quote: data.quote,
    });
    AppNotify.toast("Card salvo na Galeria.");
    if (PLAYER_PROFILE.gallery.length >= 5){
      AppAchievements.unlock("arquivista");
    }
    return entry;
  }

  function saveRegionResult(regionKey, playerName){
    const data = REGIONS[regionKey];
    const entry = addToGallery({
      type: "region",
      title: data.name,
      regionKey,
      playerName,
      quote: data.quote,
    });
    AppNotify.toast("Card salvo na Galeria.");
    if (PLAYER_PROFILE.gallery.length >= 5){
      AppAchievements.unlock("arquivista");
    }
    return entry;
  }

  function saveCreationResult(creation){
    const entry = addToGallery({
      type: "creation",
      title: creation.name,
      playerName: creation.playerName,
      creation,
    });
    AppNotify.toast("Card salvo na Galeria.");
    if (PLAYER_PROFILE.gallery.length >= 5){
      AppAchievements.unlock("arquivista");
    }
    return entry;
  }

  function saveVisionGenResult(vision){
    const entry = addToGallery({
      type: "visiongen",
      title: `Visão de ${vision.name}`,
      playerName: PLAYER_PROFILE.name,
      vision,
    });
    AppNotify.toast("Card salvo na Galeria.");
    if (PLAYER_PROFILE.gallery.length >= 5){
      AppAchievements.unlock("arquivista");
    }
    return entry;
  }

  function buildOffscreenElementalCard(entry){
    const data = ELEMENTS[entry.elementKey];
    const host = document.getElementById("offscreen-card-host");
    host.innerHTML = "";

    const card = document.createElement("div");
    card.className = "result-card gallery-render-card";
    card.style.setProperty("--el-secondary", data.secondary);
    card.style.setProperty("--el-glow", data.glow);
    card.innerHTML = `
      <div class="result-card-header">
        <span class="result-eyebrow">Minha Visão em Teyvat</span>
        <span class="result-player-name">${entry.playerName}</span>
      </div>
      <div class="result-body">
        <div class="result-symbol-wrap">
          <div class="vision-aura"></div>
          <img class="vision-img" src="${data.vision}" alt="Visão de ${data.name}"
               onerror="this.parentElement.classList.add('vision-fallback')">
        </div>
        <div class="result-text">
          <p class="result-kicker">${data.kicker}</p>
          <h1 class="result-element-name">${data.name}</h1>
          <h3 class="traits-title">Sobre sua Visão</h3>
          <p class="result-desc">${data.desc}</p>
          <h3 class="traits-title">Características</h3>
          <ul class="traits-list">${data.traits.map(t => `<li>${t}</li>`).join("")}</ul>
          <p class="result-affinity">Maior afinidade: <strong>${data.characterName}</strong></p>
          <p class="result-quote">${data.quote}</p>
        </div>
        <div class="result-char-wrap">
          <img src="assets/characters/${data.character}.png" alt="${data.characterName}"
               onerror="this.parentElement.classList.add('img-fallback')">
        </div>
      </div>
      <p class="result-card-footer">Portal de Teyvat</p>
    `;
    host.appendChild(card);
    return card;
  }

  function buildOffscreenCharacterCard(entry){
    const data = CHARACTERS[entry.characterKey];
    const elData = ELEMENTS[data.element];
    const host = document.getElementById("offscreen-card-host");
    host.innerHTML = "";

    const card = document.createElement("div");
    card.className = "result-card gallery-render-card";
    card.style.setProperty("--el-secondary", elData.secondary);
    card.style.setProperty("--el-glow", elData.glow);
    card.innerHTML = `
      <div class="result-card-header">
        <span class="result-eyebrow">Meu Personagem Compatível em Teyvat</span>
        <span class="result-player-name">${entry.playerName}</span>
      </div>
      <div class="result-body">
        <div class="result-symbol-wrap">
          <div class="vision-aura"></div>
          <img class="vision-img" src="${data.image}" alt="${data.name}"
               onerror="this.parentElement.classList.add('vision-fallback')">
        </div>
        <div class="result-text">
          <p class="result-kicker">${data.title}</p>
          <h1 class="result-element-name">${data.name}</h1>
          <p class="result-desc">${data.desc}</p>
          <h3 class="traits-title">Por que combina com você</h3>
          <ul class="traits-list">${data.traits.map(t => `<li>${t}</li>`).join("")}</ul>
          <p class="result-quote">${data.quote}</p>
        </div>
      </div>
      <p class="result-card-footer">Portal de Teyvat</p>
    `;
    host.appendChild(card);
    return card;
  }

  function buildOffscreenRegionCard(entry){
    const data = REGIONS[entry.regionKey];
    const elData = ELEMENTS[data.element];
    const host = document.getElementById("offscreen-card-host");
    host.innerHTML = "";

    const card = document.createElement("div");
    card.className = "result-card gallery-render-card";
    card.style.setProperty("--el-secondary", elData.secondary);
    card.style.setProperty("--el-glow", elData.glow);
    card.innerHTML = `
      <div class="result-card-header">
        <span class="result-eyebrow">Meu Lugar em Teyvat</span>
        <span class="result-player-name">${entry.playerName}</span>
      </div>
      <div class="region-banner-wrap">
        <img class="region-banner-img" src="${data.image}" alt="${data.name}"
             onerror="this.parentElement.classList.add('img-fallback')">
      </div>
      <div class="region-result-body">
        <p class="result-kicker">${data.kicker}</p>
        <h1 class="result-element-name">${data.name}</h1>
        <p class="result-desc">${data.desc}</p>
        <h3 class="traits-title">Por que Teyvat te levaria até lá</h3>
        <ul class="traits-list">${data.traits.map(t => `<li>${t}</li>`).join("")}</ul>
        <p class="result-quote">${data.quote}</p>
      </div>
      <p class="result-card-footer">Portal de Teyvat</p>
    `;
    host.appendChild(card);
    return card;
  }

  function buildOffscreenCreationCard(entry){
    const c = entry.creation;
    const elData = ELEMENTS[c.element];
    const regionName = REGIONS[c.region].name;
    const host = document.getElementById("offscreen-card-host");
    host.innerHTML = "";

    const card = document.createElement("div");
    card.className = "result-card gallery-render-card";
    card.style.setProperty("--el-secondary", elData.secondary);
    card.style.setProperty("--el-glow", elData.glow);
    card.innerHTML = `
      <div class="result-card-header">
        <span class="result-eyebrow">Ficha de Personagem Original</span>
        <span class="result-player-name">Criado por ${c.playerName}</span>
      </div>
      <div class="result-body">
        <div class="result-symbol-wrap">
          <div class="vision-aura"></div>
          <img class="vision-img" src="${elData.vision}" alt="Visão de ${elData.name}"
               onerror="this.parentElement.classList.add('vision-fallback')">
        </div>
        <div class="result-text">
          <h1 class="result-element-name">${c.name}</h1>
          <p class="creator-stars">${"\u2605".repeat(c.rarity)}</p>
          <p class="result-desc" style="opacity:.75;">${elData.name} · ${c.weapon} · ${regionName} · ${c.role}</p>
          <p class="result-desc">${c.personality}</p>
          <h3 class="traits-title">Constelação</h3>
          <ul class="traits-list"><li>Constelação: ${c.constellation}</li></ul>
          <p class="result-quote">\u201C${c.phrase}\u201D</p>
        </div>
      </div>
      <p class="result-card-footer">Portal de Teyvat</p>
    `;
    host.appendChild(card);
    return card;
  }

  function buildOffscreenVisionGenCard(entry){
    const v = entry.vision;
    const elData = ELEMENTS[v.element];
    const regionName = REGIONS[v.region].name;
    const host = document.getElementById("offscreen-card-host");
    host.innerHTML = "";

    const card = document.createElement("div");
    card.className = "result-card vision-gen-card gallery-render-card";
    card.style.setProperty("--el-secondary", elData.secondary);
    card.style.setProperty("--el-glow", elData.glow);
    card.innerHTML = `
      <div class="result-card-header">
        <span class="result-eyebrow">Minha Visão Personalizada</span>
      </div>
      <div class="vision-gen-body">
        <div class="result-symbol-wrap vision-gen-symbol-wrap">
          <div class="vision-aura"></div>
          <img class="vision-img" src="${elData.vision}" alt="Visão de ${elData.name}"
               onerror="this.parentElement.classList.add('vision-fallback')">
        </div>
        <h1 class="result-element-name vision-gen-title">Visão concedida a ${v.name}</h1>
        <p class="result-desc">Elemento: ${elData.name}  ·  Região: ${regionName}</p>
        <p class="result-quote">${elData.quote}</p>
      </div>
      <p class="result-card-footer">Portal de Teyvat</p>
    `;
    host.appendChild(card);
    return card;
  }

  async function downloadEntry(entryId){
    const entry = PLAYER_PROFILE.gallery.find(g => g.id === entryId);
    if (!entry) return;
    if (entry.type === "elemental"){
      const cardEl = buildOffscreenElementalCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `resultado-genshin-${AppShare.slugify(entry.playerName)}-${entry.elementKey}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    } else if (entry.type === "character"){
      const cardEl = buildOffscreenCharacterCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `personagem-genshin-${AppShare.slugify(entry.playerName)}-${entry.characterKey}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    } else if (entry.type === "region"){
      const cardEl = buildOffscreenRegionCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `regiao-genshin-${AppShare.slugify(entry.playerName)}-${entry.regionKey}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    } else if (entry.type === "creation"){
      const cardEl = buildOffscreenCreationCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `personagem-criado-${AppShare.slugify(entry.creation.name)}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    } else if (entry.type === "visiongen"){
      const cardEl = buildOffscreenVisionGenCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `visao-genshin-${AppShare.slugify(entry.vision.name)}-${entry.vision.element}.png`;
      AppShare.downloadImage(dataUrl, filename);
      AppNotify.toast("Download iniciado!");
    }
  }

  async function shareEntry(entryId){
    const entry = PLAYER_PROFILE.gallery.find(g => g.id === entryId);
    if (!entry) return;
    if (entry.type === "elemental"){
      const data = ELEMENTS[entry.elementKey];
      const cardEl = buildOffscreenElementalCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `resultado-genshin-${AppShare.slugify(entry.playerName)}-${entry.elementKey}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Qual é o seu Elemento em Teyvat?",
        `Minha Visão em Genshin Impact é ${data.name}! Qual seria a sua?`
      );
    } else if (entry.type === "character"){
      const data = CHARACTERS[entry.characterKey];
      const cardEl = buildOffscreenCharacterCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `personagem-genshin-${AppShare.slugify(entry.playerName)}-${entry.characterKey}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Qual personagem de Genshin combina com você?",
        `Descobri que meu personagem compatível em Teyvat é ${data.name}! Qual seria o seu?`
      );
    } else if (entry.type === "region"){
      const data = REGIONS[entry.regionKey];
      const cardEl = buildOffscreenRegionCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `regiao-genshin-${AppShare.slugify(entry.playerName)}-${entry.regionKey}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Onde em Teyvat você deveria viver?",
        `Descobri que meu lugar em Teyvat seria ${data.name}! Qual seria o seu?`
      );
    } else if (entry.type === "creation"){
      const cardEl = buildOffscreenCreationCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `personagem-criado-${AppShare.slugify(entry.creation.name)}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Criei meu personagem de Genshin!",
        `Criei ${entry.creation.name}, um(a) personagem original de Teyvat! Vem criar o seu também.`
      );
    } else if (entry.type === "visiongen"){
      const elData = ELEMENTS[entry.vision.element];
      const cardEl = buildOffscreenVisionGenCard(entry);
      const dataUrl = await AppShare.generateCardImage(cardEl);
      const filename = `visao-genshin-${AppShare.slugify(entry.vision.name)}-${entry.vision.element}.png`;
      await AppShare.shareImage(
        dataUrl, filename,
        "Criei minha Visão em Teyvat!",
        `Recebi uma Visão de ${elData.name} em Teyvat! Vem criar a sua também.`
      );
    }
  }

  function deleteEntry(entryId){
    removeFromGallery(entryId);
    renderGalleryScreen();
    AppNotify.toast("Item removido da Galeria.");
  }

  function renderGalleryScreen(){
    const grid = document.getElementById("gallery-grid");
    const empty = document.getElementById("gallery-empty");
    if (!grid) return;
    grid.innerHTML = "";

    if (PLAYER_PROFILE.gallery.length === 0){
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    [...PLAYER_PROFILE.gallery].reverse().forEach(entry => {
      let imageSrc = null, secondaryColor = null;
      if (entry.type === "elemental"){
        const data = ELEMENTS[entry.elementKey];
        imageSrc = data.vision;
        secondaryColor = data.secondary;
      } else if (entry.type === "character"){
        const data = CHARACTERS[entry.characterKey];
        imageSrc = data.image;
        secondaryColor = ELEMENTS[data.element].secondary;
      } else if (entry.type === "region"){
        const data = REGIONS[entry.regionKey];
        imageSrc = data.image;
        secondaryColor = ELEMENTS[data.element].secondary;
      } else if (entry.type === "creation"){
        const elData = ELEMENTS[entry.creation.element];
        imageSrc = elData.vision;
        secondaryColor = elData.secondary;
      } else if (entry.type === "visiongen"){
        const elData = ELEMENTS[entry.vision.element];
        imageSrc = elData.vision;
        secondaryColor = elData.secondary;
      }

      const card = document.createElement("div");
      card.className = "gallery-card";
      if (secondaryColor) card.style.setProperty("--el-secondary", secondaryColor);
      const dateLabel = new Date(entry.date).toLocaleDateString("pt-BR");

      card.innerHTML = `
        <div class="gallery-card-vision">
          ${imageSrc ? `<img src="${imageSrc}" alt="${entry.title}" onerror="this.style.display='none'">` : ""}
        </div>
        <div class="gallery-card-info">
          <strong>${entry.title}</strong>
          <span>${entry.playerName} · ${dateLabel}</span>
        </div>
        <div class="gallery-card-actions">
          <button class="btn-secondary btn-sm" data-action="download">Baixar</button>
          <button class="btn-secondary btn-sm" data-action="share">Compartilhar</button>
          <button class="btn-secondary btn-sm btn-danger" data-action="delete">Excluir</button>
        </div>
      `;

      card.querySelector('[data-action="download"]').addEventListener("click", () => downloadEntry(entry.id));
      card.querySelector('[data-action="share"]').addEventListener("click", () => shareEntry(entry.id));
      card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteEntry(entry.id));

      grid.appendChild(card);
    });
  }

  return { saveElementalResult, saveCharacterResult, saveRegionResult, saveCreationResult, saveVisionGenResult, renderGalleryScreen };
})();
