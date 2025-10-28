const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
  materiel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  emprunteur: {
    type: String,
    required: true,
    trim: true
  },
  dateEmprunt: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateRetourPrevue: {
    type: Date,
    required: true
  },
  dateRetourEffective: {
    type: Date
  },
  statut: {
    type: String,
    enum: ['en_cours', 'retourne', 'en_retard'],
    default: 'en_cours'
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarques: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtuel pour savoir si l'emprunt est en retard
empruntSchema.virtual('enRetard').get(function() {
  if (this.statut === 'retourne') return false;
  return new Date() > this.dateRetourPrevue;
});

// Index
empruntSchema.index({ statut: 1, dateRetourPrevue: 1 });

module.exports = mongoose.model('Emprunt', empruntSchema);