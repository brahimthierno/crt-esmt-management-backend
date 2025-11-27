// scripts/mongo-test.js
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Pour charger les variables d'environnement

const uri = process.env.MONGODB_URI;

async function testerConnexion() {
  if (!uri) {
    console.log('❌ MONGODB_URI non définie dans .env');
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    console.log('🔗 Tentative de connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté à MongoDB avec succès!');
    
    const db = client.db("ort-esmt");
    
    // Lister les collections
    console.log('\n📂 Collections disponibles:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Compter les documents
    console.log('\n📊 Statistiques:');
    for (let col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n🔒 Connexion fermée.');
  }
}

testerConnexion();