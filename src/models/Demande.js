const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  numeroReference: { type: String, unique: true, index: true },
  lieu: { type: String, required: true },
  equipement: { type: String, required: true },
  description: { type: String, required: true },
  priorite: { 
    type: String, 
    enum: ['basse', 'moyenne', 'haute'], 
    default: 'moyenne' 
  },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  statut: { 
    type: String, 
    enum: ['nouvelle', 'examinee', 'acceptee', 'rejetee', 'convertie'],
    default: 'nouvelle'
  },
  dateCreation: { type: Date, default: Date.now },
  dateConversion: { type: Date },
  interventionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervention' },
  notes: { type: String },
  motifRejet: { type: String }
});

module.exports = mongoose.model('Demande', demandeSchema);