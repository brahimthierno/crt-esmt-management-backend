
// NOUVELLE VERSION settingsRoutes.js (Routes - Nettoyées) SANS LE PROFIL UTILISATEUR

const express = require('express');
const router = express.Router();
const { GlobalSettings, UserSettings, Backup } = require('../models/Settings');
const fs = require('fs');
const path = require('path');

// ============================================
// 1. OBTENIR LES PARAMÈTRES GLOBAUX
// ============================================
router.get('/app', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    // Créer les paramètres par défaut s'ils n'existent pas
    if (!settings) {
      settings = new GlobalSettings({
        horaires: {
          lundi: { ouvert: true, ouverture: '08:00', fermeture: '17:00' },
          mardi: { ouvert: true, ouverture: '08:00', fermeture: '17:00' },
          mercredi: { ouvert: true, ouverture: '08:00', fermeture: '17:00' },
          jeudi: { ouvert: true, ouverture: '08:00', fermeture: '17:00' },
          vendredi: { ouvert: true, ouverture: '08:00', fermeture: '17:00' },
          samedi: { ouvert: false, ouverture: '09:00', fermeture: '13:00' },
          dimanche: { ouvert: false, ouverture: '', fermeture: '' }
        },
        categories: [
          { id: 1, nom: 'Informatique', couleur: '#3b82f6' },
          { id: 2, nom: 'Électricité', couleur: '#f59e0b' }
        ]
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('❌ ERREUR /app:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 2. METTRE À JOUR LES PARAMÈTRES GÉNÉRAUX
// ============================================
router.put('/app', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      settings = new GlobalSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('❌ ERREUR PUT /app:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 3. OBTENIR LES PARAMÈTRES UTILISATEUR
// ============================================
router.get('/user/:userId', async (req, res) => {
  try {
    let userSettings = await UserSettings.findOne({ userId: req.params.userId });
    
    // Créer les paramètres utilisateur par défaut s'ils n'existent pas
    if (!userSettings) {
      userSettings = new UserSettings({ userId: req.params.userId });
      await userSettings.save();
    }
    
    res.json(userSettings);
  } catch (error) {
    console.error('❌ ERREUR GET /user:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 4. METTRE À JOUR LES NOTIFICATIONS
// ============================================
router.put('/notifications/:userId', async (req, res) => {
  try {
    let userSettings = await UserSettings.findOne({ userId: req.params.userId });
    
    if (!userSettings) {
      userSettings = new UserSettings({ userId: req.params.userId });
    }

    userSettings.notifications = req.body;
    await userSettings.save();

    res.json({ success: true, userSettings });
  } catch (error) {
    console.error('❌ ERREUR PUT /notifications:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 5. METTRE À JOUR LES HORAIRES
// ============================================
router.put('/horaires', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      settings = new GlobalSettings();
    }

    settings.horaires = req.body;
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    console.error('❌ ERREUR PUT /horaires:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 6. OBTENIR LES CATÉGORIES
// ============================================
router.get('/categories', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      settings = new GlobalSettings();
      await settings.save();
    }

    res.json(settings.categories || []);
  } catch (error) {
    console.error('❌ ERREUR GET /categories:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 7. AJOUTER UNE CATÉGORIE
// ============================================
router.post('/categories', async (req, res) => {
  try {
    const { nom, couleur } = req.body;
    
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings();
    }

    const newCategory = {
      id: (settings.categories?.length || 0) + 1,
      nom,
      couleur
    };

    if (!settings.categories) {
      settings.categories = [];
    }

    settings.categories.push(newCategory);
    await settings.save();

    res.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('❌ ERREUR POST /categories:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 8. SUPPRIMER UNE CATÉGORIE
// ============================================
router.delete('/categories/:id', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({ message: 'Paramètres non trouvés' });
    }

    settings.categories = settings.categories.filter(c => c.id !== parseInt(req.params.id));
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    console.error('❌ ERREUR DELETE /categories:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 9. METTRE À JOUR LES SLA
// ============================================
router.put('/sla', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      settings = new GlobalSettings();
    }

    settings.sla = req.body;
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    console.error('❌ ERREUR PUT /sla:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 10. EFFECTUER UN BACKUP
// ============================================
router.post('/backup', async (req, res) => {
  try {
    console.log('📦 Backup en cours...');

    // Créer un dossier backups s'il n'existe pas
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Générer un nom de fichier avec timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);

    // Simuler l'export des données (à adapter avec MongoDB dump)
    const backupData = {
      timestamp: new Date(),
      version: '1.0.0',
      message: 'Backup effectué avec succès'
    };

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

    // Enregistrer le backup dans la BD
    const backup = new Backup({
      filename,
      size: fs.statSync(filepath).size,
      type: 'manual',
      status: 'success'
    });

    await backup.save();

    // Mettre à jour les paramètres globaux
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings();
    }

    settings.backup.lastBackup = new Date();
    await settings.save();

    console.log('✅ Backup effectué:', filename);

    res.json({ 
      success: true, 
      filename,
      message: 'Backup effectué avec succès'
    });
  } catch (error) {
    console.error('❌ ERREUR POST /backup:', error);
    res.status(500).json({ message: 'Erreur lors du backup', error: error.message });
  }
});

// ============================================
// 11. LISTER LES BACKUPS
// ============================================
router.get('/backups', async (req, res) => {
  try {
    const backups = await Backup.find().sort({ date: -1 });
    res.json(backups);
  } catch (error) {
    console.error('❌ ERREUR GET /backups:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ============================================
// 12. OBTENIR LES PARAMÈTRES GLOBAUX (simple)
// ============================================
router.get('/', async (req, res) => {
  try {
    const globalSettings = await GlobalSettings.findOne();
    res.json(globalSettings);
  } catch (error) {
    console.error('❌ ERREUR GET /:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

module.exports = router;