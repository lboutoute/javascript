import { BD } from "../models/BD.js";

export class StorageService {

    static sauvegarder(catalogue) {
        localStorage.setItem(
            "catalogueBD",
            JSON.stringify(catalogue)
        );
    }

    static charger() {

        const data = JSON.parse(
            localStorage.getItem("catalogueBD")
        ) || [];

        return data.map(
            bd => new BD(
                bd.titre,
                bd.version,
                bd.annee,
                bd.prix,
                bd.pages
            )
        );
    }
}