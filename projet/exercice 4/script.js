const panier = [
  { nom: 'Produit 1', prix: 10 },
  { nom: 'Produit 2', prix: 20 },
  { nom: 'Produit 3', prix: 30 },
];


const calculerTotalParProduit = () => {
  const out = document.querySelector('#total-panier');
  const total = panier.reduce((somme, item) => somme + item.prix, 0);
    out.innerHTML = `Le total du panier est de ${total} €`};


    const sauvegarderTheme = (couleur) => {
        sessionStorage.setItem('pref-theme', couleur);
        changerTheme();
    }

    const changerTheme = () => {
        const out = document.querySelector('#theme-actif');
        out.innerHTML = sessionStorage.getItem('pref-theme') ?? "pas de theme choisi";
    };

    changerTheme();



const sauvegarderBrouillon = (contenu) => {
    sessionStorage.setItem('brouillon_note', contenu);
};

const restaurerBrouillon = () => {
    const out = document.querySelector('#zone-note');
    out.value = sessionStorage.getItem('brouillon_note') ?? "";
};

const sauvegarderProfil = (e) => {
    e.preventDefault();
    const nom = document.querySelector('#nom-user').value;
    const age = document.querySelector('#age-user').value;
    const toto = { nom : nom, age: age };
    localStorage.setItem('toto', JSON.stringify(toto));

};

const lireProfil = () => {
    const toto = JSON.parse(localStorage.getItem('toto'));
    const out = document.querySelector('#affichage-profil');

    out.innerHTML = `${toto.nom}, ${toto.age} ans`;
};
