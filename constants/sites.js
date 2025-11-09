// Liste complète des sites ESMT
const SITES_ESMT = [
  // Bibliothèque
  { value: 'Bibliothèque', label: 'Bibliothèque', batiment: 'Bâtiment HA' },
  
  // Bureaux Administration
  { value: 'Bureau_Accueil', label: 'Bureau Accueil', batiment: 'Bâtiment AD' },
  { value: 'Bureau_Chauffeurs', label: 'Bureau Chauffeurs', batiment: 'Bâtiment AD' },
  { value: 'Bureau_Comptabilite', label: 'Bureau Comptabilité', batiment: 'Bâtiment AD' },
  { value: 'Bureau_DAF', label: 'Bureau DAF', batiment: 'Bâtiment AD' },
  { value: 'Bureau_DEFR', label: 'Bureau DEFR', batiment: 'Bâtiment AD' },
  { value: 'Bureau_DG', label: 'Bureau DG', batiment: 'Bâtiment AD' },
  { value: 'Bureau_DRH', label: 'Bureau DRH', batiment: 'Bâtiment AD' },
  { value: 'Bureau_DRI', label: 'Bureau DRI', batiment: 'Bâtiment AD' },
  { value: 'Bureau_MDI', label: 'Bureau MDI', batiment: 'Bâtiment AD' },
  { value: 'Bureau_RDC', label: 'Bureau RDC', batiment: 'Bâtiment HA' },
  { value: 'Bureau_Scolarite', label: 'Bureau Scolarité', batiment: 'Bâtiment AD' },
  { value: 'Bureau_SG', label: 'Bureau SG', batiment: 'Bâtiment AD' },
  
  // Bureaux Étages
  { value: 'Bureau_Etage', label: 'Bureau Étage', batiment: 'Bâtiment HA' },
  { value: 'Bureau_Etage1', label: 'Bureau Étage 1', batiment: 'Bâtiment HB' },
  { value: 'Bureau_Etage2', label: 'Bureau Étage 2', batiment: 'Bâtiment HB' },
  { value: 'Bureau_Etage3', label: 'Bureau Étage 3', batiment: 'Bâtiment HB' },
  { value: 'Bureau_Etage4', label: 'Bureau Étage 4', batiment: 'Bâtiment HB' },
  
  // Bureaux RDC
  { value: 'Bureau_RDC1', label: 'Bureau RDC1', batiment: 'Bâtiment HB' },
  { value: 'Bureau_RDC2', label: 'Bureau RDC2', batiment: 'Bâtiment HB' },
  
  // Autres lieux
  { value: 'Centre_de_Certification', label: 'Centre de Certification', batiment: 'Bâtiment HB' },
  { value: 'CRT', label: 'CRT', batiment: 'Bâtiment E' },
  { value: 'Cuisine', label: 'Cuisine', batiment: 'Foyer' },
  { value: 'Cyber', label: 'Cyber', batiment: 'Bâtiment HA' },
  { value: 'E11', label: 'E11', batiment: 'Bâtiment E' }
];

// Regrouper par bâtiment
const SITES_PAR_BATIMENT = {
  'Bâtiment AD': SITES_ESMT.filter(s => s.batiment === 'Bâtiment AD'),
  'Bâtiment HA': SITES_ESMT.filter(s => s.batiment === 'Bâtiment HA'),
  'Bâtiment HB': SITES_ESMT.filter(s => s.batiment === 'Bâtiment HB'),
  'Bâtiment E': SITES_ESMT.filter(s => s.batiment === 'Bâtiment E'),
  'Foyer': SITES_ESMT.filter(s => s.batiment === 'Foyer')
};

module.exports = {
  SITES_ESMT,
  SITES_PAR_BATIMENT
};