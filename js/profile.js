/* =========================================================
   profile.js — perfil persistente do viajante (LocalStorage)
   ========================================================= */

const PROFILE_STORAGE_KEY = "teyvat_portal_profile";
const LEGACY_NAME_KEY = "teyvat_quiz_playername"; // chave usada pelo quiz antigo

function createEmptyProfile(){
  return {
    name: "",
    avatar: null,              // chave de personagem usada como avatar (assets/characters/<key>.png)
    element: null,             // chave do elemento (ex: "anemo")
    region: null,              // reservado para o quiz de região (fase futura)
    weapon: null,              // reservado para o criador de personagem (fase futura)
    characterAffinity: null,   // reservado para o quiz de personagem (fase futura)
    title: null,
    unlockedTitles: [],
    achievements: [],          // array de ids de ACHIEVEMENTS desbloqueadas
    completedActivities: [],   // array de ids de ACTIVITIES concluídas
    stats: {
      journeysCompleted: 0,
      quizzesDone: 0,
      cardsGenerated: 0,
      wishesDone: 0,
      charactersCreated: 0,
    },
    gallery: [], // array de { id, type, title, date, elementKey, playerName, quote }
  };
}

function loadProfile(){
  let profile = createEmptyProfile();
  try{
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw){
      const saved = JSON.parse(raw);
      profile = Object.assign(profile, saved);
      profile.stats = Object.assign(createEmptyProfile().stats, saved.stats || {});
      profile.achievements = Array.isArray(saved.achievements) ? saved.achievements : [];
      profile.completedActivities = Array.isArray(saved.completedActivities) ? saved.completedActivities : [];
      profile.unlockedTitles = Array.isArray(saved.unlockedTitles) ? saved.unlockedTitles : [];
      profile.gallery = Array.isArray(saved.gallery) ? saved.gallery : [];
    } else {
      migrateLegacyData(profile);
    }
  } catch(err){
    console.warn("Não foi possível carregar o perfil salvo, iniciando um novo:", err);
    profile = createEmptyProfile();
  }
  return profile;
}

// Importa dados do quiz antigo (versão anterior ao Portal), para quem já usou o site antes.
function migrateLegacyData(profile){
  try{
    const legacyName = localStorage.getItem(LEGACY_NAME_KEY);
    if (legacyName){
      profile.name = legacyName;
    }
  } catch(err){ /* ambiente sem localStorage acessível; segue com perfil vazio */ }
}

function saveProfile(){
  try{
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(PLAYER_PROFILE));
  } catch(err){
    console.warn("Não foi possível salvar o perfil:", err);
  }
}

function resetProfile(){
  try{ localStorage.removeItem(PROFILE_STORAGE_KEY); } catch(err){}
  try{ localStorage.removeItem(LEGACY_NAME_KEY); } catch(err){}
  PLAYER_PROFILE = createEmptyProfile();
  saveProfile();
}

function markActivityCompleted(activityId){
  if (!PLAYER_PROFILE.completedActivities.includes(activityId)){
    PLAYER_PROFILE.completedActivities.push(activityId);
    PLAYER_PROFILE.stats.journeysCompleted++;
  }
  saveProfile();
}

function addToGallery(entry){
  const item = Object.assign({
    id: `g_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    date: new Date().toISOString(),
  }, entry);
  PLAYER_PROFILE.gallery.push(item);
  saveProfile();
  return item;
}

function removeFromGallery(id){
  PLAYER_PROFILE.gallery = PLAYER_PROFILE.gallery.filter(g => g.id !== id);
  saveProfile();
}

// Estado global em memória, carregado assim que o script roda.
let PLAYER_PROFILE = loadProfile();
