let carteData;

function preload() {
    carteData = loadTable('map.tmx', 'csv'); // Chargez la carte en format CSV
}

class Carte {
    constructor() {
        this.data = carteData.getArray();
    }

    dessiner() {
        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                let tile = this.data[y][x];
                if (tile != 0) {
                    fill(100); // Couleur des tuiles non nulles
                    rect(x * 32, y * 32, 32, 32); // Dessiner chaque tuile
                }
            }
        }
    }
}