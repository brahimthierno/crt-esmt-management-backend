
// VERSION Settings.js (Modèle - Nettoyé) SANS LE PROFIL UTILISATEUR

const mongoose = require('mongoose');

// ============================================
// MODÈLE SETTINGS GLOBAL (Paramètres généraux)
// ============================================
const globalSettingsSchema = new mongoose.Schema({
  nomApp: {
    type: String,
    default: 'CRT-ESMT'
  },
  description: {
    type: String,
    default: 'Centre des Ressources Techniques'
  },
  couleurPrimaire: {
    type: String,
    default: '#2563eb'
  },
  couleurSecondaire: {
    type: String,
    default: '#10b981'
  },
  logo: {
    type: String
  },
  horaires: {
    lundi: { ouvert: Boolean, ouverture: String, fermeture: String },
    mardi: { ouvert: Boolean, ouverture: String, fermeture: String },
    mercredi: { ouvert: Boolean, ouverture: String, fermeture: String },
    jeudi: { ouvert: Boolean, ouverture: String, fermeture: String },
    vendredi: { ouvert: Boolean, ouverture: String, fermeture: String },
    samedi: { ouvert: Boolean, ouverture: String, fermeture: String },
    dimanche: { ouvert: Boolean, ouverture: String, fermeture: String }
  },
  categories: [{
    id: Number,
    nom: String,
    couleur: String
  }],
  sla: {
    basse: { type: Number, default: 48 },      // heures
    moyenne: { type: Number, default: 24 },    // heures
    haute: { type: Number, default: 4 }        // heures
  },
  backup: {
    lastBackup: Date,
    autoBackup: { type: Boolean, default: true },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    }
  }
}, { timestamps: true });

// ============================================
// MODÈLE USER SETTINGS (Paramètres utilisateur)
// ============================================
const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    emailDemandes: { type: Boolean, default: true },
    emailInterventions: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    smsPhone: String
  },
  themes: {
    darkMode: { type: Boolean, default: false },
    langue: { type: String, default: 'fr' }
  },
  preferences: {
    itemsPerPage: { type: Number, default: 10 },
    affichagePlanningDefaut: { type: String, default: 'mois' } // jour/semaine/mois
  }
}, { timestamps: true });

// ============================================
// MODÈLE BACKUP (Historique des sauvegardes)
// ============================================
const backupSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  size: Number,
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['manual', 'automatic'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  description: String
}, { timestamps: true });

// ============================================
// EXPORTS
// ============================================
const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);
const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
const Backup = mongoose.model('Backup', backupSchema);

module.exports = { GlobalSettings, UserSettings, Backup };