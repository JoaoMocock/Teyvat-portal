/* =========================================================
   audio.js — controlador global de áudio
   Música de fundo (assets/music/theme.mp3) e efeitos sonoros
   (assets/sounds/*.mp3). Se algum arquivo não existir, o site
   continua funcionando normalmente (falha silenciosa).
   ========================================================= */

const AppAudio = (function(){
  const MUSIC_MUTED_KEY = "teyvat_portal_music_muted";
  const SFX_MUTED_KEY = "teyvat_portal_sfx_muted";

  let musicMuted = localStorage.getItem(MUSIC_MUTED_KEY) === "true";
  let sfxMuted = localStorage.getItem(SFX_MUTED_KEY) === "true";
  let musicStarted = false;

  const sfxFiles = {
    click: "assets/sounds/click.mp3",
    success: "assets/sounds/success.mp3",
    wish: "assets/sounds/wish.mp3",
    achievement: "assets/sounds/achievement.mp3",
    vision: "assets/sounds/vision.mp3",
  };
  const sfxCache = {};

  function getBgm(){
    return document.getElementById("bgm");
  }

  function startMusic(){
    const bgm = getBgm();
    if (!bgm || !bgm.getAttribute("src")) return;
    bgm.muted = musicMuted;
    if (musicStarted) return;

    bgm.volume = 0;
    const playPromise = bgm.play();
    if (playPromise !== undefined){
      playPromise.then(() => {
        musicStarted = true;
        let vol = 0;
        const targetVol = 0.45;
        const fade = setInterval(() => {
          vol = Math.min(targetVol, vol + 0.05);
          bgm.volume = vol;
          if (vol >= targetVol) clearInterval(fade);
        }, 80);
      }).catch((err) => {
        console.warn("Não foi possível tocar a música de fundo:", err && err.message ? err.message : err);
      });
    }
  }

  function setMusicMuted(muted){
    musicMuted = muted;
    localStorage.setItem(MUSIC_MUTED_KEY, String(muted));
    const bgm = getBgm();
    if (bgm) bgm.muted = muted;
  }

  function toggleMusicMuted(){
    setMusicMuted(!musicMuted);
    return musicMuted;
  }

  function isMusicMuted(){ return musicMuted; }

  function setSfxMuted(muted){
    sfxMuted = muted;
    localStorage.setItem(SFX_MUTED_KEY, String(muted));
  }

  function isSfxMuted(){ return sfxMuted; }

  function playSfx(name){
    if (sfxMuted) return;
    const src = sfxFiles[name];
    if (!src) return;
    try{
      if (!sfxCache[name]){
        sfxCache[name] = new Audio(src);
      }
      const node = sfxCache[name].cloneNode();
      node.volume = 0.5;
      const p = node.play();
      if (p && p.catch) p.catch(() => { /* arquivo ausente ou bloqueado; ignora silenciosamente */ });
    } catch(err){ /* ambiente sem suporte a Audio(); ignora */ }
  }

  function isMusicPlaying(){ return musicStarted; }

  return {
    startMusic, setMusicMuted, toggleMusicMuted, isMusicMuted, isMusicPlaying,
    setSfxMuted, isSfxMuted, playSfx,
  };
})();
