class Inventaire {
    constructor() {
        this.objets = [];
    }

    ajouter(animal) {
        this.objets.push(animal);
    }

    dessiner() {
        fill(255);
        rect(10, 10, 250, 200); // Adjusted size for more information
        fill(0);
        textSize(12);
        text("Inventaire:", 20, 30);

        for (let i = 0; i < this.objets.length; i++) {
            let animal = this.objets[i];
            text(`Animal ${i + 1} - Santé: ${animal.sante}`, 20, 50 + i * 40);
            text(`Score Gagné: 50`, 20, 65 + i * 40);
            text(`Force Gagnée: 5`, 20, 80 + i * 40);
            text(`Vitesse Gagnée: 1`, 20, 95 + i * 40);
        }
    }
}