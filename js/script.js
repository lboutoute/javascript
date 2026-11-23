
// ==========================================
// 2. AJOUT D'UNE BD
// ==========================================

const ajouterBD = async (event) => {

    event.preventDefault();

    const titre = document.querySelector("#champ-titre").value.trim();

    const version = document.querySelector("#champ-version").value.trim();

    const annee = Number(document.querySelector("#champ-annee").value);

    const genre = document.querySelector("#champ-genre").value;

    const prix = Number(document.querySelector("#champ-prix").value);

    const pages = Number(document.querySelector("#champ-page").value);

    const champImage = document.querySelector("#champ-image");

    // Vérification des données
    if (
        titre.length < 2 ||
        !version ||
        !Number.isInteger(annee) ||
        annee < 1 ||
        !genre ||
        !Number.isFinite(prix) ||
        prix < 0 ||
        !Number.isInteger(pages) ||
        pages < 1
    ) {

        alert("Veuillez vérifier les informations saisies.");

        return;

    }

    // Récupération de l'image
    let image = "";

    const fichier = champImage.files[0];

    if (fichier) {

        if (!fichier.type.startsWith("image/")) {

            alert("Veuillez sélectionner une image valide.");

            return;

        }

        // Limite de 1 Mo pour éviter de saturer LocalStorage
        if (fichier.size > 1024 * 1024) {

            alert("L'image ne doit pas dépasser 1 Mo.");

            return;

        }

        try {

            image = await lireImage(fichier);

        } catch (erreur) {

            alert("Impossible de lire cette image.");

            return;

        }

    }

    // Création de l'objet BD
    const nouvelleBD = creerBD(
        titre,
        version,
        annee,
        genre,
        prix,
        pages,
        image
    );

    // Ajout au catalogue
    ajouterBDCatalogue(nouvelleBD);

    afficherCatalogue();

    // Réinitialisation du formulaire
    document.querySelector("#formulaire-BD").reset();

    document.querySelector("#champ-titre").classList.remove("erreur");

};


// ==========================================
// 3. LECTURE D'UNE IMAGE
// ==========================================

const lireImage = (fichier) => {

    return new Promise((resolve, reject) => {

        const lecteur = new FileReader();

        lecteur.onload = () => resolve(lecteur.result);

        lecteur.onerror = () => reject(lecteur.error);

        lecteur.readAsDataURL(fichier);

    });

};


// ==========================================
// 4. AFFICHAGE DU CATALOGUE
// ==========================================

const afficherCatalogue = () => {
    const conteneur = document.querySelector("#catalogue");
    conteneur.innerHTML = "";

    const recherche = document.querySelector("#recherche-texte").value.toLowerCase().trim();
    const genre = document.querySelector("#filtre-genre").value;
    const longueur = document.querySelector("#filtre-pages").value;

    const resultats = filtrerCatalogue(recherche, genre, longueur);

    if (resultats.length === 0) {
        const message = document.createElement("p");
        message.className = "message-vide";

        if (catalogue.length === 0) {
            message.textContent = "Aucune BD dans le catalogue pour le moment.";
        } else {
            message.textContent = "Aucune BD ne correspond à votre recherche.";
        }

        conteneur.appendChild(message);
    }

    resultats.forEach(bd => {
        const carte = creerCarteBD(bd);
        conteneur.appendChild(carte);
    });

    mettreAJourStatistiques(resultats);
};


// ==========================================
// 5. CRÉATION D'UNE CARTE BD
// ==========================================

const creerCarteBD = (bd) => {

    const carte = document.createElement("article");

    carte.className = "carte-bd";

    // Image
    if (bd.image) {

        const image = document.createElement("img");

        image.src = bd.image;

        image.alt = "Couverture de " + bd.titre;

        image.className = "couverture";

        carte.appendChild(image);

    }

    // Informations
    const titre = document.createElement("h3");

    titre.textContent = bd.titre;

    const version = document.createElement("p");

    version.textContent = "Version : " + bd.version;

    const annee = document.createElement("p");

    annee.textContent = "Année : " + bd.annee;

    const genre = document.createElement("p");

    genre.textContent = "Genre : " + bd.genre;

    const pages = document.createElement("p");

    pages.textContent =
        "Pages : " + bd.pages + " (" +
        determinerLongueur(bd.pages) + ")";

    const prix = document.createElement("p");

    prix.className = "prix";

    prix.textContent = bd.prix.toFixed(2) + " €";

    const date = document.createElement("p");

    date.className = "date-ajout";

    date.textContent = "Ajoutée le : " +
        new Date(bd.dateAjout).toLocaleDateString("fr-FR");

    // Bouton de suppression
    const bouton = document.createElement("button");

    bouton.type = "button";

    bouton.textContent = "Supprimer";

    bouton.className = "btn-supprimer";

    bouton.onclick = () => {
        if (confirm("Voulez-vous supprimer cette BD ?")) {
            supprimerBDCatalogue(bd.id);
            afficherCatalogue();
        }
    };

    carte.appendChild(titre);
    carte.appendChild(version);
    carte.appendChild(annee);
    carte.appendChild(genre);
    carte.appendChild(pages);
    carte.appendChild(prix);
    carte.appendChild(date);
    carte.appendChild(bouton);

    return carte;
};


// ==========================================
// 6. STATISTIQUES
// ==========================================

const mettreAJourStatistiques = (collection) => {

    const stats = calculerStatistiques(collection);

    document.querySelector("#stat-total").textContent =
        stats.total;

    document.querySelector("#stat-valeur").textContent =
        stats.valeur.toFixed(2) + " €";

    document.querySelector("#stat-moyen").textContent =
        stats.moyen.toFixed(2) + " €";

    document.querySelector("#stat-min-max").textContent =
        "Max : " + stats.maximum.toFixed(2) +
        " € | Min : " + stats.minimum.toFixed(2) + " €";

};


// ==========================================
// 7. VÉRIFICATION DU TITRE
// ==========================================

const verifierSaisieTitre = (event) => {

    const champ = event.target;

    if (
        champ.value.trim().length > 0 &&
        champ.value.trim().length < 2
    ) {

        champ.classList.add("erreur");

    } else {

        champ.classList.remove("erreur");

    }

};


// ==========================================
// 8. RÉINITIALISATION DES FILTRES
// ==========================================

const reinitialiserFiltres = () => {

    document.querySelector("#recherche-texte").value = "";

    document.querySelector("#filtre-genre").value = "tous";

    document.querySelector("#filtre-pages").value = "peu";

    afficherCatalogue();

};


// ==========================================
// 9. RÉINITIALISATION DU CATALOGUE
// ==========================================

const reinitialiserDonnees = () => {

    if (confirm("Voulez-vous vraiment supprimer tout le catalogue ?")) {

        reinitialiserCatalogue();

        afficherCatalogue();

    }

};


// ==========================================
// 10. SYSTÈME DE DONS
// ==========================================

const CLE_DONS = "cagnotte_bd_v1";

const OBJECTIF_DONS = 1800;

let cagnotte = {
    total: 0,
    nbDons: 0
};


// Charger les dons
const chargerDons = () => {

    const donnees = localService.charger(CLE_DONS, {
        total: 0,
        nbDons: 0
    });

    if (
        donnees &&
        Number.isFinite(donnees.total) &&
        Number.isInteger(donnees.nbDons) &&
        donnees.total >= 0 &&
        donnees.nbDons >= 0
    ) {

        cagnotte = donnees;

    } else {

        cagnotte = {
            total: 0,
            nbDons: 0
        };

    }

};


// Ajouter un don
const faireUnDon = (event) => {

    event.preventDefault();

    const montant = Number(
        document.querySelector("#montant").value
    );

    if (!Number.isFinite(montant) || montant < 0) {

        alert("Veuillez saisir un montant valide.");

        return;

    }

    // Arrondi au centime
    const montantCentimes = Math.round(montant * 100);

    const nouveauTotal =
        Math.round(cagnotte.total * 100) + montantCentimes;

    cagnotte = {
        total: nouveauTotal / 100,
        nbDons: cagnotte.nbDons + 1
    };

    localService.sauvegarder(CLE_DONS, cagnotte);

    afficherDons();

    document.querySelector("#donation-form").reset();

    document.querySelector("#montant").value = 10;

};


// Afficher les dons
const afficherDons = () => {

    document.querySelector("#total").textContent =
        cagnotte.total.toFixed(2);

    const restant = Math.max(
        0,
        OBJECTIF_DONS - cagnotte.total
    );

    document.querySelector("#restant").textContent =
        restant.toFixed(2);

    document.querySelector("#nbDons").textContent =
        cagnotte.total;

};


// Réinitialiser la cagnotte
const reinitialiserCagnotte = () => {

    if (confirm("Voulez-vous réinitialiser la cagnotte ?")) {

        cagnotte = {
            total: 0,
            nbDons: 0
        };

        localService.supprimer(CLE_DONS);

        afficherDons();

    }

};


// ==========================================
// 11. LANCEMENT DE L'APPLICATION
// ==========================================

chargerCatalogue();
afficherCatalogue();

chargerDons();
afficherDons();

// Les propriétés onclick, oninput, onchange et onsubmit
// remplacent addEventListener.

document.querySelector("#formulaire-BD").onsubmit = ajouterBD;
document.querySelector("#recherche-texte").oninput = afficherCatalogue;
document.querySelector("#filtre-genre").onchange = afficherCatalogue;
document.querySelector("#filtre-pages").onchange = afficherCatalogue;
document.querySelector("#reset-filtres").onclick = reinitialiserFiltres;
document.querySelector("#reset-catalogue").onclick = reinitialiserDonnees;
document.querySelector("#champ-titre").oninput = verifierSaisieTitre;
document.querySelector("#donation-form").onsubmit = faireUnDon;
document.querySelector("#reset-dons").onclick = reinitialiserCagnotte;
