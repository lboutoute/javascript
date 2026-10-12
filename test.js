// Sélection des éléments de la carte (affichage) via querySelector
const titreLivre = document.querySelector("#titre-livre");
const auteurAnneeLivre = document.querySelector("#auteur-annee-livre");
const prixLivre = document.querySelector("#prix-livre");

// Sélection du formulaire et des champs de saisie
const formulaireLivre = document.querySelector("#formulaire-livre");
const champTitre = document.querySelector("#champ-titre");
const champAuteur = document.querySelector("#champ-auteur");
const champAnnee = document.querySelector("#champ-annee");
const champPrix = document.querySelector("#champ-prix");

// Fonction appelée lors de la soumission du formulaire
function mettreAJourInfosLivre(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des données depuis les champs de saisie (.value)
  const nouveauTitre = champTitre.value;
  const nouvelAuteur = champAuteur.value;
  const nouvelleAnnee = champAnnee.value;
  const nouveauPrix = parseFloat(champPrix.value).toFixed(2);

  // Mise à jour de l'affichage dans la carte (.textContent)
  titreLivre.textContent = nouveauTitre;
  auteurAnneeLivre.textContent = `${nouvelAuteur} (${nouvelleAnnee})`;
  prixLivre.textContent = `${nouveauPrix} €`;
}
