//champs formulaire

const formimput = document.querySelector('#formulaire-de-bd');
const nombdimput = document.querySelector('#nom');
const nbpagesbdimput = document.querySelector('#nbpages');
const anneebdimput = document.querySelector('#annee');
const prixbdimput = document.querySelector('#prix');

//champs card

const formZone = document.querySelector('#formulaire-de-bd-zone');
const nombdZone = document.querySelector('#nom-zone');
const nbpagesbdZone = document.querySelector('#nbpages-zone');
const anneebdZone = document.querySelector('#annee-zone');
const prixbdZone = document.querySelector('#prix-zone');

//fonction modifer

function modifierbase(event) {
    event.preventDefault();
    nombdZone.textContent = nombdimput.value;
    nbpagesbdZone.textContent = nbpagesbdimput.value;
    anneebdZone.textContent = anneebdimput.value;
    prixbdZone.textContent = prixbdimput.value;
}


