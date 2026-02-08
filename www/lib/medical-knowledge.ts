
// Medical Knowledge Base for VFMatch AI
// Maps procedures to required equipment and defines capacity thresholds.
// Covers VF Agent questions 3.1 (completeness assumption), 3.4 (procedure-equipment cross-ref),
// 4.2 (ratio checks), 4.6 (subspecialty-infrastructure), and more.

export const MEDICAL_KNOWLEDGE = {
  /**
   * Procedure → Required Equipment mapping (Completeness Assumption).
   * If a facility claims a procedure, it MUST have at least one of the listed equipment items.
   * Used by crossValidateClaims to flag violations (Q3.1, Q3.4).
   */
  procedureRequirements: {
    // Ophthalmology
    'cataract': ['operating microscope', 'phaco', 'ecce', 'lens', 'intraocular lens', 'iol'],
    'cataract surgery': ['operating microscope', 'phaco', 'ecce', 'intraocular lens', 'iol'],
    'glaucoma surgery': ['operating microscope', 'tonometer', 'gonioscope', 'laser'],
    'corneal transplant': ['operating microscope', 'specular microscope', 'eye bank'],
    'vitrectomy': ['operating microscope', 'vitrectomy machine', 'vitreoretinal'],
    'retinal surgery': ['operating microscope', 'vitrectomy', 'laser', 'fundus camera'],
    'lasik': ['excimer laser', 'corneal topographer', 'wavefront'],
    'pterygium surgery': ['operating microscope', 'surgical instruments'],

    // Cardiology / Cardiac Surgery
    'cardiac surgery': ['heart-lung', 'bypass', 'perfusion', 'icu', 'cardiac monitor'],
    'open heart surgery': ['heart-lung machine', 'bypass', 'perfusion', 'icu'],
    'angioplasty': ['catheterization lab', 'cath lab', 'fluoroscopy', 'stent'],
    'angiography': ['catheterization lab', 'cath lab', 'fluoroscopy'],
    'pacemaker': ['catheterization lab', 'cath lab', 'fluoroscopy', 'pacemaker'],
    'echocardiography': ['echocardiography', 'echocardiogram', 'echo machine', 'ultrasound'],
    'ecg': ['ecg', 'electrocardiograph', 'ekg'],

    // Neurosurgery
    'neurosurgery': ['craniotomy', 'drill', 'microscope', 'ct', 'mri', 'icu'],
    'craniotomy': ['operating microscope', 'craniotomy set', 'ct', 'icu'],
    'spinal surgery': ['c-arm', 'fluoroscopy', 'operating microscope', 'spinal implants'],
    'brain surgery': ['ct', 'mri', 'operating microscope', 'icu', 'neuronavigation'],

    // Orthopedics
    'joint replacement': ['operating room', 'c-arm', 'implant', 'prosthesis'],
    'hip replacement': ['operating room', 'c-arm', 'hip implant', 'prosthesis'],
    'knee replacement': ['operating room', 'c-arm', 'knee implant', 'prosthesis'],
    'arthroscopy': ['arthroscope', 'camera', 'monitor'],
    'fracture fixation': ['x-ray', 'c-arm', 'orthopedic instruments', 'implant'],
    'spinal fusion': ['c-arm', 'fluoroscopy', 'spinal implant'],

    // Imaging / Diagnostic
    'mri': ['mri', 'magnetic resonance'],
    'ct scan': ['ct scanner', 'computed tomography', 'cat scan'],
    'x-ray': ['x-ray', 'radiography', 'digital imaging'],
    'ultrasound': ['ultrasound', 'sonography', 'doppler'],
    'mammography': ['mammography', 'mammogram'],
    'pet scan': ['pet scanner', 'pet-ct', 'positron emission'],
    'fluoroscopy': ['fluoroscopy', 'fluoroscope', 'c-arm'],

    // Critical Care / Respiratory
    'ventilator': ['ventilator', 'respirator', 'icu'],
    'mechanical ventilation': ['ventilator', 'respirator', 'icu'],
    'icu': ['ventilator', 'monitor', 'infusion pump', 'defibrillator'],

    // Renal
    'dialysis': ['dialysis', 'hemodialysis', 'kidney machine'],
    'hemodialysis': ['hemodialysis machine', 'dialyzer', 'reverse osmosis'],
    'peritoneal dialysis': ['peritoneal dialysis', 'pd catheter'],
    'kidney transplant': ['operating room', 'icu', 'dialysis', 'transplant'],

    // GI / Endoscopy
    'endoscopy': ['endoscope', 'endoscopy'],
    'colonoscopy': ['colonoscope', 'endoscopy'],
    'gastroscopy': ['gastroscope', 'endoscopy'],
    'ercp': ['endoscope', 'fluoroscopy', 'ercp'],
    'laparoscopy': ['laparoscope', 'laparoscopic', 'camera', 'insufflator'],
    'laparoscopic surgery': ['laparoscope', 'laparoscopic', 'camera', 'insufflator'],

    // Obstetrics
    'cesarean section': ['operating room', 'anesthesia', 'neonatal resuscitation'],
    'c-section': ['operating room', 'anesthesia', 'neonatal resuscitation'],

    // Oncology
    'chemotherapy': ['infusion pump', 'pharmacy', 'oncology'],
    'radiation therapy': ['linear accelerator', 'linac', 'radiation'],
    'radiotherapy': ['linear accelerator', 'linac', 'cobalt'],

    // Dental
    'dental surgery': ['dental chair', 'dental instruments', 'dental x-ray'],
    'orthodontics': ['dental chair', 'dental x-ray', 'orthodontic'],
    'root canal': ['dental chair', 'dental x-ray', 'endodontic'],

    // ENT
    'tonsillectomy': ['operating room', 'anesthesia', 'ent instruments'],
    'cochlear implant': ['operating room', 'audiometer', 'ct', 'mri'],

    // Urology
    'lithotripsy': ['lithotripter', 'eswl', 'ultrasound'],
    'prostatectomy': ['operating room', 'urological instruments'],

    // Transplant
    'organ transplant': ['operating room', 'icu', 'transplant team', 'immunosuppression'],
    'liver transplant': ['operating room', 'icu', 'transplant', 'blood bank'],
  } as Record<string, string[]>,

  /**
   * Minimum requirements for facility credibility by type.
   * Used by detectAnomalies and crossValidateClaims.
   */
  minRequirements: {
    'Hospital': { doctors: 2, beds: 10 },
    'Clinic': { doctors: 0, beds: 0 },
    'Teaching Hospital': { doctors: 20, beds: 100 },
    'Tertiary Hospital': { doctors: 15, beds: 80 },
    'District Hospital': { doctors: 5, beds: 30 },
    'Polyclinic': { doctors: 3, beds: 5 },
    'Health Center': { doctors: 0, beds: 0 },
    'CHPS Compound': { doctors: 0, beds: 0 },
  },

  /**
   * Specialty → Required Procedures mapping (Q3.4).
   * If a facility claims a specialty, these are expected associated procedures.
   */
  specialtyToProcedures: {
    'Ophthalmology': ['cataract surgery', 'glaucoma surgery', 'corneal transplant', 'eye examination', 'refraction'],
    'Cardiology': ['ecg', 'echocardiogram', 'angiography', 'stress test', 'holter monitoring'],
    'Orthopedics': ['fracture fixation', 'joint replacement', 'arthroscopy', 'cast application'],
    'Neurosurgery': ['craniotomy', 'spinal surgery', 'brain biopsy', 'vp shunt'],
    'Urology': ['lithotripsy', 'prostatectomy', 'cystoscopy', 'circumcision'],
    'Gastroenterology': ['endoscopy', 'colonoscopy', 'ercp', 'liver biopsy'],
    'Oncology': ['chemotherapy', 'radiation therapy', 'biopsy', 'tumor resection'],
    'Nephrology': ['dialysis', 'hemodialysis', 'peritoneal dialysis', 'kidney biopsy'],
    'Obstetrics': ['cesarean section', 'normal delivery', 'antenatal care', 'ultrasound'],
    'Pediatrics': ['neonatal care', 'vaccination', 'growth monitoring'],
    'ENT': ['tonsillectomy', 'myringotomy', 'septoplasty', 'hearing test'],
    'Dermatology': ['skin biopsy', 'cryotherapy', 'laser treatment'],
    'Psychiatry': ['counseling', 'psychiatric evaluation'],
    'Radiology': ['x-ray', 'ct scan', 'mri', 'ultrasound', 'mammography'],
  },

  /**
   * Specialty → Minimum infrastructure thresholds (Q4.6).
   * Used to detect subspecialty-infrastructure mismatches.
   */
  specialtyInfrastructure: {
    'neurosurgery': { minBeds: 100, minDoctors: 5, requiredEquipment: ['ct', 'mri', 'icu', 'operating room'] },
    'cardiac surgery': { minBeds: 50, minDoctors: 5, requiredEquipment: ['icu', 'cath lab', 'operating room'] },
    'organ transplant': { minBeds: 100, minDoctors: 10, requiredEquipment: ['icu', 'operating room', 'blood bank'] },
    'oncology': { minBeds: 50, minDoctors: 3, requiredEquipment: ['chemotherapy', 'radiation'] },
    'neonatology': { minBeds: 30, minDoctors: 3, requiredEquipment: ['nicu', 'incubator', 'ventilator'] },
    'nephrology': { minBeds: 20, minDoctors: 2, requiredEquipment: ['dialysis'] },
    'cardiology': { minBeds: 30, minDoctors: 3, requiredEquipment: ['ecg', 'echocardiography', 'icu'] },
    'orthopedics': { minBeds: 20, minDoctors: 2, requiredEquipment: ['x-ray', 'operating room'] },
    'ophthalmology': { minBeds: 5, minDoctors: 1, requiredEquipment: ['slit lamp', 'operating microscope'] },
    'radiology': { minBeds: 0, minDoctors: 1, requiredEquipment: ['x-ray'] },
  } as Record<string, { minBeds: number; minDoctors: number; requiredEquipment: string[] }>,

  /**
   * Expected ratios for anomaly detection (Q4.2, Q4.7).
   * Used to flag facilities with suspicious metrics.
   */
  expectedRatios: {
    /** Typical beds per operating room */
    bedsPerOR: { min: 10, max: 50, typical: 25 },
    /** Typical beds per doctor */
    bedsPerDoctor: { min: 2, max: 30, typical: 10 },
    /** Maximum credible subspecialties per doctor */
    maxSubspecialtiesPerDoctor: 3,
    /** Maximum credible procedures for a small facility (<20 beds) */
    maxProceduresSmallFacility: 15,
    /** Maximum credible procedures for a medium facility (20-100 beds) */
    maxProceduresMediumFacility: 40,
    /** Maximum credible procedures for a large facility (>100 beds) */
    maxProceduresLargeFacility: 100,
  },

  /**
   * Equipment complexity tiers (Q7.4 — legacy vs modern equipment).
   * Used to classify equipment sophistication levels.
   */
  equipmentTiers: {
    basic: [
      'stethoscope', 'blood pressure monitor', 'thermometer', 'otoscope',
      'weighing scale', 'height board', 'glucometer', 'hemoglobin meter',
    ],
    intermediate: [
      'x-ray', 'ultrasound', 'ecg', 'dental chair', 'autoclave',
      'centrifuge', 'microscope', 'defibrillator', 'suction machine',
      'oxygen concentrator', 'nebulizer', 'pulse oximeter',
    ],
    advanced: [
      'ct scanner', 'mri', 'mammography', 'endoscope', 'laparoscope',
      'c-arm', 'ventilator', 'dialysis machine', 'operating microscope',
      'echocardiography', 'holter monitor', 'eeg',
    ],
    specialized: [
      'linear accelerator', 'linac', 'pet scanner', 'gamma knife',
      'lithotripter', 'heart-lung machine', 'excimer laser',
      'neuronavigation', 'robotic surgery', 'da vinci',
    ],
  },
};
