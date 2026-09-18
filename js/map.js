/* =========================================================
   map.js — "Explore Teyvat"
   Tela visual com as sete regiões clicáveis + modal com
   detalhes. Sem quiz, sem pontuação — só navegação e leitura.
   ========================================================= */

const AppMap = (function(){
  let visited = false;

  function init(){
    renderGrid();
  }

  function enter(){
    renderGrid();
  }

  function renderGrid(){
    const grid = document.getElementById("map-grid");
    if (!grid || grid.children.length) return; // renderiza uma única vez
    grid.innerHTML = "";
    REGION_KEYS.forEach(key => {
      const data = REGIONS[key];
      const elData = ELEMENTS[data.element];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "map-card";
      card.style.setProperty("--el-secondary", elData.secondary);
      card.style.setProperty("--el-glow", elData.glow);
      card.innerHTML = `
        <div class="map-card-banner">
          <img src="${data.image}" alt="${data.name}" onerror="this.parentElement.classList.add('img-fallback')">
        </div>
        <div class="map-card-overlay">
          <h3>${data.name}</h3>
          <p>${data.kicker}</p>
        </div>
      `;
      card.addEventListener("click", () => openDetail(key));
      grid.appendChild(card);
    });
  }

  function openDetail(key){
    const data = REGIONS[key];
    const elData = ELEMENTS[data.element];

    document.getElementById("modal-map").style.setProperty("--el-secondary", elData.secondary);
    document.getElementById("modal-map").style.setProperty("--el-glow", elData.glow);

    const bannerWrap = document.getElementById("map-detail-banner-wrap");
    bannerWrap.classList.remove("img-fallback");
    document.getElementById("map-detail-banner-img").src = data.image;
    document.getElementById("map-detail-banner-img").alt = data.name;

    document.getElementById("map-detail-name").textContent = data.name;
    document.getElementById("map-detail-kicker").textContent = data.kicker;
    document.getElementById("map-detail-element").textContent = `Elemento do Arconte: ${elData.name}`;
    document.getElementById("map-detail-desc").textContent = data.desc;
    document.getElementById("map-detail-atmosphere").textContent = data.atmosphere;
    document.getElementById("map-detail-quote").textContent = data.quote;

    const curiosityList = document.getElementById("map-detail-curiosities");
    curiosityList.innerHTML = "";
    data.curiosities.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      curiosityList.appendChild(li);
    });

    const charRow = document.getElementById("map-detail-characters");
    charRow.innerHTML = "";
    const related = CHARACTER_KEYS.filter(ck => CHARACTERS[ck].region === data.name);
    if (related.length === 0){
      const p = document.createElement("p");
      p.className = "map-no-characters";
      p.textContent = "Nenhum personagem do quiz está diretamente associado a esta região ainda.";
      charRow.appendChild(p);
    } else {
      related.forEach(ck => {
        const cdata = CHARACTERS[ck];
        const item = document.createElement("div");
        item.className = "encyclopedia-char-item";
        item.innerHTML = `
          <img src="${cdata.image}" alt="${cdata.name}" onerror="this.style.visibility='hidden'">
          <span>${cdata.name}</span>
        `;
        charRow.appendChild(item);
      });
    }

    document.getElementById("modal-map").classList.add("show");

    if (!visited){
      visited = true;
      markActivityCompleted("map");
    }
  }

  return { init, enter };
})();
