// English display-only localization. Identifiers, answer values, and medical routing remain unchanged.
const questionText = {
  "1": "Who is responding, and who needs the assessment?",
  "2": "What is the reason for this assessment?",
  "3": "Have you experienced a sudden pressure drop, a depressurization alarm, or a possible air leak in the spacecraft?",
  "4": "What are your current body mass (kg) and recorded height (cm)?",
  "5": "Do you have a recent, verifiable body mass measurement?",
  "6": "Have you experienced severe ear pain, difficulty breathing, dizziness, confusion, or sudden physical changes after a pressure change?",
  "7": "Has an elevated radiation alert or exposure above mission operational limits been recorded?",
  "8": "After a possible radiation exposure, have you experienced nausea, vomiting, unusual weakness, or general discomfort?",
  "9": "Have you experienced dizziness, disorientation, nausea, or difficulty coordinating movements in microgravity?",
  "10": "What were you doing before starting this assessment or noticing the symptoms?",
  "11": "Have you noticed reduced muscle strength, difficulty exercising, or changes in physical capacity during the mission?",
  "12": "Has an oxygen-related alarm activated, or have you experienced breathing difficulty, a severe headache, or confusion?",
  "13": "Has elevated CO₂ been detected, or have you experienced headache, drowsiness, dizziness, or difficulty concentrating?",
  "14": "Have you experienced palpitations, feeling faint, dizziness when changing position, or unusual heart-rate changes?",
  "15": "When did the symptom or incident begin?",
  "16": "Where on your body do you feel discomfort?",
  "17": "If you have pain, how severe is it right now?",
  "18": "Have you experienced something similar before?",
  "19": "How has the discomfort changed since it began?",
  "20": "Have you taken medications, vitamins, or supplements since your last entry?",
  "21": "Have you changed or missed any prescribed treatment doses?",
  "22": "How would you describe your overall adaptation to microgravity?",
  "23": "Has any medical condition documented in your record become apparent?",
  "24": "Have medical instructions or activity restrictions changed since your last assessment?",
  "25": "Have you noticed changes in vision, balance, concentration, or sensation?",
  "26": "Do you have any other symptoms you have not mentioned?",
  "27": "Did you complete your scheduled exercise since the last entry?",
  "28": "Did you complete your planned meals?",
  "29": "How much fluid have you consumed since the last entry?",
  "30": "Have you noticed any changes in urination?",
  "31": "Have you had a bowel movement since the last entry, and was there any discomfort?",
  "32": "Has an environmental incident occurred since the last assessment?",
  "33": "Have you been evaluated by the medical officer since the last entry?",
  "34": "Do you have new measurements or test results pending upload to CUBE CHECK_IA NASA?",
  "35": "How long did you sleep during your last rest period?",
  "36": "How long have you worked since the last entry, and what tasks did you perform?",
  "37": "What level of fatigue do you feel right now?",
  "38": "How would you describe your mood?",
  "39": "What level of stress do you feel right now?",
  "40": "Has your personal radiation dosimeter been read or checked since the last entry?",
  "41": "Have you noticed hearing changes, ringing, or discomfort after exposure to loud noise?",
  "42": "Have you had toothache, bleeding gums, or discomfort while chewing during the mission?",
  "43": "Have you noticed wounds, skin irritation, or injuries that are taking longer to heal?",
  "44": "Have you had a measured fever, a new cough, sore throat, or other signs of possible infection?",
  "45": "Have you experienced joint stiffness, limited movement, or musculoskeletal pain beyond general fatigue?",
  "46": "Have you noticed unusual swelling of the face, hands, or legs, or changes in the fit of personal equipment?",
  "47": "Have you had new difficulties performing fine hand movements or handling tools?",
  "48": "Is the measurement or medical equipment required for this assessment available and operational?",
  "49": "Is there anything else you would like to record or correct?",
  "50": "Do you confirm that this summary accurately represents your answers?",
  "1.1": "What is the name or ID of the astronaut who needs this assessment?",
  "2.1": "On a scale from 1 to 10, how urgently do you feel you need assistance right now?",
  "2.1.1": "Are you experiencing or observing any of these situations right now?"
};
const optionText = {
  "1": [
    "Myself",
    "I am responding for another crew member"
  ],
  "2": [
    "Daily check",
    "New symptom",
    "Follow-up on a concern",
    "Equipment or spacecraft alarm",
    "Other"
  ],
  "3": [
    "Yes",
    "No",
    "Not sure"
  ],
  "5": [
    "Yes",
    "No",
    "I do not know"
  ],
  "6": [
    "Yes",
    "No",
    "Not sure"
  ],
  "7": [
    "Yes",
    "No",
    "I cannot access the data"
  ],
  "8": [
    "Yes",
    "No",
    "No radiation alert occurred",
    "I do not know"
  ],
  "9": [
    "Never",
    "Occasionally",
    "Frequently",
    "Constantly"
  ],
  "10": [
    "Resting",
    "Sleeping",
    "Exercising",
    "Working",
    "Eating",
    "Other activity"
  ],
  "11": [
    "No changes noticed",
    "Mild decrease",
    "Moderate decrease",
    "Significant decrease"
  ],
  "12": [
    "Yes",
    "No",
    "Not sure"
  ],
  "13": [
    "Yes, there is an environmental alert",
    "I have symptoms, but no alert is recorded",
    "No symptoms or alerts",
    "No measurements available"
  ],
  "14": [
    "Never",
    "Occasionally",
    "Frequently",
    "I currently have symptoms"
  ],
  "16": [
    "Head",
    "Eyes",
    "Chest",
    "Abdomen",
    "Back",
    "Arms/hands",
    "Legs/feet",
    "Skin",
    "Other",
    "None"
  ],
  "18": [
    "Yes",
    "No",
    "I do not know"
  ],
  "19": [
    "Improved",
    "Unchanged",
    "Worsened",
    "Comes and goes",
    "Resolved",
    "Not applicable"
  ],
  "20": [
    "Yes",
    "No",
    "I do not know"
  ],
  "21": [
    "Yes",
    "No",
    "I have no prescribed treatment"
  ],
  "22": [
    "Good",
    "Fair",
    "Poor",
    "Still adapting"
  ],
  "23": [
    "Yes",
    "No",
    "I do not know"
  ],
  "24": [
    "Yes",
    "No",
    "I do not know"
  ],
  "25": [
    "Vision",
    "Balance",
    "Concentration/memory",
    "Tingling/numbness",
    "Other",
    "None"
  ],
  "26": [
    "Yes",
    "No",
    "I do not know"
  ],
  "27": [
    "Completed",
    "Partially completed",
    "Not completed",
    "Not scheduled"
  ],
  "28": [
    "Completed",
    "Partially completed",
    "I did not eat",
    "No record available"
  ],
  "30": [
    "Yes",
    "No",
    "I do not know"
  ],
  "31": [
    "Yes, without discomfort",
    "Yes, with discomfort",
    "No",
    "I cannot remember"
  ],
  "32": [
    "Pressure alarm",
    "Oxygen",
    "CO₂",
    "Smoke/fire",
    "Spill/contaminant",
    "Temperature",
    "Radiation notice",
    "Other",
    "None",
    "I do not know"
  ],
  "33": [
    "Yes",
    "No",
    "I do not know"
  ],
  "34": [
    "Yes",
    "No",
    "I do not know"
  ],
  "38": [
    "Calm",
    "Positive",
    "Sad",
    "Worried",
    "Irritable",
    "Unmotivated",
    "Other"
  ],
  "40": [
    "Yes, measurement available",
    "Not performed",
    "I do not know / no access"
  ],
  "41": [
    "No",
    "Yes, hearing changes",
    "Yes, ringing in the ears",
    "Yes, pain or pressure",
    "I do not know"
  ],
  "42": [
    "No",
    "Toothache",
    "Gum discomfort or bleeding",
    "Difficulty chewing",
    "I do not know"
  ],
  "43": [
    "No",
    "New wound or injury",
    "Skin irritation or rash",
    "Injury not healing",
    "I do not know"
  ],
  "44": [
    "Measured fever",
    "New cough",
    "Sore throat",
    "Chills",
    "None",
    "I do not know"
  ],
  "45": [
    "No",
    "Joint stiffness",
    "Limited movement",
    "Localized muscle or joint pain",
    "I do not know"
  ],
  "46": [
    "No",
    "Facial swelling",
    "Hand swelling",
    "Leg swelling",
    "Changes in equipment fit",
    "I do not know"
  ],
  "47": [
    "No",
    "Occasional difficulty",
    "Frequent difficulty",
    "Unable to perform a usual task",
    "I do not know"
  ],
  "48": [
    "Yes, everything is available",
    "Equipment or materials are missing",
    "Some equipment is faulty",
    "Not checked"
  ],
  "49": [
    "Yes",
    "No",
    "I do not know"
  ],
  "50": [
    "Confirm and save",
    "Edit responses",
    "Save as incomplete"
  ],
  "1.1": [
    "Mark — AST-001",
    "Mary — AST-002",
    "John — AST-003",
    "Mike — AST-004",
    "Eva — AST-005"
  ],
  "2.1.1": [
    "Unexpected pressure loss or active depressurization alarm.",
    "Oxygen alarm or severe difficulty breathing.",
    "CO₂ alarm, smoke, fire, or possible contaminant.",
    "A crew member is unresponsive and not breathing normally or only gasping.",
    "Chest pain or pressure, or palpitations with fainting or breathing difficulty.",
    "Sudden one-sided weakness, speech difficulty, severe confusion, or sudden vision loss.",
    "Heavy bleeding, severe injury, or major burn.",
    "Tongue/throat swelling or inability to breathe due to choking.",
    "Another emergency or I need immediate help, even without knowing the cause.",
    "None of the above."
  ]
};
const followupText = {
  "reason_detail": "Describe the reason for this assessment",
  "height_cm": "Recorded height (cm)",
  "mass_date": "Measurement date and device",
  "mass_kg": "Measured mass (kg)",
  "activity_detail": "Activity details",
  "body_area_detail": "Describe the discomfort",
  "prior_episode": "When it occurred and what assessment was performed",
  "symptom_change_detail": "Describe the change",
  "substance_name": "Medication, vitamin, or supplement",
  "dose_amount": "Amount or dose",
  "dose_unit": "Unit",
  "dose_time": "Time",
  "changed_treatment": "Which treatment",
  "change_time": "When",
  "change_reason": "Reason",
  "microgravity_detail": "Describe adaptation difficulties",
  "condition_detail": "Medical condition or profile reference",
  "changed_instruction": "Instruction",
  "instruction_date": "Date",
  "instruction_by": "Who issued it",
  "change_onset": "Onset",
  "change_description": "Description",
  "other_symptoms": "Other symptoms",
  "exercise_type": "Type",
  "exercise_minutes": "Minutes",
  "exercise_load": "Load",
  "exercise_discomfort": "Discomfort",
  "food_detail": "Omitted foods or amounts",
  "food_reason": "Reason",
  "intake_quality": "Data quality: measured, estimated, or unknown",
  "urinary_changes": "Observed changes: frequency, amount, pain, appearance, or other",
  "urinary_detail": "Description",
  "stool_detail": "Describe the discomfort",
  "incident_time": "Time of incident",
  "incident_active": "Is it still active? (yes/no)",
  "medical_review_date": "Date",
  "medical_guidance": "Instructions",
  "medical_followup": "Pending follow-up",
  "measurements": "Measurements: value, unit, time, device, and quality",
  "attachment_ref": "Imported file reference (do not embed file content)",
  "sleep_interruptions": "Number of interruptions",
  "rest_quality": "Perceived rest: 1 not rested at all, 10 fully rested",
  "tasks_detail": "Tasks performed",
  "fatigue_impacts_task": "Does it affect any task?",
  "fatigue_impact_detail": "Describe the difficulty",
  "mood_detail": "Optional details",
  "stress_reason": "Optional reason",
  "dosimeter_value": "Recorded reading, unit, device, and time",
  "dosimeter_reason": "Reason not measured or unavailable",
  "hearing_detail": "Give onset, activity, and duration",
  "oral_detail": "Describe onset and progression",
  "skin_detail": "Location, date, and description",
  "infection_detail": "Measured temperature, time, and other details",
  "mobility_detail": "Area, onset, and affected task",
  "fluid_shift_detail": "Describe the change and when it began",
  "dexterity_detail": "Affected tool or task and time",
  "equipment_detail": "Affected equipment or materials",
  "correction_detail": "Entry or correction"
};
const specialText = {
  "No puedo valorarlo": "Unable to assess",
  "Necesito ayuda inmediata": "I need immediate assistance",
  "No tengo síntomas": "I have no symptoms",
  "No sé": "I do not know",
  "Sin dolor": "No pain",
  "Sin fatiga": "No fatigue",
  "Sin estrés": "No stress"
};
const scaleText = {
  "urgencia mínima percibida": "lowest perceived urgency",
  "necesito asistencia inmediata": "I need immediate assistance",
  "mínimo": "minimum",
  "máximo imaginable": "highest imaginable",
  "mínima": "minimum",
  "máxima imaginable": "highest imaginable"
};

export function localizeNasa(source) {
  if (!source) return source;
  const localizeQuestion = (q) => ({
    ...q,
    text: questionText[q.id] || q.text,
    options: q.options?.map((o,i)=>({...o,label:optionText[q.id]?.[i] || o.label})),
    followups: q.followups?.map(f=>({...f,text:followupText[f.key]||f.text})),
    specialOptions: q.specialOptions?.map(o=>({...o,label:specialText[o.label]||o.label})),
    scale: q.scale ? {...q.scale, minLabel:scaleText[q.scale.minLabel]||q.scale.minLabel,maxLabel:scaleText[q.scale.maxLabel]||q.scale.maxLabel} : q.scale,
  });
  return {...source, title:'CUBE — CHECK_IA NASA | 50-Question Assessment',language:'en-US',questions:source.questions.map(localizeQuestion),branches:source.branches.map(localizeQuestion)};
}
