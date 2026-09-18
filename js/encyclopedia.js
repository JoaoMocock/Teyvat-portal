/* =========================================================
   encyclopedia.js — "Elementos de Teyvat"
   Enciclopédia de consulta: 7 cards + modal com detalhes.
   Sem quiz, sem pontuação — só navegação e leitura.
   ========================================================= */

const AppEncyclopedia = (function(){
  let visited = false;

  function init(){
    renderGrid();
  }

  function enter(){
    renderGrid();
  }

  function renderGrid(){
    const grid = document.getElementById("encyclopedia-grid");
    if (!grid || grid.children.length) return; // renderiza uma única vez
    grid.innerHTML = "";
    ELEMENT_KEYS.forEach(key => {
      const data = ELEMENTS[key];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "encyclopedia-card";
      card.style.setProperty("--el-secondary", data.secondary);
      card.style.setProperty("--el-glow", data.glow);
      card.innerHTML = `
        <div class="encyclopedia-card-vision">
          <img src="${data.vision}" alt="Visão de ${data.name}" onerror="this.style.visibility='hidden'">
        </div>
        <h3>${data.name}</h3>
        <p>${data.kicker}</p>
      `;
      card.addEventListener("click", () => openDetail(key));
      grid.appendChild(card);
    });
  }

  function openDetail(key){
    const data = ELEMENTS[key];

    document.getElementById("modal-encyclopedia").style.setProperty("--el-secondary", data.secondary);
    document.getElementById("modal-encyclopedia").style.setProperty("--el-glow", data.glow);

    const visionImg = document.getElementById("encyclopedia-detail-vision-img");
    document.getElementById("encyclopedia-detail-vision-wrap").classList.remove("vision-fallback");
    visionImg.src = data.vision;
    visionImg.alt = `Visão de ${data.name}`;

    document.getElementById("encyclopedia-detail-name").textContent = data.name;
    document.getElementById("encyclopedia-detail-kicker").textContent = data.kicker;
    document.getElementById("encyclopedia-detail-desc").textContent = data.desc;
    document.getElementById("encyclopedia-detail-quote").textContent = data.quote;

    const traitsList = document.getElementById("encyclopedia-detail-traits");
    traitsList.innerHTML = "";
    data.traits.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      traitsList.appendChild(li);
    });

    const reactionsList = document.getElementById("encyclopedia-detail-reactions");
    reactionsList.innerHTML = "";
    (ELEMENT_REACTIONS[key] || []).forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      reactionsList.appendChild(li);
    });

    const charRow = document.getElementById("encyclopedia-detail-characters");
    charRow.innerHTML = "";
    CHARACTER_KEYS.filter(ck => CHARACTERS[ck].element === key).forEach(ck => {
      const cdata = CHARACTERS[ck];
      const item = document.createElement("div");
      item.className = "encyclopedia-char-item";
      item.innerHTML = `
        <img src="${cdata.image}" alt="${cdata.name}" onerror="this.style.visibility='hidden'">
        <span>${cdata.name}</span>
      `;
      charRow.appendChild(item);
    });

    document.getElementById("modal-encyclopedia").classList.add("show");

    if (!visited){
      visited = true;
      markActivityCompleted("encyclopedia");
    }
  }

  return { init, enter };
})();
