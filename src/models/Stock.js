const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  categorie: {
    type: String,
    enum: ['informatique', 'electricite'],
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  disponible: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  seuil: {
    type: Number,
    default: 5,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  emplacement: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtuel pour savoir si le stock est faible
stockSchema.virtual('stockFaible').get(function() {
  return this.disponible <= this.seuil;
});

// Méthode pour calculer le taux de disponibilité
stockSchema.methods.tauxDisponibilite = function() {
  if (this.quantite === 0) return 0;
  return Math.round((this.disponible / this.quantite) * 100);
};

module.exports = mongoose.model('Stock', stockSchema);