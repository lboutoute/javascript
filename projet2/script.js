
// ==========================================
// ÉCRAN DE DÉMARRAGE
// ==========================================

const ecranIntro = document.querySelector("#ecran-intro");
const texteIntro = document.querySelector("#texte-intro");

// Après 7 secondes, changer le texte
setTimeout(() => {

    texteIntro.style.color = "#00ffcc";
    texteIntro.style.animation = "none";
    texteIntro.style.opacity = "0";

    texteIntro.textContent = "BIENVENUE SUR SOLAR CREATOR";

    texteIntro.style.animation = "apparition 2s forwards";

}, 4000);


// Après 13 secondes, faire disparaître l'écran
setTimeout(() => {

    ecranIntro.classList.add("disparition");

}, 6000);


// Après 15 secondes, retirer l'écran
setTimeout(() => {

    ecranIntro.style.display = "none";

}, 8000);





/* =========================
   DONNEES DU SYSTEME SOLAIRE
========================= */

let solarSystem = {
    name: "Mon système solaire",

    star: {
        name: "Soleil jaune",
        type: "Naine jaune",
        color: "#ffce70",
        size: 130
    },

    planets: []
};


/* =========================
   SAUVEGARDE
========================= */

function saveSolarSystem() {

    localStorage.setItem(
        "solarCreator",
        JSON.stringify(solarSystem)
    );

    document.getElementById("saveStatus").textContent =
        "● Sauvegardé";
}


/* =========================
   CHARGEMENT
========================= */

function loadSolarSystem() {

    const saved = localStorage.getItem("solarCreator");

    if (saved) {
        try {
            const data = JSON.parse(saved);

            if (
                data &&
                typeof data.name === "string" &&
                data.star &&
                typeof data.star.color === "string" &&
                Array.isArray(data.planets) &&
                data.planets.length <= 10
            ) {
                solarSystem = data;
                // Valeurs par défaut pour les anciennes sauvegardes
solarSystem.star.type ||= "Naine jaune";
solarSystem.star.size ||= 130;
solarSystem.star.name ||= "Soleil jaune";
// Ajouter une vitesse aux anciennes planètes
solarSystem.planets.forEach(planet => {
    if (!planet.speed) {
        planet.speed = Math.random() * 40 + 10;
    }
});
            }
            
        } catch (error) {
            console.error("Sauvegarde invalide", error);
        }
    }

    document.getElementById("systemName").value =
        solarSystem.name;

    renderAll();
}


/* =========================
   AFFICHAGE DES CARTES
========================= */

function renderPlanets() {

    const container =
        document.getElementById("planetContainer");

    container.replaceChildren();

    solarSystem.planets.forEach(planet => {

        const card = document.createElement("article");
        card.className = "planet-card";

        const preview = document.createElement("span");
        preview.className = "planet-preview";
        preview.style.backgroundColor = planet.color;
        preview.style.width = planet.size + "px";
        preview.style.height = planet.size + "px";

        const title = document.createElement("h3");
        title.textContent = planet.name;

        const type = document.createElement("p");
        type.textContent = planet.type;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Supprimer";

        deleteBtn.addEventListener("click", () => {
            deletePlanet(planet.id);
        });

        card.append(preview, title, type, deleteBtn);

        container.appendChild(card);
    });

    document.getElementById("planetCount").textContent =
        solarSystem.planets.length + " / 10 planètes";

    document.getElementById("addPlanetBtn").disabled =
        solarSystem.planets.length >= 10;
}


/* =========================
   CREATION D'UNE PLANETE
========================= */

function addPlanet() {

    if (solarSystem.planets.length >= 10) {
        alert("Maximum 10 planètes !");
        return;
    }

    const name =
        document.getElementById("planetName").value.trim();

    if (!name) {
        alert("Donne un nom à ta planète !");
        return;
    }

    const planet = {
    id: crypto.randomUUID(),
    name: name,
    type: document.getElementById("planetType").value,
    color: document.getElementById("planetColor").value,
    size: Number(document.getElementById("planetSize").value),

    // Vitesse de rotation aléatoire
    speed: Math.random() * 40 + 10
};

    solarSystem.planets.push(planet);

    closeModal();
    saveSolarSystem();
    renderAll();

    document.getElementById("planetName").value = "";
}


/* =========================
   SUPPRESSION
========================= */

function deletePlanet(id) {

    solarSystem.planets =
        solarSystem.planets.filter(
            planet => planet.id !== id
        );

    saveSolarSystem();
    renderAll();
}


/* =========================
   VUE SPATIALE
========================= */

function getPlanetGlow(type) {

    const glows = {
        "Gazeuse": "rgba(250, 213, 165, 0.47)",
        "Glacée": "rgba(0, 183, 255, 0.38)",
        "Volcanique": "rgba(255, 34, 0, 0.4)",
        "Terrestre": "rgba(27, 61, 39, 0.36)",
        "Désertique": "rgba(136, 107, 64, 0.34)"
    };

    return glows[type] || "rgba(255, 255, 255, 0.5)";
}

function getStarGlow(type) {

    const glows = {
        "Naine rouge": "#ff392b",
        "Naine jaune": "#ffce70",
        "Étoile bleue": "#399bff",
        "Géante rouge": "#ff542e",
        "Géante bleue": "#388cff",
        "Naine blanche": "#e8f5ff"
    };

    return glows[type] || "#ffffff";
}

function renderSolarView() {

    const container =
        document.getElementById("orbitContainer");

    const star =
        document.getElementById("starVisual");

    const starColor = solarSystem.star.color;
const starGlow = getStarGlow(solarSystem.star.type);
star.style.setProperty("--star-glow", starGlow);


star.style.backgroundColor = starColor;

star.style.width = solarSystem.star.size + "px";
star.style.height = solarSystem.star.size + "px";

star.style.boxShadow = `
    0 0 20px ${starGlow},
    0 0 45px ${starGlow},
    0 0 80px ${starGlow}
`;

    // Supprimer les anciennes orbites
    container.querySelectorAll(".orbit").forEach(
        orbit => orbit.remove()
    );

    solarSystem.planets.forEach((planet, index) => {

        const orbit = document.createElement("span");
        orbit.className = "orbit";

        const orbitSize = 300 + index * 60;

        orbit.style.width = orbitSize + "px";
        orbit.style.height = orbitSize + "px";

        // Vitesse propre à chaque planète
const baseSpeed = Number(planet.speed) || (10 + index * 20);
        
orbit.dataset.baseSpeed = baseSpeed;
orbit.style.animationDuration = baseSpeed + "s";

        const planetVisual = document.createElement("span");
        planetVisual.className = "orbit-planet";

        // Intensité de la perturbation propre à chaque planète
planetVisual.dataset.offsetX = 0;
planetVisual.dataset.offsetY = 0;

planetVisual.dataset.randomX = Math.random() * 2 - 1;
planetVisual.dataset.randomY = Math.random() * 2 - 1;

        planetVisual.style.width = planet.size / 2 + "px";
        planetVisual.style.height = planet.size / 2 + "px";
        planetVisual.style.backgroundColor = planet.color;

        const glowColor = getPlanetGlow(planet.type);

        planetVisual.style.boxShadow =
            `0 0 15px ${glowColor},
             0 0 30px ${glowColor},
             0 0 50px ${glowColor}`;

        // Positionner la planète sur son orbite
        planetVisual.style.left = "100%";
        planetVisual.style.top = "50%";

        // Ajouter la planète à son orbite
        orbit.appendChild(planetVisual);

        // Ajouter l'orbite au système solaire
        container.appendChild(orbit);

    });

}


/* =========================
   RENDU GENERAL
========================= */

function renderAll() {
    renderPlanets();
    renderStarSettings();
    renderSolarView();
}

function renderStarSettings() {

    document.getElementById("starName").value =
        solarSystem.star.name;

    document.getElementById("starType").value =
        solarSystem.star.type;

    document.getElementById("starColor").value =
        solarSystem.star.color;

    document.getElementById("starSize").value =
        solarSystem.star.size;

    document.getElementById("starSizeValue").textContent =
        solarSystem.star.size + " px";
}


// ==========================================
// INTERACTION AVEC LES ORBITES
// ==========================================


// ==========================================
// INTERACTION AVEC LES ORBITES
// ==========================================

const solarView = document.getElementById("solarView");

let isDragging = false;
let chaos = 0;

let lastMouseX = 0;
let lastMouseY = 0;


// Calculer la vitesse actuelle des orbites
function updateOrbitSpeeds() {

    const orbits = solarView.querySelectorAll(".orbit");

    orbits.forEach(orbit => {

        const baseSpeed = Number(orbit.dataset.baseSpeed);
        const newSpeed = baseSpeed / (1 + chaos);

        orbit.style.animationDuration = newSpeed + "s";

    });
}


// Quand on appuie sur la souris
solarView.addEventListener("pointerdown", (event) => {

    if (event.button !== 0) return;

    isDragging = true;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    solarView.classList.add("is-pressed");

});


// Quand on bouge la souris en maintenant le clic
document.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    // Distance parcourue depuis le dernier mouvement
    const dxMouse = event.clientX - lastMouseX;
    const dyMouse = event.clientY - lastMouseY;

    const movement = Math.sqrt(
        dxMouse * dxMouse + dyMouse * dyMouse
    );

    // Mémoriser la nouvelle position
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // Accélération uniquement si le mouvement est important
    if (movement > 100) {
    chaos = Math.min(chaos + 0.15, 8);
}

    // Déplacement des orbites
    const star = document.getElementById("starVisual");
    const starRect = star.getBoundingClientRect();

    const centerX = starRect.left + starRect.width / 2;
    const centerY = starRect.top + starRect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance !== 0) {

        const directionX = -dx / distance;
        const directionY = -dy / distance;

        const orbits = solarView.querySelectorAll(".orbit");

        orbits.forEach((orbit, index) => {
// Intensité du décalage selon la distance au soleil
const influence = Math.min(distance / 200, 1);

// Les orbites extérieures bougent davantage
const force = (index + 1) * 30 * influence;

const x = directionX * force;
const y = directionY * force;

            orbit.style.translate = `${x}px ${y}px`;

        });

    }

    // Appliquer les nouvelles vitesses
    updateOrbitSpeeds();

});


// Récupération progressive de la vitesse
function recoverSpeed() {

    if (isDragging) return;

    chaos = Math.max(chaos - 0.02, 0);

    updateOrbitSpeeds();

    if (chaos > 0) {
        requestAnimationFrame(recoverSpeed);
    }

}


// Relâchement de la souris
function stopDragging() {

    if (!isDragging) return;

    isDragging = false;

    solarView.classList.remove("is-pressed");

    const orbits = solarView.querySelectorAll(".orbit");

    orbits.forEach(orbit => {

        orbit.style.translate = "0px 0px";

        orbit.style.transition =
            "translate 0.8s cubic-bezier(0.2, 0.8, 0.3, 1)";

    });

    requestAnimationFrame(recoverSpeed);

}

document.addEventListener("pointerup", stopDragging);
document.addEventListener("pointercancel", stopDragging);


/* =========================
   MODALE
========================= */

const modal = document.getElementById("planetModal");

function openModal() {
    if (solarSystem.planets.length >= 10) return;

    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

document.getElementById("addPlanetBtn")
    .addEventListener("click", openModal);

document.getElementById("cancelBtn")
    .addEventListener("click", closeModal);

document.getElementById("confirmBtn")
    .addEventListener("click", addPlanet);


/* =========================
   NOM DU SYSTEME
========================= */

document.getElementById("systemName")
    .addEventListener("input", event => {

        solarSystem.name = event.target.value;

        saveSolarSystem();
    });


/* =========================
   INITIALISATION
========================= */





// MODIFICATION DE L'ÉTOILE

document.getElementById("starName")
    .addEventListener("input", event => {

        solarSystem.star.name = event.target.value;
        saveSolarSystem();
    });


document.getElementById("starType")
    .addEventListener("change", event => {

        solarSystem.star.type = event.target.value;

        saveSolarSystem();
        renderSolarView();
    });


document.getElementById("starColor")
    .addEventListener("input", event => {

        solarSystem.star.color = event.target.value;

        saveSolarSystem();
        renderSolarView();
    });


document.getElementById("starSize")
    .addEventListener("input", event => {

        solarSystem.star.size = Number(event.target.value);

        document.getElementById("starSizeValue").textContent =
            solarSystem.star.size + " px";

        renderSolarView();
        saveSolarSystem();
    });


    
loadSolarSystem();

