// // VERSION AVEC INTEGRATION DU PARAMETRAGE SETTINGS

// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path'); // POUR SERVIR LES FICHIERS UPLOADÉS
// const connectDB = require('./config/database');

// // Charger les variables d'environnement
// dotenv.config();

// // Connexion à la base de données
// connectDB();

// const app = express();

// // Middleware Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes de l'historique
// app.use('/api/historique', require('./routes/historique'));

// // Servir les fichiers uploadés statiquement
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Enable CORS
// app.use(cors({
//   origin: 'http://localhost:3000', // URL du frontend
//   credentials: true
// }));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/interventions', require('./routes/interventions'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/stock', require('./routes/stock'));
// app.use('/api/emprunts', require('./routes/emprunts'));
// app.use('/api/demandes', require('./routes/demandes'));
// app.use('/api/settings', require('./routes/settings'));

// // Route de test
// app.get('/', (req, res) => {
//   res.json({
//     message: '🚀 API CRT-ESMT en cours d\'exécution',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       interventions: '/api/interventions',
//       users: '/api/users',
//       stock: '/api/stock',
//       emprunts: '/api/emprunts',
//       demandes: '/api/demandes',
//       settings: '/api/settings'
//     }
//   });
// });

// // Gestion des erreurs 404
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route non trouvée'
//   });
// });

// // Gestion globale des erreurs
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Erreur serveur',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`✅ Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
// });

// // Gestion des rejets de promesses non gérés
// process.on('unhandledRejection', (err) => {
//   console.log(`❌ Erreur: ${err.message}`);
//   server.close(() => process.exit(1));
// });

// module.exports = app;


// VERSION AVEC INTEGRATION DU PARAMETRAGE SETTINGS

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // POUR SERVIR LES FICHIERS UPLOADÉS
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// ✅ CORRECTION : CORS DOIT ÊTRE PLACÉ ICI, AU DÉBUT
app.use(cors({
  origin: 'http://localhost:3000', // URL du frontend
  credentials: true
}));

// Middleware Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ DÉPLACER les routes APRÈS CORS

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interventions', require('./routes/interventions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/emprunts', require('./routes/emprunts'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/settings', require('./routes/settings'));

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API CRT-ESMT en cours d\'exécution',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      interventions: '/api/interventions',
      users: '/api/users',
      stock: '/api/stock',
      emprunts: '/api/emprunts',
      demandes: '/api/demandes',
      settings: '/api/settings',
      historique: '/api/historique'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
});

// Gestion des rejets de promesses non gérés
process.on('unhandledRejection', (err) => {
  console.log(`❌ Erreur: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;