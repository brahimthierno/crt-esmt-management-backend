const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Intervention = require('./models/Intervention');
const Stock = require('./models/Stock');
const Emprunt = require('./models/Emprunt');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

// Données initiales
const usersData = [
  {
    username: 'admin',
    password: 'admin123',
    nom: 'Administrateur',
    prenom: 'Système',
    role: 'admin'
  },
  {
    username: 'tech1',
    password: 'tech123',
    nom: 'Diop',
    prenom: 'Moussa',
    role: 'informaticien'
  },
  {
    username: 'tech2',
    password: 'tech123',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    role: 'electricien'
  },
  {
    username: 'tech3',
    password: 'tech123',
    nom: 'Sow',
    prenom: 'Abdoulaye',
    role: 'informaticien'
  }
];

const stock = [
  {
    nom: 'Multiprise',
    categorie: 'electricite',
    quantite: 15,
    disponible: 15,
    seuil: 5,
    description: 'Multiprise 6 prises avec protection',
    emplacement: 'Magasin A - Étagère 2'
  },
  {
    nom: 'Câble de projection',
    categorie: 'informatique',
    quantite: 20,
    disponible: 18,
    seuil: 8,
    description: 'Câble HDMI 3m',
    emplacement: 'Magasin B - Étagère 1'
  },
  {
    nom: 'Point d\'accès WiFi',
    categorie: 'informatique',
    quantite: 8,
    disponible: 6,
    seuil: 3,
    description: 'TP-Link AC1200',
    emplacement: 'Magasin B - Étagère 3'
  },
  {
    nom: 'Haut-parleur',
    categorie: 'electricite',
    quantite: 12,
    disponible: 10,
    seuil: 4,
    description: 'Haut-parleur Bluetooth 20W',
    emplacement: 'Magasin A - Étagère 1'
  },
  {
    nom: 'Lampe LED',
    categorie: 'electricite',
    quantite: 30,
    disponible: 28,
    seuil: 10,
    description: 'Lampe LED 15W E27',
    emplacement: 'Magasin A - Étagère 4'
  },
  {
    nom: 'Switch réseau',
    categorie: 'informatique',
    quantite: 10,
    disponible: 9,
    seuil: 3,
    description: 'Switch Gigabit 24 ports',
    emplacement: 'Magasin B - Étagère 2'
  },
  {
    nom: 'Rallonge électrique',
    categorie: 'electricite',
    quantite: 25,
    disponible: 22,
    seuil: 8,
    description: 'Rallonge 10m avec enrouleur',
    emplacement: 'Magasin A - Étagère 3'
  },
  {
    nom: 'Câble réseau RJ45',
    categorie: 'informatique',
    quantite: 50,
    disponible: 45,
    seuil: 15,
    description: 'Câble Cat6 blindé',
    emplacement: 'Magasin B - Étagère 4'
  }
];

// Importer les données
const importData = async () => {
  try {
    await connectDB();

    // Supprimer les données existantes
    await User.deleteMany();
    await Intervention.deleteMany();
    await Stock.deleteMany();
    await Emprunt.deleteMany();

    console.log('🗑️  Données existantes supprimées');

    // Créer les utilisateurs UN PAR UN pour déclencher le hook pre('save')
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ ${createdUsers.length} utilisateurs créés avec mots de passe hachés`);

    // Créer le stock
    const createdStock = await Stock.insertMany(stock);
    console.log(`✅ ${createdStock.length} matériels créés`);

    // Récupérer les techniciens pour créer les interventions
    const technicien1 = createdUsers.find(u => u.role === 'informaticien');
    const technicien2 = createdUsers.find(u => u.role === 'electricien');

    const interventions = [
      {
        titre: 'Réparation climatiseur Salle A101',
        type: 'reparation',
        materiel: 'Climatiseur',
        lieu: 'Salle A101',
        technicien: technicien2._id,
        statut: 'planifiee',
        priorite: 'haute',
        dateDebut: new Date('2025-10-25'),
        heureDebut: '09:00',
        description: 'Le climatiseur ne refroidit plus correctement'
      },
      {
        titre: 'Maintenance serveurs',
        type: 'maintenance',
        materiel: 'Serveurs',
        lieu: 'Salle serveurs',
        technicien: technicien1._id,
        statut: 'en_cours',
        priorite: 'moyenne',
        dateDebut: new Date('2025-10-24'),
        heureDebut: '14:00',
        description: 'Maintenance mensuelle des serveurs'
      },
      {
        titre: 'Installation point d\'accès WiFi',
        type: 'installation',
        materiel: 'Point d\'accès',
        lieu: 'Bâtiment B - Étage 2',
        technicien: technicien1._id,
        statut: 'terminee',
        priorite: 'moyenne',
        dateDebut: new Date('2025-10-23'),
        heureDebut: '10:00',
        dateFin: new Date('2025-10-23T12:30:00'),
        description: 'Installation d\'un nouveau point d\'accès WiFi'
      },
      {
        titre: 'Diagnostic vidéoprojecteur',
        type: 'diagnostic',
        materiel: 'Vidéoprojecteur',
        lieu: 'Amphithéâtre 1',
        technicien: technicien1._id,
        statut: 'planifiee',
        priorite: 'haute',
        dateDebut: new Date('2025-10-26'),
        heureDebut: '08:30',
        description: 'Le vidéoprojecteur ne s\'allume plus'
      },
      {
        titre: 'Vérification installation électrique',
        type: 'verification',
        materiel: 'Installation électrique',
        lieu: 'Laboratoire informatique',
        technicien: technicien2._id,
        statut: 'en_cours',
        priorite: 'basse',
        dateDebut: new Date('2025-10-25'),
        heureDebut: '11:00',
        description: 'Vérification annuelle de conformité'
      }
    ];

    const createdInterventions = await Intervention.insertMany(interventions);
    console.log(`✅ ${createdInterventions.length} interventions créées`);

    // Créer quelques emprunts
    const cableMateriel = createdStock.find(s => s.nom === 'Câble de projection');
    const hautParleurMateriel = createdStock.find(s => s.nom === 'Haut-parleur');

    const emprunts = [
      {
        materiel: cableMateriel._id,
        quantite: 2,
        emprunteur: 'Prof. Sow',
        dateEmprunt: new Date('2025-10-22'),
        dateRetourPrevue: new Date('2025-10-25'),
        statut: 'en_cours',
        responsable: createdUsers[0]._id
      },
      {
        materiel: hautParleurMateriel._id,
        quantite: 2,
        emprunteur: 'Département Réseau',
        dateEmprunt: new Date('2025-10-20'),
        dateRetourPrevue: new Date('2025-10-27'),
        statut: 'en_cours',
        responsable: createdUsers[0]._id
      }
    ];

    const createdEmprunts = await Emprunt.insertMany(emprunts);
    console.log(`✅ ${createdEmprunts.length} emprunts créés`);

    console.log('\n🎉 Données importées avec succès !');
    console.log('\n📋 Comptes créés :');
    console.log('   Admin    : admin / admin123');
    console.log('   Tech Info: tech1 / tech123');
    console.log('   Tech Élec: tech2 / tech123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  }
};

// Supprimer toutes les données
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Intervention.deleteMany();
    await Stock.deleteMany();
    await Emprunt.deleteMany();

    console.log('🗑️  Toutes les données ont été supprimées');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    process.exit(1);
  }
};

// Arguments de commande
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('  node src/seeder.js -i  // Importer les données');
  console.log('  node src/seeder.js -d  // Supprimer les données');
}