function afficherAccueil() {
    const prenom = document.querySelector('#prenomUtilisateur').value;
    const out = document.querySelector('#resultatAccueil');
    out.innerHTML = `bonjour, ${prenom}! Bienvenue sur notre site.`;
};

const calculerSurface = () => {

}

const afficherSurface = () {

        const larger = number(document.querySelector('#largeur').value);
        const longeur = number(document.querySelector('#longeur').value);
        const out = document.querySelector('#resultatSurface');
        out.innerHTML = `la surface est de ${larger * longeur} m²`;
}