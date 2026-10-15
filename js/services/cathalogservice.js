import { BD } from "../models/BD.js";

export class CatalogueService {

    static async chargerJSON() {

        try {

            const reponse = await fetch(
                "../../data/bd.json"
            );

            if (!reponse.ok) {
                throw new Error(
                    "Erreur de chargement"
                );
            }

            const donnees = await reponse.json();

            return donnees.map(
                bd => new BD(
                    bd.titre,
                    bd.version,
                    bd.annee,
                    bd.prix,
                    bd.pages
                )
            );

        } catch (erreur) {

            console.error(erreur);
            return [];

        }
    }
}