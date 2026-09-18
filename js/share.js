/* =========================================================
   share.js — geração de cards em PNG e compartilhamento
   Centraliza html2canvas para qualquer módulo do Portal
   (resultado elemental, perfil, galeria, futuros módulos).
   ========================================================= */

const AppShare = (function(){

  function waitForImages(container){
    const imgs = Array.from(container.querySelectorAll("img"));
    return Promise.all(imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }));
  }

  async function generateCardImage(cardEl, options){
    options = options || {};
    await waitForImages(cardEl);
    // Renderiza sempre numa largura fixa (estilo "cartão de identidade" pensado
    // para redes sociais), independente da largura da tela de quem está gerando —
    // assim o PNG final fica com proporção consistente tanto no celular quanto no desktop.
    const shareWidth = options.shareWidth || 1080;
    const canvas = await html2canvas(cardEl, {
      backgroundColor: options.backgroundColor || "#0a1226",
      scale: options.scale || 2,
      width: shareWidth,
      windowWidth: shareWidth,
      useCORS: true,
      logging: false,
    });
    const dataUrl = canvas.toDataURL("image/png");
    PLAYER_PROFILE.stats.cardsGenerated++;
    saveProfile();
    AppAchievements.unlock("fotografo-fontaine");
    return dataUrl;
  }

  function downloadImage(dataUrl, filename){
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function shareImage(dataUrl, filename, shareTitle, shareText){
    try{
      if (navigator.share){
        let shareData = { title: shareTitle, text: shareText };
        try{
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })){
            shareData.files = [file];
          }
        } catch(e){ /* segue sem arquivo se falhar */ }

        await navigator.share(shareData);
        AppNotify.toast("Resultado compartilhado!");
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareTitle}`);
        AppNotify.toast("Resultado copiado!");
      }
    } catch(err){
      if (err && err.name === "AbortError") return;
      try{
        await navigator.clipboard.writeText(`${shareText}`);
        AppNotify.toast("Resultado copiado!");
      } catch(e){
        AppNotify.toast("Não foi possível compartilhar agora.");
      }
    }
  }

  function slugify(text){
    return (text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "") || "viajante";
  }

  return { waitForImages, generateCardImage, downloadImage, shareImage, slugify };
})();
