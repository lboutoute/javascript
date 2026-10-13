//champs formulaire

const formimput = document.querySelector('#formulaire-de-bd');
const nombdimput = document.querySelector('#nom');
const nbpagesbdimput = document.querySelector('#nbpages');
const anneebdimput = document.querySelector('#annee');
const prixbdimput = document.querySelector('#prix');

//champs card

const formZone = document.querySelector('#formulaire-de-bd-zone');
const nombdZone = document.querySelector('#nom-zone');
const nbpagesbdZone = document.querySelector('#nbpages-zone');
const anneebdZone = document.querySelector('#annee-zone');
const prixbdZone = document.querySelector('#prix-zone');

//fonction modifer

function modifierbase(event) {
    event.preventDefault();
    nombdZone.textContent = nombdimput.value;
    nbpagesbdZone.textContent = nbpagesbdimput.value;
    anneebdZone.textContent = anneebdimput.value;
    prixbdZone.textContent = prixbdimput.value;
}


// Key de stockage dans le LocalStorage
const STORAGE_KEY = "catalogue_livres_v4";

// Données par défaut si le LocalStorage est vide
const catalogueInitial = [
  {
    id: "livre_1",
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    annee: 1943,
    prix: 12.0,
    dateAjout: new Date(2026, 0, 15).toISOString()
  },
  {
    id: "livre_2",
    titre: "1984",
    auteur: "George Orwell",
    annee: 1949,
    prix: 8.5,
    dateAjout: new Date(2026, 1, 10).toISOString()
  }
];

// État global de l'application : Tableau d'objets
let catalogue = [];

// ==========================================
// 1. PERSISTANCE ET SÉRIALISATION (JSON / LocalStorage)
// ==========================================

// Charger la collection depuis le LocalStorage
const chargerCatalogue = () => {
  const donneesStockees = localStorage.getItem(STORAGE_KEY);
  if (donneesStockees) {
    try {
      catalogue = JSON.parse(donneesStockees);
    } catch (e) {
      console.error("Erreur lors de la lecture du LocalStorage", e);
      catalogue = [...catalogueInitial];
    }
  } else {
    catalogue = [...catalogueInitial];
    sauvegarderCatalogue();
  }
};

// Sauvegarder la collection dans le LocalStorage
const sauvegarderCatalogue = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogue));
};

// ==========================================
// 2. FONCTIONS AVANCÉES & CALCULS (Math, Date, Reduce)
// ==========================================

// Calculer les statistiques du catalogue avec la programmation fonctionnelle
const mettreAJourStatistiques = (collection) => {
  const totalTitres = collection.length;

  if (totalTitres === 0) {
    document.querySelector("#stat-total").textContent = "0";
    document.querySelector("#stat-valeur").textContent = "0.00 €";
    document.querySelector("#stat-moyen").textContent = "0.00 €";
    document.querySelector("#stat-min-max").textContent = "Max: 0€ | Min: 0€";
    return;
  }

  // Calcul du total cumulé avec reduce()
  const valeurTotale = collection.reduce((acc, livre) => acc + livre.prix, 0);

  // Calcul de la moyenne
  const prixMoyen = valeurTotale / totalTitres;

  // Calcul des bornes Max et Min avec l'objet Math et map()
  const tousLesPrix = collection.map((livre) => livre.prix);
  const prixMax = Math.max(...tousLesPrix);
  const prixMin = Math.min(...tousLesPrix);

  // Mise à jour de l'affichage DOM (arrondis à 2 décimales)
  document.querySelector("#stat-total").textContent = totalTitres;
  document.querySelector("#stat-valeur").textContent =
    `${valeurTotale.toFixed(2)} €`;
  document.querySelector("#stat-moyen").textContent =
    `${prixMoyen.toFixed(2)} €`;
  document.querySelector("#stat-min-max").textContent =
    `Max: ${prixMax.toFixed(2)}€ | Min: ${prixMin.toFixed(2)}€`;
};

// Formatage d'une date ISO avec l'objet Date
const formaterDateISO = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

// Calculer l'époque selon l'année d'édition
const determinerEpoque = (annee) => {
  if (annee < 1900) return "Classique";
  if (annee < 2000) return "20ème siècle";
  return "Contemporain";
};

// ==========================================
// 3. AFFICHAGE ET TRANSFORMATION DYNAMIQUE (DOM, Map, Filter)
// ==========================================

const afficherCatalogue = (collection) => {
  const conteneurListe = document.querySelector("#liste-livres");
  conteneurListe.innerHTML = "";

  if (collection.length === 0) {
    conteneurListe.innerHTML = `<p class="col-span-2 text-center text-slate-400 py-8">Aucun ouvrage ne correspond à la recherche.</p>`;
    return;
  }

  // Transformation du tableau d'objets en tableau de chaînes HTML avec map()
  const cartesHTML = collection.map((livre) => {
    const epoque = determinerEpoque(livre.annee);
    const dateFormatee = formaterDateISO(livre.dateAjout);

    const badgePrix =
      livre.prix === 0
        ? `<span class="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">Gratuit</span>`
        : livre.prix < 10
          ? `<span class="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded">Petit prix</span>`
          : "";

    return ` <article class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-indigo-200 transition"> <header class="flex justify-between items-start"> <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-500"> ${epoque} </span> ${badgePrix} </header> <section> <h3 class="font-bold text-slate-900 mt-1"> ${livre.titre} </h3> <p class="text-xs text-slate-500"> ${livre.auteur} (${livre.annee}) </p> </section> <footer class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs"> <span class="text-slate-400"> Ajouté le ${dateFormatee} </span> <section class="flex items-center gap-2"> <output class="font-bold text-slate-900 text-sm"> ${livre.prix.toFixed(2)} € </output> <button onclick="supprimerLivre('${livre.id}')" class="text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition" title="Supprimer" aria-label="Supprimer ${livre.titre}" > ✕ </button> </section> </footer> </article> `;
  });

  // Injection dans le DOM
  conteneurListe.innerHTML = cartesHTML.join("");
};

// Filtrer la collection selon les saisies utilisateur (Filter)
const filtrerEtAfficherCatalogue = () => {
  const texteRecherche = document
    .querySelector("#recherche-texte")
    .value.toLowerCase()
    .trim();
  const filtreEpoque = document.querySelector("#filtre-epoque").value;

  // Filtrage combiné avec filter()
  const resultatsFiltres = catalogue.filter((livre) => {
    const correspondTexte =
      livre.titre.toLowerCase().includes(texteRecherche) ||
      livre.auteur.toLowerCase().includes(texteRecherche);

    const epoqueLivre = determinerEpoque(livre.annee);
    const correspondEpoque =
      filtreEpoque === "tous" || epoqueLivre === filtreEpoque;

    return correspondTexte && correspondEpoque;
  });

  afficherCatalogue(resultatsFiltres);
  mettreAJourStatistiques(resultatsFiltres);
};

// ==========================================
// 4. ACTIONS ET ÉVÉNEMENTS (Ajout, Suppression, Validation)
// ==========================================

// Fonction d'ajout d'un nouvel objet
const ajouterLivre = (event) => {
  event.preventDefault();

  const champTitre = document.querySelector("#champ-titre");
  const champAuteur = document.querySelector("#champ-auteur");
  const champAnnee = document.querySelector("#champ-annee");
  const champPrix = document.querySelector("#champ-prix");

  const titre = champTitre.value.trim();
  const auteur = champAuteur.value.trim();
  const annee = parseInt(champAnnee.value);
  const prix = parseFloat(champPrix.value);

  if (
    !titre ||
    !auteur ||
    isNaN(annee) ||
    isNaN(prix) ||
    annee <= 0 ||
    prix < 0
  ) {
    alert("Veuillez saisir des informations valides.");
    return;
  }

  // Création du nouvel objet littéral
  const nouveauLivre = {
    id: `livre_${Date.now()}`, // Identifiant unique généré par Horodatage
    titre: titre,
    auteur: auteur,
    annee: annee,
    prix: prix,
    dateAjout: new Date().toISOString() // Objet Date natif
  };

  // Immutabilité : ajout avec le Spread operator
  catalogue = [...catalogue, nouveauLivre];

  sauvegarderCatalogue();
  filtrerEtAfficherCatalogue();

  document.querySelector("#formulaire-livre").reset();
};

// Suppression d'un objet par ID avec filter()
const supprimerLivre = (idASupprimer) => {
  catalogue = catalogue.filter((livre) => livre.id !== idASupprimer);
  sauvegarderCatalogue();
  filtrerEtAfficherCatalogue();
};

// Réinitialisation globale du catalogue
const reinitialiserDonnees = () => {
  if (confirm("Voulez-vous réinitialiser le catalogue par défaut ?")) {
    localStorage.removeItem(STORAGE_KEY);
    chargerCatalogue();
    filtrerEtAfficherCatalogue();
  }
};

// Contrôle de saisie en temps réel (oninput)
const verifierSaisieTitre = (champ) => {
  if (champ.value.trim().length > 0 && champ.value.trim().length < 2) {
    champ.classList.add("border-red-500");
  } else {
    champ.classList.remove("border-red-500");
  }
};

// ==========================================
// 5. INITIALISATION
// ==========================================
const initialiserApp = () => {
  chargerCatalogue();
  filtrerEtAfficherCatalogue();
};

// Lancement au chargement de la page
document.addEventListener("DOMContentLoaded", initialiserApp);