export class BD {
    #prix;

    constructor(titre, version, annee, prix, pages) {
        this.titre = titre;
        this.version = version;
        this.annee = annee;
        this.prix = prix;
        this.pages = pages;
    }

    get prix() {
        return this.#prix;
    }

    set prix(valeur) {
        if (valeur < 0) {
            this.#prix = 0;
        } else {
            this.#prix = Number(valeur);
        }
    }

    afficher() {
        return `${this.titre} - ${this.prix} €`;
    }

    toJSON() {
        return {
            titre: this.titre,
            version: this.version,
            annee: this.annee,
            prix: this.prix,
            pages: this.pages
        };
    }
}