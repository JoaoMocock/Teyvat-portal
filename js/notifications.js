/* =========================================================
   notifications.js — Toast Notifications próprias
   (nunca utiliza alert() do navegador)
   ========================================================= */

const AppNotify = (function(){
  let container = null;
  const queue = [];
  let showing = false;

  function ensureContainer(){
    if (container) return container;
    container = document.getElementById("app-toast");
    return container;
  }

  function processQueue(){
    if (showing || queue.length === 0) return;
    const el = ensureContainer();
    if (!el) return;

    showing = true;
    const { message } = queue.shift();
    el.textContent = message;
    el.classList.add("show");

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => {
        showing = false;
        processQueue();
      }, 250);
    }, 2400);
  }

  function toast(message){
    queue.push({ message });
    processQueue();
  }

  return { toast };
})();
