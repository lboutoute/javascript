function verifierMajorite(){
    const age = document.querySelector('#ageUtilisateur').value;
    const out = document.querySelector('#resultatMajorite');
    if (age >= 18){
        out.textContent = "majeur";
    }
    else{
        out.textContent = "mineur";
    }
}

function evaluerNote(){
    const note = document.querySelector('#noteExamen').value;
    const out = document.querySelector('#resultatAdmission');
    out.textContent = (note >= 10) ?  "admis" :"ajourné";
}

function obtenirMention() {
    const note = document.querySelector("#moyenneEtudiant").value;
    const out = document.querySelector("#affichageMention");
    if (note < 10){
        out.textContent = "Insuffisant";
    } else if (note < 12){
        out.textContent = "passable";
    }else if (note < 14){
        out.textContent = "assez bien";
    }else if (note < 16){
        out.textContent = "bien";
    }else if (note <-20){
        out.textContent = "tres bien";
    }
}

function genererTable() {
    let nombre = document.querySelector("#nombreTable").value;
    const out = document.querySelector("#affichageTable");
    let result = ";"
    for (let i = 1; i<=10; i++) {
        result += `${i} * ${table} = ${i * table}\n`; 
    }
    out.innerHTML = result;
}

function lancerDecompte(){
    let nombre = document.querySelector("#valeurDepart").value;
    const out = document.querySelector("#resultatDecompte");
    while(nombre >0){
        result += `${nombre}...`;
        nombre--;
    }
    result += "Décollage !";
    out.testContent = result;
}


function filtrerPairs(){
    let limpair = document.querySelector("#limitePairs").value;
    let i = 1;
    const out = document.querySelector("#listePairs");
    while(i <= limpair) {
        if (i % 2 === 0) {
            out.innerHTML += `${i} - `;
        }
        i++;
    }
    
}


function genererMotif() {
    const nombreLignes = document.querySelector("#nombreLignes").value;
    const out = document.querySelector("#affichageMotif");
    out.innerHTML = "";

 for(let ligne = 1; ligne <= nombreLignes; ligne++) {
    for(let etoile = 1; etoile <= ligne; etoile++) {
    out.innerHTML += "*";}
    out.innerHTML += "\n";
}
}