const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
    required: true
  },
  materiel: {
    type: String,
    required: true,
    trim: true
  },
  lieu: {
    type: String,
    required: true,
    trim: true
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['planifiee', 'en_cours', 'terminee'],
    default: 'planifiee'
  },
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  dateDebut: {
    type: Date,
    required: true
  },
  heureDebut: {
    type: String,
    required: true
  },
  dateFin: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  commentaires: [{
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    texte: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
interventionSchema.index({ dateDebut: 1, statut: 1 });
interventionSchema.index({ technicien: 1 });

module.exports = mongoose.model('Intervention', interventionSchema);