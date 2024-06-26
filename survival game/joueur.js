class Joueur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sante = 100;
        this.mana = 100; // Ajouter le mana
        this.score = 0;
        this.taille = 50;
        this.vitesse = 5;
        this.force = 10;
        this.inventaire = [];
        this.santeRegagnee = 0; // Suivi de la santé regagnée
        this.xp = 0; // Ajouter l'XP
        this.healthBarWidth = 50; // Largeur fixe de la barre de santé
        this.healthBarHeight = 5; // Hauteur fixe de la barre de santé
    }

    deplacer(arbres) {
        let newX = this.x;
        let newY = this.y;

        if (keyIsDown(LEFT_ARROW)) {
            newX -= this.vitesse;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            newX += this.vitesse;
        }
        if (keyIsDown(UP_ARROW)) {
            newY -= this.vitesse;
        }
        if (keyIsDown(DOWN_ARROW)) {
            newY += this.vitesse;
        }

        let collision = arbres.some(arbre => dist(newX, newY, arbre.x, arbre.y) < this.taille / 2 + 20);
        if (!collision) {
            this.x = constrain(newX, 0, width);
            this.y = constrain(newY, 0, height);
        }
    }

    dessiner() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.taille, this.taille);

        // Dessiner la barre de vie
        let healthBarX = this.x - this.healthBarWidth / 2;
        let healthBarY = this.y - this.taille - 10; // Position légèrement au-dessus du joueur
        fill(255, 0, 0);
        rect(healthBarX, healthBarY, this.healthBarWidth, this.healthBarHeight); // Fond de la barre de santé
        fill(0, 255, 0);
        let healthWidth = Math.max(0, this.healthBarWidth * (this.sante / 100));
        rect(healthBarX, healthBarY, healthWidth, this.healthBarHeight); // Proportion de santé

        // Afficher la santé en texte à côté de la barre de vie
        fill(255);
        textSize(12);
        text(`${Math.max(0, this.sante)}/100`, healthBarX + this.healthBarWidth + 5, healthBarY + this.healthBarHeight);

        // Afficher l'XP à côté du joueur
        textSize(12);
        fill(255, 255, 0);
        text(`XP: ${this.xp}`, this.x + this.taille / 2 + 10, this.y - this.taille / 2);

        // Afficher le mana du joueur
        textSize(12);
        fill(0, 0, 255);
        text(`Mana: ${this.mana}/100`, this.x + this.taille / 2 + 10, this.y + this.taille / 2);
    }

    attaquer(animal) {
        let distance = dist(this.x, this.y, animal.x, animal.y);
        if (distance < this.taille / 2 + animal.taille / 2) {
            animal.sante -= this.force;
            if (animal.sante <= 0) {
                return 'tué';
            }
            return 'touché';
        }
        return 'manqué';
    }

    consommer(animal) {
        if (animal.sante <= 0) {
            this.sante += 20;
            this.sante = Math.min(100, this.sante); // S'assurer que la santé ne dépasse pas 100
            this.santeRegagnee += 20; // Suivre la santé regagnée
            return true;
        }
        return false;
    }

    ajouterDansInventaire(animal) {
        this.inventaire.push(animal);
        this.score += 50;
        this.force += 5;
        this.vitesse += 1;
    }

    gagnerXp(xp) {
        this.xp += xp;
    }

    afficherStats() {
        push();
        resetMatrix(); // Réinitialiser la matrice de transformation pour dessiner les stats en coordonnées écran
        fill(0, 0, 255); // Changer la couleur des stats en bleu
        textSize(12);
        text(`Santé: ${this.sante}`, 10, 15);
        text(`Santé Regagnée: ${this.santeRegagnee}`, 10, 30);
        text(`Score: ${this.score}`, 10, 45);
        text(`Force: ${this.force}`, 10, 60);
        text(`Vitesse: ${this.vitesse}`, 10, 75);
        text(`XP: ${this.xp}`, 10, 90);
        text(`Mana: ${this.mana}`, 10, 105);
        pop();
    }
}