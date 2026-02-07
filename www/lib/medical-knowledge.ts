
// Medical Knowledge Base for VFMatch AI
// Maps procedures to required equipment and defines capacity thresholds.

export const MEDICAL_KNOWLEDGE = {
  // Map of procedure keywords to required equipment keywords
  procedureRequirements: {
    'cataract': ['operating microscope', 'phaco', 'ecce', 'lens'],
    'dialysis': ['dialysis', 'hemodialysis', 'kidney machine'],
    'mri': ['mri', 'magnetic resonance'],
    'ct scan': ['ct scanner', 'computed tomography', 'cat scan'],
    'x-ray': ['x-ray', 'radiography', 'digital imaging'],
    'ultrasound': ['ultrasound', 'sonography', 'doppler'],
    'ventilator': ['ventilator', 'respirator', 'icu'],
    'cardiac surgery': ['heart-lung', 'bypass', 'perfusion'],
    'neurosurgery': ['craniotomy', 'drill', 'microscope'],
    'endoscopy': ['endoscope', 'laparoscope', 'camera'],
  } as Record<string, string[]>,

  // Minimum requirements for facility credibility
  minRequirements: {
    'Hospital': { doctors: 2, beds: 10 },
    'Clinic': { doctors: 0, beds: 0 }, // Clinics can be run by nurses/PAs
    'Teaching Hospital': { doctors: 20, beds: 100 },
  },

  // Specialty to Procedure mapping (for expansion)
  specialtyToProcedures: {
    'Ophthalmology': ['cataract surgery', 'glaucoma surgery', 'corneal transplant'],
    'Cardiology': ['ecg', 'echocardiogram', 'angiography'],
    'Orthopedics': ['fracture fixation', 'joint replacement', 'arthroscopy'],
  }
};
