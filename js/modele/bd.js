
const creerBD = (titre, version, annee, genre, prix, pages, image = "") => {

    return {
        id: "bd_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        titre: titre,
        version: version,
        annee: annee,
        genre: genre,
        prix: prix,
        pages: pages,
        image: image,
        dateAjout: new Date().toISOString()
    };

};
