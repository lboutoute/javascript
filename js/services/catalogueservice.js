
const CLE_CATALOGUE = "catalogue_bd_v1";

const catalogueInitial = [];

let catalogue = [];


// ==========================================
// 1. CHARGEMENT ET SAUVEGARDE
// ==========================================

const chargerCatalogue = () => {

    catalogue = localService.charger(
        CLE_CATALOGUE,
        catalogueInitial
    );

    if (!Array.isArray(catalogue)) {
        catalogue = [];
    }

};


const sauvegarderCatalogue = () => {

    return localService.sauvegarder(
        CLE_CATALOGUE,
        catalogue
    );

};


// ==========================================
// 2. GESTION DES BANDES DESSINÉES
// ==========================================

const ajouterBDCatalogue = (bd) => {

    catalogue = [...catalogue, bd];

    sauvegarderCatalogue();

};


const supprimerBDCatalogue = (id) => {

    catalogue = catalogue.filter(
        bd => bd.id !== id
    );

    sauvegarderCatalogue();

};


const obtenirCatalogue = () => {

    return [...catalogue];

};


const reinitialiserCatalogue = () => {

    catalogue = [];

    localService.supprimer(CLE_CATALOGUE);

};


// ==========================================
// 3. FILTRE DU NOMBRE DE PAGES
// ==========================================

const determinerLongueur = (pages) => {

    if (pages <= 100) {
        return "peu";
    }

    if (pages <= 300) {
        return "normal";
    }

    return "beaucoup";

};


// ==========================================
// 4. RECHERCHE ET FILTRES
// ==========================================

const filtrerCatalogue = (recherche, genre, longueur) => {

    return catalogue.filter(bd => {

        // Recherche par titre ou version
        const correspondRecherche =
            bd.titre.toLowerCase().includes(recherche) ||
            bd.version.toLowerCase().includes(recherche);

        // Filtre par genre
        const correspondGenre =
            genre === "tous" || bd.genre === genre;

        // Filtre par nombre de pages
        const correspondLongueur =
            longueur === "tous" ||
            determinerLongueur(bd.pages) === longueur;

        return (
            correspondRecherche &&
            correspondGenre &&
            correspondLongueur
        );

    });

};


// ==========================================
// 5. STATISTIQUES
// ==========================================

const calculerStatistiques = (collection) => {

    const total = collection.length;

    if (total === 0) {

        return {
            total: 0,
            valeur: 0,
            moyen: 0,
            maximum: 0,
            minimum: 0
        };

    }

    // Calcul de la valeur totale avec reduce()
    const valeur = collection.reduce(
        (acc, bd) => acc + bd.prix,
        0
    );

    // Calcul du prix moyen
    const moyen = valeur / total;

    // Récupération des prix avec map()
    const prix = collection.map(bd => bd.prix);

    // Calcul du maximum et du minimum
    const maximum = Math.max(...prix);
    const minimum = Math.min(...prix);

    return {
        total,
        valeur,
        moyen,
        maximum,
        minimum
    };

};
