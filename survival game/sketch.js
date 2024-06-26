let joueur;
let carte;
let animaux = [];
let inventaire;
let animalTue = null;
let inventaireVisible = false;
let afficherMessageInventaire = true;
let afficherPresentation = true;
let messageInventaireAffiche = true;

function preload() {
    carteData = loadTable('map.tmx', 'csv'); // Chargez la carte en format CSV
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    joueur = new Joueur(width / 2, height / 2);
    carte = new Carte();
    inventaire = new Inventaire();

    // Générer plusieurs animaux de manière aléatoire sur la carte
    for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        animaux.push(new Animal(x, y, 30));
        console.log(`Animal créé à la position (${x}, ${y})`);
    }

    // Masquer la présentation et démarrer le jeu après 20 secondes
    setTimeout(() => {
        afficherPresentation = false;
        messageInventaireAffiche = false; // Masquer le message après la présentation
    }, 5000);
}

function draw() {
    if (afficherPresentation) {
        afficherPageDePresentation();
    } else {
        carte.dessiner();
        joueur.deplacer(carte.arbres);
        joueur.dessiner();
        animaux.forEach(animal => {
            animal.deplacerVers(joueur); // Les animaux se déplacent vers le joueur
            animal.dessiner();
            animal.attaquer(joueur); // Les animaux attaquent le joueur
        });
        if (inventaireVisible) {
            inventaire.dessiner();
        }
        joueur.afficherStats();

        if (afficherMessageInventaire && messageInventaireAffiche) {
            fill(0, 102, 204);
            rect(10, height - 50, 450, 40, 5);
            fill(255);
            textSize(20);
            text("Appuyez sur 'E' pour afficher/masquer l'inventaire", 20, height - 25);
        }

        if (animalTue) {
            fill(255);
            textSize(16);
            textAlign(CENTER);
            text("Appuyez sur 'A' pour consommer, 'B' pour capturer", width / 2, height / 2);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function afficherPageDePresentation() {
    background(0); // Fond noir
    fill(255); // Texte blanc
    textAlign(CENTER);
    textSize(32);
    text("Bienvenue dans le Jeu de Survie dans la Jungle", width / 2, height / 2 - 100);

    textSize(24);
    text("Vous êtes perdu dans la jungle et devez survivre pendant 2 jours.", width / 2, height / 2 - 50);
    text("Pour cela, vous devez tuer des ennemis pour devenir plus résistant", width / 2, height / 2);
    text("et vous nourrir de fruits pour gagner en puissance.", width / 2, height / 2 + 50);
    text("Utilisez les touches fléchées pour vous déplacer.", width / 2, height / 2 + 100);
    text("Appuyez sur 'E' pour afficher/masquer l'inventaire.", width / 2, height / 2 + 150);
    textSize(16);
    text("La partie commencera dans quelques secondes...", width / 2, height / 2 + 200);
}

function keyPressed() {
    if (key === 'E') {
        inventaireVisible = !inventaireVisible;
    } else if (animalTue && key === 'A') {
        joueur.consommer(animalTue);
        animalTue = null; // Réinitialiser animalTue après consommation
    } else if (animalTue && key === 'B') {
        joueur.ajouterDansInventaire(animalTue);
        joueur.gagnerXp(10); // Gagner de l'XP pour avoir capturé un animal
        animalTue = null; // Réinitialiser animalTue après capture
    }
}

function mousePressed() {
    animaux.forEach(animal => {
        let resultatAttaque = joueur.attaquer(animal);
        if (resultatAttaque === 'tué') {
            animal.sante = 0; // Marquer l'animal comme tué
            animalTue = animal; // Marquer l'animal comme tué
            joueur.gagnerXp(10); // Gagner de l'XP pour avoir tué un animal
        }
    });
}