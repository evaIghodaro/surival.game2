class Animal {
    constructor(x, y, taille) {
        this.x = x;
        this.y = y;
        this.taille = taille;
        this.sante = 100; // Santé initiale de l'animal
        this.vitesse = 1; // Initial speed
        this.moveDelay = Math.floor(Math.random() * (120 - 30) + 30); // Random delay between moves
        this.lastMoveTime = 0; // Last move time
    }

    dessiner() {
        if (this.sante > 0) { // Ne dessiner que si l'animal est vivant
            fill(0, 102, 153); // Couleur bleue pour l'animal
            ellipse(this.x, this.y, this.taille, this.taille);
            // Dessiner la barre de vie
            fill(255, 0, 0);
            rect(this.x - this.taille / 2, this.y - this.taille, this.taille, 5);
            fill(0, 255, 0);
            let healthWidth = Math.max(0, this.taille * (this.sante / 100));
            rect(this.x - this.taille / 2, this.y - this.taille, healthWidth, 5);

            // Afficher la santé en texte à côté de la barre de vie
            fill(255);
            textSize(12);
            text(`${Math.max(0, this.sante)}/100`, this.x + this.taille / 2 + 5, this.y - this.taille + 5);
        }
    }

    deplacerVers(joueur) {
        if (this.sante > 0 && frameCount - this.lastMoveTime > this.moveDelay) { // Ne déplacer que si l'animal est vivant
            let angle = atan2(joueur.y - this.y, joueur.x - this.x);
            this.x += cos(angle) * this.vitesse;
            this.y += sin(angle) * this.vitesse;
            this.x = constrain(this.x, 0, width);
            this.y = constrain(this.y, 0, height);
            this.lastMoveTime = frameCount; // Mettre à jour le dernier temps de déplacement
        }
    }

    attaquer(joueur) {
        if (this.sante > 0) { // Ne pas attaquer si l'animal est mort
            let distance = dist(this.x, this.y, joueur.x, joueur.y);
            if (distance < this.taille / 2 + joueur.taille / 2) {
                joueur.sante -= 5;
            }
        }
    }
}