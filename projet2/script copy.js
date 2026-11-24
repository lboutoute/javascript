
// ==========================================
// ÉCRAN DE DÉMARRAGE
// ==========================================

const ecranIntro = document.querySelector("#ecran-intro");
const texteIntro = document.querySelector("#texte-intro");

setTimeout(() => {

    texteIntro.style.color = "#00ffcc";
    texteIntro.style.animation = "none";
    texteIntro.style.opacity = "0";

    texteIntro.textContent = "BIENVENUE SUR SOLAR CREATOR";

    texteIntro.style.animation = "apparition 2s forwards";

}, 4000);

setTimeout(() => {

    ecranIntro.classList.add("disparition");

}, 6000);

setTimeout(() => {

    ecranIntro.style.display = "none";

}, 8000);


// ==========================================
// DONNÉES DU SYSTÈME SOLAIRE
// ==========================================

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


// ==========================================
// RÉFÉRENCES HTML
// ==========================================

const solarView = document.getElementById("solarView");
const orbitContainer = document.getElementById("orbitContainer");
const starVisual = document.getElementById("starVisual");

const starMenu = document.getElementById("starMenu");
const starModal = document.getElementById("starModal");
const planetModal = document.getElementById("planetModal");
const planetDrawer = document.getElementById("planetDrawer");

const addPlanetBtn = document.getElementById("addPlanetBtn");


// ==========================================
// SAUVEGARDE
// ==========================================

function saveSolarSystem() {

    localStorage.setItem(
        "solarCreator",
        JSON.stringify(solarSystem)
    );

    document.getElementById("saveStatus").textContent =
        "● Sauvegardé";

}

// ==========================================
// RÉINITIALISATION DU SYSTÈME SOLAIRE
// ==========================================

function resetSolarSystem() {

    const confirmation = confirm(
        "Attention ! Cela va supprimer toutes tes planètes et réinitialiser ton étoile. Continuer ?"
    );

    if (!confirmation) return;

    // Réinitialiser les données
    solarSystem = {

        name: "Mon système solaire",

        star: {
            name: "Soleil jaune",
            type: "Naine jaune",
            color: "#ffce70",
            size: 130
        },

        planets: []

    };

    // Supprimer l'ancienne sauvegarde
    localStorage.removeItem("solarCreator");

    // Réinitialiser le nom du système
    document.getElementById("systemName").value =
        solarSystem.name;

    // Actualiser toute l'interface
    renderAll();

    // Enregistrer le nouveau système
    saveSolarSystem();

    // Fermer les menus éventuellement ouverts
    starMenu.classList.add("hidden");
    planetDrawer.classList.add("hidden");

}


// Bouton de réinitialisation
document.getElementById("resetSystemBtn")
    .addEventListener("click", resetSolarSystem);

// ==========================================
// CHARGEMENT
// ==========================================

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

                // Valeurs par défaut
                solarSystem.star.type ||= "Naine jaune";
                solarSystem.star.size ||= 130;
                solarSystem.star.name ||= "Soleil jaune";

                // Vitesse des anciennes planètes
                solarSystem.planets.forEach(planet => {

                    if (!planet.speed) {
                        planet.speed = Math.random() * 40 + 10;
                    }

                    if (!planet.id) {
                        planet.id = crypto.randomUUID();
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


// ==========================================
// AFFICHAGE DES CARTES
// ==========================================

function renderPlanets() {

    const container =
        document.getElementById("planetContainer");

    container.replaceChildren();

    solarSystem.planets.forEach(planet => {

        const card = document.createElement("article");

card.className = "planet-card";
card.draggable = true;
card.dataset.id = planet.id;

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
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", () => {
            deletePlanet(planet.id);
        });

        card.append(preview, title, type, deleteBtn);

        container.appendChild(card);

    });

    document.getElementById("planetCount").textContent =
        solarSystem.planets.length + " / 10 planètes";

    addPlanetBtn.disabled =
        solarSystem.planets.length >= 10;

}

// ==========================================
// DÉPLACEMENT DES CARTES
// ==========================================

const planetContainer = document.getElementById("planetContainer");

let draggedPlanetId = null;


// Début du déplacement
planetContainer.addEventListener("dragstart", event => {

    const card = event.target.closest(".planet-card");

    if (!card) return;

    draggedPlanetId = card.dataset.id;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedPlanetId);

    card.classList.add("dragging");

});


// Déplacement au-dessus des autres cartes
planetContainer.addEventListener("dragover", event => {

    event.preventDefault();

    const targetCard = event.target.closest(".planet-card");
    const draggedCard = planetContainer.querySelector(".dragging");

    if (!targetCard || !draggedCard || targetCard === draggedCard) {
        return;
    }

    const position = targetCard.getBoundingClientRect();
    const middle = position.top + position.height / 2;

    if (event.clientY < middle) {

        planetContainer.insertBefore(draggedCard, targetCard);

    } else {

        planetContainer.insertBefore(draggedCard, targetCard.nextSibling);

    }

});


// Enregistrer le nouvel ordre
planetContainer.addEventListener("drop", event => {

    event.preventDefault();

    const newOrder = [
        ...planetContainer.querySelectorAll(".planet-card")
    ].map(card => card.dataset.id);

    solarSystem.planets.sort((a, b) => {

        return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);

    });

    draggedPlanetId = null;

    saveSolarSystem();

    renderAll();

});


// Fin du déplacement
planetContainer.addEventListener("dragend", () => {

    draggedPlanetId = null;

    planetContainer.querySelectorAll(".planet-card").forEach(card => {

        card.classList.remove("dragging");

    });

});

// ==========================================
// CRÉATION D'UNE PLANÈTE
// ==========================================

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

        speed: Math.random() * 40 + 10

    };

    solarSystem.planets.push(planet);

    closePlanetModal();

    saveSolarSystem();

    renderAll();

    document.getElementById("planetName").value = "";

}


// ==========================================
// SUPPRESSION D'UNE PLANÈTE
// ==========================================

function deletePlanet(id) {

    solarSystem.planets =
        solarSystem.planets.filter(
            planet => planet.id !== id
        );

    saveSolarSystem();

    renderAll();

}


// ==========================================
// HALOS LUMINEUX
// ==========================================

function getPlanetGlow(type) {

    const glows = {

        "Gazeuse": "rgba(250, 213, 165, 0.47)",
        "Glacée": "rgba(0, 183, 255, 0.38)",
        "Volcanique": "rgba(255, 34, 0, 0.4)",
        "Tellurique": "rgba(27, 61, 39, 0.36)",
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


// ==========================================
// AFFICHAGE DU SYSTÈME SOLAIRE
// ==========================================

function renderSolarView() {

    const starColor = solarSystem.star.color;
    const starGlow = getStarGlow(solarSystem.star.type);

    starVisual.style.setProperty("--star-glow", starGlow);

    starVisual.style.backgroundColor = starColor;

    starVisual.style.width = solarSystem.star.size + "px";
    starVisual.style.height = solarSystem.star.size + "px";

    starVisual.style.boxShadow = `
        0 0 20px ${starGlow},
        0 0 45px ${starGlow},
        0 0 80px ${starGlow}
    `;

    // Retirer les anciennes orbites
    orbitContainer.querySelectorAll(".orbit").forEach(orbit => {
        orbit.remove();
    });

    // Créer les nouvelles orbites
    solarSystem.planets.forEach((planet, index) => {

        const orbit = document.createElement("span");
        orbit.className = "orbit";

        const orbitSize = 300 + index * 60;

        orbit.style.width = orbitSize + "px";
        orbit.style.height = orbitSize + "px";

        const baseSpeed =
            Number(planet.speed) || (10 + index * 20);

        orbit.dataset.baseSpeed = baseSpeed;
        orbit.style.animationDuration = baseSpeed + "s";

        const planetVisual = document.createElement("span");
        planetVisual.className = "orbit-planet";

        planetVisual.style.width = planet.size / 2 + "px";
        planetVisual.style.height = planet.size / 2 + "px";

        planetVisual.style.backgroundColor = planet.color;

        const glowColor = getPlanetGlow(planet.type);

        planetVisual.style.boxShadow = `
            0 0 15px ${glowColor},
            0 0 30px ${glowColor},
            0 0 50px ${glowColor}
        `;

        planetVisual.style.left = "100%";
        planetVisual.style.top = "50%";

        orbit.appendChild(planetVisual);

        orbitContainer.appendChild(orbit);

    });

}


// ==========================================
// PERSONNALISATION DE L'ÉTOILE
// ==========================================

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
// RENDU GÉNÉRAL
// ==========================================

function renderAll() {

    renderPlanets();

    renderStarSettings();

    renderSolarView();

}


// ==========================================
// INTERACTION AVEC LES ORBITES
// ==========================================

let isDragging = false;
let chaos = 0;

let lastMouseX = 0;
let lastMouseY = 0;


// Calcul des vitesses
function updateOrbitSpeeds() {

    const orbits = solarView.querySelectorAll(".orbit");

    orbits.forEach(orbit => {

        const baseSpeed = Number(orbit.dataset.baseSpeed);

        const newSpeed = baseSpeed / (1 + chaos);

        orbit.style.animationDuration = newSpeed + "s";

    });

}


// Début du mouvement
solarView.addEventListener("pointerdown", event => {

    if (event.button !== 0) return;

    // Ne pas déclencher le déplacement sur le Soleil ou son menu
    if (event.target.closest("#starVisual, #starMenu")) return;

    isDragging = true;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    solarView.classList.add("is-pressed");

});


// Mouvement de la souris
document.addEventListener("pointermove", event => {

    if (!isDragging) return;

    const dxMouse = event.clientX - lastMouseX;
    const dyMouse = event.clientY - lastMouseY;

    const movement = Math.sqrt(
        dxMouse * dxMouse + dyMouse * dyMouse
    );

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // Accélération progressive
    if (movement > 8) {

        chaos = Math.min(chaos + 0.15, 8);

    }

    const starRect = starVisual.getBoundingClientRect();

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

            // Plus le curseur est proche du Soleil,
            // moins le décalage est important.
            const influence = Math.min(distance / 200, 1);

            const force = (index + 1) * 30 * influence;

            const x = directionX * force;
            const y = directionY * force;

            orbit.style.translate = `${x}px ${y}px`;

        });

    }

    updateOrbitSpeeds();

});


// Retour progressif à la vitesse normale
function recoverSpeed() {

    if (isDragging) return;

    chaos = Math.max(chaos - 0.02, 0);

    updateOrbitSpeeds();

    if (chaos > 0) {
        requestAnimationFrame(recoverSpeed);
    }

}


// Fin du mouvement
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


// ==========================================
// FENÊTRE DE CRÉATION D'UNE PLANÈTE
// ==========================================

function openPlanetModal() {

    if (solarSystem.planets.length >= 10) return;

    starMenu.classList.add("hidden");

    document.getElementById("planetName").value = "";

    planetModal.showModal();

}


function closePlanetModal() {

    if (planetModal.open) {
        planetModal.close();
    }

}


addPlanetBtn.addEventListener("click", openPlanetModal);

document.getElementById("cancelBtn")
    .addEventListener("click", closePlanetModal);

document.getElementById("confirmBtn")
    .addEventListener("click", addPlanet);


// ==========================================
// NOM DU SYSTÈME
// ==========================================

document.getElementById("systemName")
    .addEventListener("input", event => {

        solarSystem.name = event.target.value;

        saveSolarSystem();

    });


// ==========================================
// MODIFICATION DE L'ÉTOILE
// ==========================================

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


// ==========================================
// MENU DU SOLEIL
// ==========================================

// Ouvrir ou fermer le menu
starVisual.addEventListener("click", event => {

    event.stopPropagation();

    starMenu.classList.toggle("hidden");

});

// Fermer le menu si on clique à l'extérieur
document.addEventListener("click", event => {

    if (
        !event.target.closest("#starMenu") &&
        !event.target.closest("#starVisual")
    ) {

        starMenu.classList.add("hidden");

    }

});

// Personnaliser l'étoile
document.getElementById("editStarBtn")
    .addEventListener("click", () => {

        starMenu.classList.add("hidden");

        starModal.showModal();

    });


// Fermer la personnalisation
document.getElementById("closeStarModal")
    .addEventListener("click", () => {

        starModal.close();

    });


// ==========================================
// PANNEAU DES PLANÈTES
// ==========================================

// Ouvrir les cartes
function openPlanetDrawer() {

    planetDrawer.classList.remove("hidden");

    starMenu.classList.add("hidden");

}


// Fermer les cartes
function closePlanetDrawer() {

    planetDrawer.classList.add("hidden");

}


// Ouvrir ou fermer avec la boussole
function togglePlanetDrawer() {

    if (planetDrawer.classList.contains("hidden")) {

        openPlanetDrawer();

    } else {

        closePlanetDrawer();

    }

}


// Bouton boussole
document.getElementById("planetBubble")
    .addEventListener("click", togglePlanetDrawer);


// Bouton "Gérer les planètes"
document.getElementById("openPlanetDrawerBtn")
    .addEventListener("click", openPlanetDrawer);


// Bouton croix
document.getElementById("closePlanetDrawer")
    .addEventListener("click", closePlanetDrawer);

// ==========================================
// INITIALISATION
// ==========================================

loadSolarSystem();
