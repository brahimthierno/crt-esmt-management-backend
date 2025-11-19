// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Erreur MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



// NOUVELLE VERSION POUR LA PRODUCTION



const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔧 Tentative de connexion MongoDB...');
    console.log('📝 MONGODB_URI:', process.env.MONGODB_URI ? 'Présente' : 'MANQUANTE!');
    
    // ⛔ SUPPRIMEZ les options obsolètes
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // ❌ SUPPRIMEZ ces lignes (obsolètes)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      
      // ✅ OPTIONS RECOMMANDÉES pour Mongoose 7+
      serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
      socketTimeoutMS: 45000, // Timeout socket
      maxPoolSize: 10, // Nombre max de connexions
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    console.error(`🔍 Code d'erreur: ${error.code}`);
    console.error(`🏷️ Nom de l'erreur: ${error.name}`);
    
    // Diagnostic supplémentaire
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Solution: Vérifiez votre MONGODB_URI et la connexion réseau');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;