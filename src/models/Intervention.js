// const mongoose = require('mongoose');

// const interventionSchema = new mongoose.Schema({
//   titre: {
//     type: String,
//     required: [true, 'Le titre est requis'],
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
//     required: true
//   },
//   materiel: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lieu: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   technicien: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   statut: {
//     type: String,
//     enum: ['planifiee', 'en_cours', 'terminee'],
//     default: 'planifiee'
//   },
//   priorite: {
//     type: String,
//     enum: ['basse', 'moyenne', 'haute'],
//     default: 'moyenne'
//   },
//   dateDebut: {
//     type: Date,
//     required: true
//   },
//   heureDebut: {
//     type: String,
//     required: true
//   },
//   dateFin: {
//     type: Date
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   commentaires: [{
//     auteur: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     texte: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Index pour améliorer les performances de recherche
// interventionSchema.index({ dateDebut: 1, statut: 1 });
// interventionSchema.index({ technicien: 1 });

// module.exports = mongoose.model('Intervention', interventionSchema);

// INTEGRATION DE UPLOADS DE FICHIERS

// const mongoose = require('mongoose');

// const interventionSchema = new mongoose.Schema({
//   titre: {
//     type: String,
//     required: [true, 'Le titre est requis'],
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
//     required: true
//   },
//   materiel: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lieu: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   technicien: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   statut: {
//     type: String,
//     enum: ['planifiee', 'en_cours', 'terminee'],
//     default: 'planifiee'
//   },
//   priorite: {
//     type: String,
//     enum: ['basse', 'moyenne', 'haute'],
//     default: 'moyenne'
//   },
//   dateDebut: {
//     type: Date,
//     required: true
//   },
//   heureDebut: {
//     type: String,
//     required: true
//   },
//   dateFin: {
//     type: Date
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   // NOUVEAU : Champ pour les fichiers
//   fichiers: [{
//     nom: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     },
//     type: {
//       type: String,
//       enum: ['image', 'document', 'autre'],
//       required: true
//     },
//     taille: {
//       type: Number, // Taille en bytes
//       required: true
//     },
//     dateUpload: {
//       type: Date,
//       default: Date.now
//     },
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   }],
//   commentaires: [{
//     auteur: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     texte: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Index pour améliorer les performances de recherche
// interventionSchema.index({ dateDebut: 1, statut: 1 });
// interventionSchema.index({ technicien: 1 });

// module.exports = mongoose.model('Intervention', interventionSchema);


// NOUVELLE VERSION AVEC CLAUDE EN AJOUTANT LES BATIMENTS

// const mongoose = require('mongoose');
// const { SITES_ESMT } = require('../../constants/sites');

// const interventionSchema = new mongoose.Schema({
//   titre: {
//     type: String,
//     required: [true, 'Le titre est requis'],
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
//     required: true
//   },
//   materiel: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lieu: {
//     type: String,
//     required: true,
//     // ✅ Validation avec la liste des sites
//     enum: SITES_ESMT.map(s => s.value),
//     trim: true
//   },
//   // ✅ NOUVEAU : Ajouter le bâtiment
//   batiment: {
//     type: String,
//     trim: true
//   },
//   technicien: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   statut: {
//     type: String,
//     enum: ['planifiee', 'en_cours', 'terminee'],
//     default: 'planifiee'
//   },
//   priorite: {
//     type: String,
//     enum: ['basse', 'moyenne', 'haute'],
//     default: 'moyenne'
//   },
//   dateDebut: {
//     type: Date,
//     required: true
//   },
//   heureDebut: {
//     type: String,
//     required: true
//   },
//   dateFin: {
//     type: Date
//   },
//   heureFin: {
//     type: String
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   demande: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Demande'
//   },
//   fichiers: [{
//     nom: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     },
//     type: {
//       type: String,
//       enum: ['image', 'document', 'autre'],
//       required: true
//     },
//     taille: {
//       type: Number,
//       required: true
//     },
//     dateUpload: {
//       type: Date,
//       default: Date.now
//     },
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   }],
//   commentaires: [{
//     auteur: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     texte: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // ✅ Middleware pour auto-remplir le bâtiment
// interventionSchema.pre('save', function(next) {
//   if (this.lieu && !this.batiment) {
//     const site = SITES_ESMT.find(s => s.value === this.lieu);
//     if (site) {
//       this.batiment = site.batiment;
//     }
//   }
//   next();
// });

// interventionSchema.index({ dateDebut: 1, statut: 1 });
// interventionSchema.index({ technicien: 1 });

// module.exports = mongoose.model('Intervention', interventionSchema);


// VERSION FINALE POUR INCLURE DATEFIN ET HEUREFIN POUR UNE VUE COMPLETE DES INTERVENTIONS

// const mongoose = require('mongoose');
// const { SITES_ESMT } = require('../../constants/sites');

// const interventionSchema = new mongoose.Schema({
//   titre: {
//     type: String,
//     required: [true, 'Le titre est requis'],
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
//     required: true
//   },
//   materiel: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lieu: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   batiment: {
//     type: String,
//     trim: true
//   },
//   technicien: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   statut: {
//     type: String,
//     enum: ['planifiee', 'en_cours', 'terminee'],
//     default: 'planifiee'
//   },
//   priorite: {
//     type: String,
//     enum: ['basse', 'moyenne', 'haute'],
//     default: 'moyenne'
//   },
//   dateDebut: {
//     type: Date,
//     required: true
//   },
//   heureDebut: {
//     type: String,
//     required: true
//   },
//   // ✅ NOUVEAU : Date/heure de début effectif (quand l'intervention passe à "en_cours")
//   dateDebutEffectif: {
//     type: Date,
//     default: null
//   },
//   heureDebutEffectif: {
//     type: String,
//     default: null
//   },
//   // ✅ NOUVEAU : Date/heure de fin effective (quand l'intervention est "terminee")
//   dateFinEffective: {
//     type: Date,
//     default: null
//   },
//   heureFinEffective: {
//     type: String,
//     default: null
//   },
//   dateFin: {
//     type: Date
//   },
//   heureFin: {
//     type: String
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   demande: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Demande'
//   },
//   fichiers: [{
//     nom: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     },
//     type: {
//       type: String,
//       enum: ['image', 'document', 'autre'],
//       required: true
//     },
//     taille: {
//       type: Number,
//       required: true
//     },
//     dateUpload: {
//       type: Date,
//       default: Date.now
//     },
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   }],
//   commentaires: [{
//     auteur: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     texte: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });


// // ✅ Middleware pour auto-remplir le bâtiment
// interventionSchema.pre('save', function(next) {
//   if (this.lieu && !this.batiment) {
//     const site = SITES_ESMT.find(s => s.value === this.lieu);
//     if (site) {
//       this.batiment = site.batiment;
//     }
//   }
//   next();
// });

// // ✅ NOUVEAU : Middleware pour enregistrer automatiquement les dates de transition
// interventionSchema.pre('save', function(next) {
//   const now = new Date();
//   const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

//   // Si le statut passe à "en_cours" et qu'il n'y a pas encore de date de début effectif
//   if (this.isModified('statut') && this.statut === 'en_cours' && !this.dateDebutEffectif) {
//     this.dateDebutEffectif = now;
//     this.heureDebutEffectif = heureActuelle;
//   }

//   // Si le statut passe à "terminee" et qu'il n'y a pas encore de date de fin effective
//   if (this.isModified('statut') && this.statut === 'terminee' && !this.dateFinEffective) {
//     this.dateFinEffective = now;
//     this.heureFinEffective = heureActuelle;
    
//     // Également mettre à jour dateFin pour compatibilité
//     if (!this.dateFin) {
//       this.dateFin = now;
//       this.heureFin = heureActuelle;
//     }
//   }

//   next();
// });

// // ✅ NOUVEAU : Méthode pour calculer la durée de l'intervention
// interventionSchema.methods.getDuree = function() {
//   if (this.dateDebutEffectif && this.dateFinEffective) {
//     const dureeMs = this.dateFinEffective - this.dateDebutEffectif;
//     const heures = Math.floor(dureeMs / (1000 * 60 * 60));
//     const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
//     return { heures, minutes, total: dureeMs };
//   }
//   return null;
// };

// interventionSchema.index({ dateDebut: 1, statut: 1 });
// interventionSchema.index({ technicien: 1 });

// module.exports = mongoose.model('Intervention', interventionSchema);


// VERSION FINALE CLAUDE POUR INCLURE DATEFIN ET HEUREFIN POUR UNE VUE COMPLETE DES INTERVENTIONS

// const mongoose = require('mongoose');
// const { SITES_ESMT } = require('../../constants/sites');


// const interventionSchema = new mongoose.Schema({
//   titre: {
//     type: String,
//     required: [true, 'Le titre est requis'],
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['reparation', 'diagnostic', 'verification', 'maintenance', 'installation'],
//     required: true
//   },
//   materiel: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lieu: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   batiment: {
//     type: String,
//     trim: true
//   },
//   technicien: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   statut: {
//     type: String,
//     enum: ['planifiee', 'en_cours', 'terminee'],
//     default: 'planifiee'
//   },
//   priorite: {
//     type: String,
//     enum: ['basse', 'moyenne', 'haute'],
//     default: 'moyenne'
//   },
//   dateDebut: {
//     type: Date,
//     required: true
//   },
//   heureDebut: {
//     type: String,
//     required: true
//   },
//   // ✅ Date/heure de début effectif (quand l'intervention passe à "en_cours")
//   dateDebutEffectif: {
//     type: Date,
//     default: null
//   },
//   heureDebutEffectif: {
//     type: String,
//     default: null
//   },
//   // ✅ Date/heure de fin effective (quand l'intervention est "terminee")
//   dateFinEffective: {
//     type: Date,
//     default: null
//   },
//   heureFinEffective: {
//     type: String,
//     default: null
//   },
//   dateFin: {
//     type: Date
//   },
//   heureFin: {
//     type: String
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   demande: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Demande'
//   },
//   fichiers: [{
//     nom: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     },
//     type: {
//       type: String,
//       enum: ['image', 'document', 'autre'],
//       required: true
//     },
//     taille: {
//       type: Number,
//       required: true
//     },
//     dateUpload: {
//       type: Date,
//       default: Date.now
//     },
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   }],
//   commentaires: [{
//     auteur: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     texte: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // ✅ Middleware pour auto-remplir le bâtiment
// interventionSchema.pre('save', function(next) {
//   if (this.lieu && !this.batiment) {
//     const site = SITES_ESMT.find(s => s.value === this.lieu);
//     if (site) {
//       this.batiment = site.batiment;
//     }
//   }
//   next();
// });

// // ✅ Middleware pour enregistrer automatiquement les dates de transition
// interventionSchema.pre('save', function(next) {
//   const now = new Date();
//   const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

//   // Si le statut passe à "en_cours" et qu'il n'y a pas encore de date de début effectif
//   if (this.isModified('statut') && this.statut === 'en_cours' && !this.dateDebutEffectif) {
//     this.dateDebutEffectif = now;
//     this.heureDebutEffectif = heureActuelle;
//     console.log('✅ Date de début effectif enregistrée:', this.dateDebutEffectif);
//   }

//   // Si le statut passe à "terminee" et qu'il n'y a pas encore de date de fin effective
//   if (this.isModified('statut') && this.statut === 'terminee' && !this.dateFinEffective) {
//     this.dateFinEffective = now;
//     this.heureFinEffective = heureActuelle;
//     console.log('✅ Date de fin effective enregistrée:', this.dateFinEffective);
    
//     // Également mettre à jour dateFin pour compatibilité
//     if (!this.dateFin) {
//       this.dateFin = now;
//       this.heureFin = heureActuelle;
//     }
//   }

//   next();
// });

// // ✅ Méthode pour calculer la durée de l'intervention
// interventionSchema.methods.getDuree = function() {
//   if (this.dateDebutEffectif && this.dateFinEffective) {
//     const dureeMs = this.dateFinEffective - this.dateDebutEffectif;
//     const heures = Math.floor(dureeMs / (1000 * 60 * 60));
//     const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
//     return { heures, minutes, total: dureeMs };
//   }
//   return null;
// };

// interventionSchema.index({ dateDebut: 1, statut: 1 });
// interventionSchema.index({ technicien: 1 });

// module.exports = mongoose.model('Intervention', interventionSchema);


// VERSION FINALE AVEC VALIDATION DES INTERVENTIONS PAR LADMINISTRATION



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
  batiment: {
    type: String,
    trim: true
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['planifiee', 'en_cours', 'en_attente_validation', 'terminee'], // ✅ AJOUT du nouveau statut
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
  // Date/heure de début effectif (quand l'intervention passe à "en_cours")
  dateDebutEffectif: {
    type: Date,
    default: null
  },
  heureDebutEffectif: {
    type: String,
    default: null
  },
  // Date/heure de fin effective (quand l'intervention passe à "en_attente_validation")
  dateFinEffective: {
    type: Date,
    default: null
  },
  heureFinEffective: {
    type: String,
    default: null
  },
  // ✅ NOUVEAU : Date de validation par l'admin
  dateValidation: {
    type: Date,
    default: null
  },
  heureValidation: {
    type: String,
    default: null
  },
  // ✅ NOUVEAU : Admin qui a validé
  validePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dateFin: {
    type: Date
  },
  heureFin: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  demande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demande'
  },
  fichiers: [{
    nom: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'document', 'autre'],
      required: true
    },
    taille: {
      type: Number,
      required: true
    },
    dateUpload: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
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

// ✅ Middleware pour enregistrer automatiquement les dates de transition
interventionSchema.pre('save', function(next) {
  const now = new Date();
  const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // Si le statut passe à "en_cours" et qu'il n'y a pas encore de date de début effectif
  if (this.isModified('statut') && this.statut === 'en_cours' && !this.dateDebutEffectif) {
    this.dateDebutEffectif = now;
    this.heureDebutEffectif = heureActuelle;
    console.log('✅ Date de début effectif enregistrée:', this.dateDebutEffectif);
  }

  // ✅ NOUVEAU : Si le statut passe à "en_attente_validation" (technicien termine)
  if (this.isModified('statut') && this.statut === 'en_attente_validation' && !this.dateFinEffective) {
    this.dateFinEffective = now;
    this.heureFinEffective = heureActuelle;
    console.log('✅ Date de fin effective enregistrée (en attente):', this.dateFinEffective);
  }

  // ✅ NOUVEAU : Si le statut passe à "terminee" depuis "en_attente_validation" (admin valide)
  if (this.isModified('statut') && this.statut === 'terminee' && !this.dateValidation) {
    this.dateValidation = now;
    this.heureValidation = heureActuelle;
    console.log('✅ Date de validation enregistrée:', this.dateValidation);
    
    // Mettre à jour dateFin pour compatibilité
    if (!this.dateFin) {
      this.dateFin = now;
      this.heureFin = heureActuelle;
    }
  }

  next();
});

// Méthode pour calculer la durée de l'intervention
interventionSchema.methods.getDuree = function() {
  if (this.dateDebutEffectif && this.dateFinEffective) {
    const dureeMs = this.dateFinEffective - this.dateDebutEffectif;
    const heures = Math.floor(dureeMs / (1000 * 60 * 60));
    const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
    return { heures, minutes, total: dureeMs };
  }
  return null;
};

interventionSchema.index({ dateDebut: 1, statut: 1 });
interventionSchema.index({ technicien: 1 });

module.exports = mongoose.model('Intervention', interventionSchema);