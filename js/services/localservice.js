
const localService = {

    // Récupérer des données
    charger: (cle, valeurParDefaut) => {

        try {

            const donnees = localStorage.getItem(cle);

            if (donnees === null) {
                return valeurParDefaut;
            }

            return JSON.parse(donnees);

        } catch (erreur) {

            console.error("Erreur de chargement :", erreur);

            return valeurParDefaut;

        }

    },


    // Sauvegarder des données
    sauvegarder: (cle, donnees) => {

        try {

            localStorage.setItem(cle, JSON.stringify(donnees));
            return true;

        } catch (erreur) {

            console.error("Erreur de sauvegarde :", erreur);

            return false;

        }

    },


    // Supprimer des données
    supprimer: (cle) => {

        localStorage.removeItem(cle);

    }

};
