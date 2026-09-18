/* =========================================================
   achievements.js — sistema de conquistas do viajante
   ========================================================= */

const AppAchievements = (function(){

  function unlock(id){
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (!def) return false;
    if (PLAYER_PROFILE.achievements.includes(id)) return false;

    PLAYER_PROFILE.achievements.push(id);
    saveProfile();
    showPopup(def);
    AppAudio.playSfx("achievement");
    checkExplorerAchievement();
    return true;
  }

  function checkExplorerAchievement(){
    // "Explorador de Teyvat" será concedida automaticamente quando todas as
    // atividades principais (as que já existem no Portal) estiverem concluídas.
    const mainActivities = ACTIVITIES.filter(a => a.status === "available" && a.route !== "profile" && a.route !== "achievements" && a.route !== "gallery");
    const allDone = mainActivities.every(a => PLAYER_PROFILE.completedActivities.includes(a.id));
    if (allDone && mainActivities.length > 0){
      // ainda não desbloqueamos oficialmente enquanto os módulos futuros não existirem;
      // isso evita conceder uma conquista "de exploração total" prematuramente.
    }
  }

  function showPopup(def){
    const popup = document.getElementById("achievement-popup");
    if (!popup) return;
    popup.innerHTML = `
      <span class="achievement-popup-kicker">Conquista Desbloqueada</span>
      <strong class="achievement-popup-name">${def.name}</strong>
    `;
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 3400);
  }

  function renderAchievementsScreen(){
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    grid.innerHTML = "";

    ACHIEVEMENTS.forEach(def => {
      const unlocked = PLAYER_PROFILE.achievements.includes(def.id);
      const card = document.createElement("div");
      card.className = "achievement-card" + (unlocked ? " unlocked" : "");
      card.innerHTML = `
        <div class="achievement-icon">${unlocked ? "✦" : "?"}</div>
        <div class="achievement-info">
          <strong>${unlocked ? def.name : "???"}</strong>
          <p>${unlocked ? def.description : (def.available ? "Continue explorando para descobrir." : "Chega em uma futura atualização do Portal.")}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    const count = PLAYER_PROFILE.achievements.length;
    const countLabel = document.getElementById("achievements-count");
    if (countLabel) countLabel.textContent = `${count} de ${ACHIEVEMENTS.length} desbloqueadas`;
  }

  return { unlock, renderAchievementsScreen };
})();
