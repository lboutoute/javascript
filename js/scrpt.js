
fetch("./data/liste.json")

// ==========================================
// 1. formulaire de don
// ==========================================

const objectif = 1800;

let totalDons = Number(localStorage.getItem("totalDons")) || 0;
let nombreDons = Number(localStorage.getItem("nombreDons")) || 0;

function faireUnDon(event) {
    event.preventDefault();

    const montant = Number(document.getElementById("montant").value);

    if (montant <= 0) {
        return;
    }

    totalDons += montant;
    nombreDons = nombreDons + 1 ;

    // Sauvegarde
    localStorage.setItem("totalDons", totalDons);
    localStorage.setItem("nombreDons", nombreDons);

    mettreAJourAffichage();

    
}

function mettreAJourAffichage() {
    const restant = Math.max(objectif - totalDons, 0);

    document.getElementById("total").textContent = totalDons;
    document.getElementById("nbDons").textContent = nombreDons;
    document.getElementById("restant").textContent = restant;
}

// Affichage initial
mettreAJourAffichage();





