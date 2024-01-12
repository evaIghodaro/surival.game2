package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// PBM représente une image PBM.
type PBM struct {
	data          [][]bool
	width, height int
	magicNumber   string
}

// ReadPBM lit une image PBM à partir d'un fichier et renvoie une struct qui représente l'image.
func ReadPBM(filename string) (*PBM, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	var pbm PBM

	// Lire le numéro magique
	scanner.Scan()
	pbm.magicNumber = scanner.Text()

	// Vérifier si le numéro magique est valide
	if pbm.magicNumber != "P1" && pbm.magicNumber != "P4" {
		return nil, fmt.Errorf("format PBM non pris en charge : %s", pbm.magicNumber)
	}

	// Lire la largeur et la hauteur
	scanner.Scan()
	fmt.Sscanf(scanner.Text(), "%d %d", &pbm.width, &pbm.height)

	// Initialiser la matrice de données
	pbm.data = make([][]bool, pbm.height)
	for i := range pbm.data {
		pbm.data[i] = make([]bool, pbm.width)
	}

	// Lire les données de l'image
	for i := 0; i < pbm.height && scanner.Scan(); i++ {
		line := strings.Fields(scanner.Text())

		// Ignorer les lignes vides
		if len(line) == 0 {
			i-- // Répéter l'itération pour la même ligne
			continue
		}

		// Assurer que la longueur de la ligne correspond à la largeur attendue pour le format P1
		if len(line) != pbm.width {
			return nil, fmt.Errorf("longueur de ligne invalide dans les données de l'image à la ligne %d", i+3)
		}

		// Traiter chaque caractère dans la ligne
		for j, char := range line {
			if j < pbm.width {
				switch pbm.magicNumber {
				case "P1":
					pbm.data[i][j] = char == "1"
				case "P4":
					// Le format P4 stocke les données sous forme binaire (0 ou 1)
					if char == "1" {
						pbm.data[i][j] = true
					} else if char != "0" {
						return nil, fmt.Errorf("caractère invalide dans les données de l'image à la ligne %d, colonne %d", i+3, j+1)
					}
				}
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return &pbm, nil
}

// Size retourne la largeur et la hauteur de l'image.
func (pbm *PBM) Size() (int, int) {
	return pbm.width, pbm.height
}

// At retourne la valeur du pixel à la position (x, y).
func (pbm *PBM) At(x, y int) bool {
	if x >= 0 && x < pbm.width && y >= 0 && y < pbm.height {
		return pbm.data[y][x]
	}
	return false // Retourne false si les coordonnées sont hors limites
}

// Set définit la valeur du pixel à la position (x, y).
func (pbm *PBM) Set(x, y int, value bool) {
	if x >= 0 && x < pbm.width && y >= 0 && y < pbm.height {
		pbm.data[y][x] = value
	}
}

// Invert inverts the colors of the PBM image.
func (pbm *PBM) Invert() {
	for i := 0; i < pbm.height; i++ {
		for j := 0; j < pbm.width; j++ {
			pbm.data[i][j] = !pbm.data[i][j]
		}
	}
}

// Flip flips the PBM image horizontally.
func (pbm *PBM) Flip() {
	for i := 0; i < pbm.height; i++ {
		for j, k := 0, pbm.width-1; j < k; j, k = j+1, k-1 {
			// Échanger les valeurs des pixels symétriques par rapport à l'axe vertical central
			pbm.data[i][j], pbm.data[i][k] = pbm.data[i][k], pbm.data[i][j]
		}
	}
}

// Flop flops the PBM image vertically.
func (pbm *PBM) Flop() {
	for i, j := 0, pbm.height-1; i < j; i, j = i+1, j-1 {
		// Échanger les valeurs des lignes symétriques par rapport à l'axe horizontal central
		pbm.data[i], pbm.data[j] = pbm.data[j], pbm.data[i]
	}
}

// Save enregistre l'image PBM dans un fichier du même format que l'image originale.
func (pbm *PBM) Save(filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	// Écrire le numéro magique, la largeur et la hauteur dans le fichier
	fmt.Fprintf(file, "%s\n%d %d\n", pbm.magicNumber, pbm.width, pbm.height)

	// Écrire les données de l'image dans le fichier
	for _, row := range pbm.data {
		for _, pixel := range row {
			if pbm.magicNumber == "P1" {
				// Format P1
				if pixel {
					fmt.Fprint(file, "1 ")
				} else {
					fmt.Fprint(file, "0 ")
				}
			} else if pbm.magicNumber == "P4" {
				// Format P4
				if pixel {
					fmt.Fprint(file, "1")
				} else {
					fmt.Fprint(file, "0")
				}
			}
		}
		fmt.Fprintln(file) // Nouvelle ligne après chaque ligne de pixels
	}

	return nil
}

// SetMagicNumber sets the magic number of the PBM image.
func (pbm *PBM) SetMagicNumber(magicNumber string) {
	pbm.magicNumber = magicNumber
}

func pbm() {
	// Exemple d'utilisation
	filename := "test1.pbm"
	image, err := ReadPBM(filename)
	if err != nil {
		fmt.Println("Erreur :", err)
		return
	}

	fmt.Printf("Numéro magique : %s\n", image.magicNumber)
	fmt.Printf("Largeur : %d\n", image.width)
	fmt.Printf("Hauteur : %d\n", image.height)

	// Appel de la fonction Size
	width, height := image.Size()
	fmt.Printf("Taille de l'image : %d x %d\n", width, height)

	// Exemple : Accéder au pixel à la position (2, 3)
	value := image.At(2, 3)
	fmt.Printf("Valeur du pixel à (2, 3) : %v\n", value)

	// Exemple : Inverser les couleurs de l'image
	image.Invert()

	// Exemple : Enregistrer l'image inversée dans un nouveau fichier
	saveFilename := "inverted_image.pbm"
	err = image.Save(saveFilename)
	if err != nil {
		fmt.Println("Erreur lors de l'enregistrement de l'image inversée :", err)
		return
	}

	fmt.Println("L'image inversée a été enregistrée avec succès dans", saveFilename)

	// Exemple : Inverser horizontalement l'image
	image.Flip()

	// Exemple : Enregistrer l'image inversée horizontalement dans un nouveau fichier
	flipFilename := "flipped_image.pbm"
	err = image.Save(flipFilename)
	if err != nil {
		fmt.Println("Erreur lors de l'enregistrement de l'image inversée horizontalement :", err)
		return
	}

	fmt.Println("L'image inversée horizontalement a été enregistrée avec succès dans", flipFilename)

	// Exemple : Inverser verticalement l'image
	image.Flop()

	// Exemple : Enregistrer l'image inversée verticalement dans un nouveau fichier
	flopFilename := "flopped_image.pbm"
	err = image.Save(flopFilename)
	if err != nil {
		fmt.Println("Erreur lors de l'enregistrement de l'image inversée verticalement :", err)
		return
	}

	fmt.Println("L'image inversée verticalement a été enregistrée avec succès dans", flopFilename)
}
