import { ChartData } from '@/components/charts/TorbayChart';

export const HIP_KNEE_CHART_DATA: ChartData = {
  slug: 'hip-knee-arthritis',
  name: 'Hip and Knee Arthritis',
  description: 'Decision aid for managing hip and knee osteoarthritis from early stage to surgical intervention.',
  stages: [
    'Normal',
    'Start of Disease',
    'Early Stage',
    'Mid Stage',
    'Late Stage',
    'Very Late',
  ],
  categories: {
    diagnosisAndStaging: [
      {
        name: 'Diagnosis',
        treatments: [
          { id: 'clinical-exam', name: 'Clinical Examination', slug: 'clinical-exam', fromStage: 1, toStage: 6 },
          { id: 'xray', name: 'X-Ray Imaging', slug: 'xray', fromStage: 2, toStage: 6 },
          { id: 'mri', name: 'MRI Scan', slug: 'mri', fromStage: 3, toStage: 5 },
        ],
      },
    ],
    selfHelp: [
      {
        name: 'Self Help',
        treatments: [
          { id: 'weight-management', name: 'Weight Management', slug: 'weight-management', fromStage: 1, toStage: 6 },
          { id: 'exercise', name: 'Regular Exercise', slug: 'exercise', fromStage: 1, toStage: 5 },
          { id: 'walking-aids', name: 'Walking Aids', slug: 'walking-aids', fromStage: 3, toStage: 6 },
          { id: 'hot-cold-therapy', name: 'Hot/Cold Therapy', slug: 'hot-cold-therapy', fromStage: 2, toStage: 4 },
          { id: 'footwear', name: 'Appropriate Footwear', slug: 'footwear', fromStage: 2, toStage: 6 },
        ],
      },
    ],
    mainlineTreatment: [
      {
        name: 'Non-operative',
        treatments: [
          { id: 'paracetamol', name: 'Paracetamol', slug: 'paracetamol', fromStage: 2, toStage: 4 },
          { id: 'nsaids', name: 'NSAIDs', slug: 'nsaids', fromStage: 2, toStage: 5 },
          { id: 'topical-nsaids', name: 'Topical NSAIDs', slug: 'topical-nsaids', fromStage: 2, toStage: 4 },
          { id: 'physiotherapy', name: 'Physiotherapy', slug: 'physiotherapy', fromStage: 2, toStage: 5 },
          { id: 'steroid-injection', name: 'Steroid Injection', slug: 'steroid-injection', fromStage: 3, toStage: 5 },
          { id: 'hyaluronic-acid', name: 'Hyaluronic Acid Injection', slug: 'hyaluronic-acid', fromStage: 3, toStage: 4 },
        ],
      },
      {
        name: 'Operative',
        treatments: [
          { id: 'arthroscopy', name: 'Arthroscopy', slug: 'arthroscopy', fromStage: 3, toStage: 4 },
          { id: 'osteotomy', name: 'Osteotomy', slug: 'osteotomy', fromStage: 3, toStage: 4 },
          { id: 'partial-replacement', name: 'Partial Joint Replacement', slug: 'partial-replacement', fromStage: 4, toStage: 5 },
          { id: 'total-replacement', name: 'Total Joint Replacement', slug: 'total-replacement', fromStage: 5, toStage: 6 },
          { id: 'revision-surgery', name: 'Revision Surgery', slug: 'revision-surgery', fromStage: 6, toStage: 6 },
        ],
      },
    ],
    alternative: [
      {
        name: 'All',
        treatments: [
          { id: 'acupuncture', name: 'Acupuncture', slug: 'acupuncture', fromStage: 2, toStage: 5 },
          { id: 'glucosamine', name: 'Glucosamine Supplements', slug: 'glucosamine', fromStage: 2, toStage: 4 },
          { id: 'tens', name: 'TENS Therapy', slug: 'tens', fromStage: 2, toStage: 5 },
          { id: 'massage', name: 'Massage Therapy', slug: 'massage', fromStage: 2, toStage: 4 },
        ],
      },
    ],
    observationNoTreatment: [
      {
        name: 'Observation / No Treatment',
        treatments: [
          { id: 'watchful-waiting', name: 'Watchful Waiting', slug: 'watchful-waiting', fromStage: 1, toStage: 3 },
          { id: 'lifestyle-modification', name: 'Lifestyle Modification Only', slug: 'lifestyle-modification', fromStage: 1, toStage: 2 },
        ],
      },
    ],
  },
};

export const KNEE_ARTHRITIS_CHART_DATA: ChartData = {
  slug: 'knee-arthritis',
  name: 'Knee Arthritis',
  description: 'Decision aid for managing knee osteoarthritis.',
  stages: [
    'Normal',
    'Start of Disease',
    'Early Stage',
    'Mid Stage',
    'Late Stage',
    'Very Late',
  ],
  categories: {
    diagnosisAndStaging: [
      {
        name: 'Diagnosis',
        treatments: [
          { id: 'k-clinical-exam', name: 'Clinical Examination', slug: 'clinical-exam', fromStage: 1, toStage: 6 },
          { id: 'k-xray', name: 'Weight-bearing X-Ray', slug: 'xray', fromStage: 2, toStage: 6 },
          { id: 'k-mri', name: 'MRI Scan', slug: 'mri', fromStage: 3, toStage: 5 },
        ],
      },
    ],
    selfHelp: [
      {
        name: 'Self Help',
        treatments: [
          { id: 'k-weight', name: 'Weight Loss', slug: 'weight-loss', fromStage: 1, toStage: 6 },
          { id: 'k-quad-exercise', name: 'Quadriceps Strengthening', slug: 'quad-exercise', fromStage: 1, toStage: 5 },
          { id: 'k-knee-brace', name: 'Knee Brace', slug: 'knee-brace', fromStage: 3, toStage: 5 },
          { id: 'k-walking-stick', name: 'Walking Stick', slug: 'walking-stick', fromStage: 4, toStage: 6 },
        ],
      },
    ],
    mainlineTreatment: [
      {
        name: 'Non-operative',
        treatments: [
          { id: 'k-paracetamol', name: 'Paracetamol', slug: 'paracetamol', fromStage: 2, toStage: 4 },
          { id: 'k-nsaids', name: 'NSAIDs/COX-2 Inhibitors', slug: 'nsaids', fromStage: 2, toStage: 5 },
          { id: 'k-physio', name: 'Physiotherapy', slug: 'physiotherapy', fromStage: 2, toStage: 5 },
          { id: 'k-steroid', name: 'Intra-articular Steroid', slug: 'steroid-injection', fromStage: 3, toStage: 5 },
        ],
      },
      {
        name: 'Operative',
        treatments: [
          { id: 'k-arthroscopy', name: 'Knee Arthroscopy', slug: 'arthroscopy', fromStage: 3, toStage: 4 },
          { id: 'k-hto', name: 'High Tibial Osteotomy', slug: 'hto', fromStage: 3, toStage: 4 },
          { id: 'k-partial', name: 'Unicompartmental Knee Replacement', slug: 'partial-knee', fromStage: 4, toStage: 5 },
          { id: 'k-tkr', name: 'Total Knee Replacement', slug: 'tkr', fromStage: 5, toStage: 6 },
        ],
      },
    ],
    alternative: [
      {
        name: 'All',
        treatments: [
          { id: 'k-acupuncture', name: 'Acupuncture', slug: 'acupuncture', fromStage: 2, toStage: 4 },
          { id: 'k-glucosamine', name: 'Glucosamine/Chondroitin', slug: 'glucosamine', fromStage: 2, toStage: 4 },
        ],
      },
    ],
    observationNoTreatment: [
      {
        name: 'Observation / No Treatment',
        treatments: [
          { id: 'k-watchful', name: 'Watchful Waiting', slug: 'watchful-waiting', fromStage: 1, toStage: 3 },
        ],
      },
    ],
  },
};

export const HIP_ARTHRITIS_CHART_DATA: ChartData = {
  slug: 'hip-arthritis',
  name: 'Hip Arthritis',
  description: 'Decision aid for managing hip osteoarthritis.',
  stages: [
    'Normal',
    'Start of Disease',
    'Early Stage',
    'Mid Stage',
    'Late Stage',
    'Very Late',
  ],
  categories: {
    diagnosisAndStaging: [
      {
        name: 'Diagnosis',
        treatments: [
          { id: 'h-clinical-exam', name: 'Clinical Examination', slug: 'clinical-exam', fromStage: 1, toStage: 6 },
          { id: 'h-xray', name: 'Pelvic X-Ray', slug: 'xray', fromStage: 2, toStage: 6 },
          { id: 'h-mri', name: 'MRI Hip', slug: 'mri', fromStage: 3, toStage: 5 },
        ],
      },
    ],
    selfHelp: [
      {
        name: 'Self Help',
        treatments: [
          { id: 'h-weight', name: 'Weight Management', slug: 'weight-management', fromStage: 1, toStage: 6 },
          { id: 'h-exercise', name: 'Hip Strengthening Exercises', slug: 'hip-exercise', fromStage: 1, toStage: 5 },
          { id: 'h-swimming', name: 'Swimming/Aqua Therapy', slug: 'swimming', fromStage: 2, toStage: 5 },
          { id: 'h-stick', name: 'Walking Stick', slug: 'walking-stick', fromStage: 3, toStage: 6 },
        ],
      },
    ],
    mainlineTreatment: [
      {
        name: 'Non-operative',
        treatments: [
          { id: 'h-paracetamol', name: 'Paracetamol', slug: 'paracetamol', fromStage: 2, toStage: 4 },
          { id: 'h-nsaids', name: 'NSAIDs', slug: 'nsaids', fromStage: 2, toStage: 5 },
          { id: 'h-physio', name: 'Physiotherapy', slug: 'physiotherapy', fromStage: 2, toStage: 5 },
          { id: 'h-steroid', name: 'Intra-articular Steroid', slug: 'steroid-injection', fromStage: 3, toStage: 5 },
        ],
      },
      {
        name: 'Operative',
        treatments: [
          { id: 'h-arthroscopy', name: 'Hip Arthroscopy', slug: 'hip-arthroscopy', fromStage: 2, toStage: 3 },
          { id: 'h-resurfacing', name: 'Hip Resurfacing', slug: 'hip-resurfacing', fromStage: 4, toStage: 5 },
          { id: 'h-thr', name: 'Total Hip Replacement', slug: 'thr', fromStage: 5, toStage: 6 },
          { id: 'h-revision', name: 'Revision Hip Surgery', slug: 'revision-hip', fromStage: 6, toStage: 6 },
        ],
      },
    ],
    alternative: [
      {
        name: 'All',
        treatments: [
          { id: 'h-acupuncture', name: 'Acupuncture', slug: 'acupuncture', fromStage: 2, toStage: 4 },
          { id: 'h-supplements', name: 'Nutritional Supplements', slug: 'supplements', fromStage: 2, toStage: 4 },
        ],
      },
    ],
    observationNoTreatment: [
      {
        name: 'Observation / No Treatment',
        treatments: [
          { id: 'h-watchful', name: 'Watchful Waiting', slug: 'watchful-waiting', fromStage: 1, toStage: 3 },
        ],
      },
    ],
  },
};
