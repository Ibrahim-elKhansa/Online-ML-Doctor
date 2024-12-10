"use client";

import React, { useState, useEffect } from "react";
import Symptom from "./Symptom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

interface PrognosisDetails {
  severity: string;
  description: string;
  medications: string[];
  remedies: string[];
}

const prognosesData: Record<string, PrognosisDetails> = require("../data/prognoses.json");

const symptomsList = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "continuous_sneezing",
  "shivering",
  "chills",
  "joint_pain",
  "stomach_pain",
  "acidity",
  "ulcers_on_tongue",
  "muscle_wasting",
  "vomiting",
  "burning_micturition",
  "spotting_ urination",
  "fatigue",
  "weight_gain",
  "anxiety",
  "cold_hands_and_feets",
  "mood_swings",
  "weight_loss",
  "restlessness",
  "lethargy",
  "patches_in_throat",
  "irregular_sugar_level",
  "cough",
  "high_fever",
  "sunken_eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish_skin",
  "dark_urine",
  "nausea",
  "loss_of_appetite",
  "pain_behind_the_eyes",
  "back_pain",
  "constipation",
  "abdominal_pain",
  "diarrhoea",
  "mild_fever",
  "yellow_urine",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "swelling_of_stomach",
  "swelled_lymph_nodes",
  "malaise",
  "blurred_and_distorted_vision",
  "phlegm",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "chest_pain",
  "weakness_in_limbs",
  "fast_heart_rate",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "neck_pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "loss_of_smell",
  "bladder_discomfort",
  "foul_smell_of urine",
  "continuous_feel_of_urine",
  "passage_of_gases",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "muscle_pain",
  "altered_sensorium",
  "red_spots_over_body",
  "belly_pain",
  "abnormal_menstruation",
  "dischromic _patches",
  "watering_from_eyes",
  "increased_appetite",
  "polyuria",
  "family_history",
  "mucoid_sputum",
  "rusty_sputum",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "stomach_bleeding",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "fluid_overload",
  "blood_in_sputum",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
].sort((a, b) => a.localeCompare(b));

const confidenceLevel = 95;

export default function SymptomsForm() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<{ name: string; state: "maybe" | "yes" | "no" }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [prognoses, setPrognoses] = useState<any[]>([]);
  const [nextSymptom, setNextSymptom] = useState<string | null>(null);
  const [finalPrognosis, setFinalPrognosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicationPrices, setMedicationPrices] = useState<{ name: string; type: string; price: string }[]>([]);
  const [checkingPrices, setCheckingPrices] = useState(false);

  useEffect(() => {
    if (nextSymptom && selectedSymptoms.some((s) => s.name === nextSymptom)) {
      setNextSymptom(null);
    }
  }, [nextSymptom, selectedSymptoms]);

  useEffect(() => {
    const confidentPrognosis = prognoses.find((prog) => parseFloat(prog.confidence) > confidenceLevel);
    if (confidentPrognosis) {
      handleConfirm(confidentPrognosis.prognosis);
    }
  }, [prognoses]);

  const handleSelectMaybe = (name: string) => {
    setSelectedSymptoms((prev) => {
      const existing = prev.find((symptom) => symptom.name === name);
      if (existing) {
        return prev.map((symptom) => (symptom.name === name ? { ...symptom, state: "maybe" } : symptom));
      } else {
        return [...prev, { name, state: "maybe" }];
      }
    });
  };

  const handleSelectYes = (name: string) => {
    setSelectedSymptoms((prev) => {
      const existing = prev.find((symptom) => symptom.name === name);
      if (existing) {
        return prev.map((symptom) => (symptom.name === name ? { ...symptom, state: "yes" } : symptom));
      } else {
        return [...prev, { name, state: "yes" }];
      }
    });
  };

  const handleSelectNo = (name: string) => {
    setSelectedSymptoms((prev) => {
      const existing = prev.find((symptom) => symptom.name === name);
      if (existing) {
        return prev.map((symptom) => (symptom.name === name ? { ...symptom, state: "no" } : symptom));
      } else {
        return [...prev, { name, state: "no" }];
      }
    });
  };

  const handleRemove = (name: string) => {
    setSelectedSymptoms((prev) => prev.filter((symptom) => symptom.name !== name));
  };

  const handleConfirm = (prognosis: string) => {
    setFinalPrognosis(prognosis);
    setNextSymptom(null);
  }

  const handleSubmit = async () => {
    const payload = selectedSymptoms.reduce((acc, symptom) => {
      acc[symptom.name] = symptom.state === "yes" ? 2 : symptom.state === "maybe" ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    setPrognoses([]);
    setFinalPrognosis(null);
    setNextSymptom(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/diagnose", payload);
      setPrognoses(res.data.top_prognoses);
      setNextSymptom(res.data.next_symptom);
    } catch (error) {
      console.error("Error submitting symptoms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSymptoms = symptomsList.filter((symptom) => {
    const normalizedSymptom = symptom.toLowerCase().replaceAll(" ", "").replaceAll("_", "");
    const normalizedSearchTerm = searchTerm.toLowerCase().replaceAll(" ", "").replaceAll("_", "");
    return !selectedSymptoms.some((s) => s.name === symptom) && normalizedSymptom.includes(normalizedSearchTerm);
  });

  const handleCheckPrices = async () => {
    if (!finalPrognosis || !prognosesData[finalPrognosis]?.medications) return;

    const medications = prognosesData[finalPrognosis].medications;
    setCheckingPrices(true);
    setMedicationPrices([]);

    try {
      const response = await axios.post("/api/check-prices", { medications });

      const pricesData = response.data.prices || [];
      setMedicationPrices(pricesData);
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setCheckingPrices(false);
    }
  };

  return (
    <div className="form">
      <div className="form__unselected-symptoms">
        <h2 className="form__title">All Symptoms</h2>
        <input
          type="text"
          placeholder="Search symptoms..."
          className="form__search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="form__symptoms">
          {filteredSymptoms.map((symptom) => (
            <Symptom
              key={symptom}
              name={symptom}
              state="not_selected"
              onSelectMaybe={() => handleSelectMaybe(symptom)}
              onSelectYes={() => handleSelectYes(symptom)}
              onSelectNo={() => handleSelectNo(symptom)}
              onRemove={() => {}}
            />
          ))}
        </div>
      </div>
      <div className="form__selected-symptoms">
        <h2 className="form__title">Selected Symptoms</h2>
        <div className="form__symptoms">
          {selectedSymptoms.map((symptom) => (
            <Symptom
              key={symptom.name}
              name={symptom.name}
              state={symptom.state}
              onSelectMaybe={() => handleSelectMaybe(symptom.name)}
              onSelectYes={() => handleSelectYes(symptom.name)}
              onSelectNo={() => handleSelectNo(symptom.name)}
              onRemove={() => handleRemove(symptom.name)}
            />
          ))}
        </div>
      </div>
      <button className="form__submit" onClick={handleSubmit} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
      </button>
      {finalPrognosis ? (
        <div className="form__final-prognosis">
          <h3>Final Prognosis: {finalPrognosis}</h3>
          <p>Confidence: {prognoses.find((prog) => prog.prognosis === finalPrognosis)?.confidence}</p>
          <div className="form__prognosis-details">
            <p>
              <strong>Severity:</strong> {prognosesData[finalPrognosis]?.severity}
            </p>
            <p>
              <strong>Description:</strong> {prognosesData[finalPrognosis]?.description}
            </p>
            <p>
              <strong>Medications:</strong> {prognosesData[finalPrognosis]?.medications?.join(", ")}
            </p>
            <p>
              <strong>Remedies:</strong> {prognosesData[finalPrognosis]?.remedies?.join(", ")}
            </p>
          </div>
          <button className="form__check-prices" onClick={handleCheckPrices} disabled={checkingPrices}>
            {checkingPrices ? <CircularProgress size={16} color="inherit" /> : "Check for Prices"}
          </button>
          {medicationPrices && medicationPrices.length > 0 && (
            <div className="form__prices">
              <h4>Medication Prices:</h4>
              <ul>
                {medicationPrices.map((med: { name: string; type: string; price: string }) => (
                  <li key={med.name}>
                    <strong>{med.name}</strong> ({med.type}): {med.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        nextSymptom && (
          <div className="form__next-symptom">
            <h3>Do you have "{nextSymptom}"?</h3>
            <Symptom
              name={nextSymptom}
              state="not_selected"
              onSelectMaybe={() => handleSelectMaybe(nextSymptom)}
              onSelectYes={() => handleSelectYes(nextSymptom)}
              onSelectNo={() => handleSelectNo(nextSymptom)}
              onRemove={() => {}}
            />
          </div>
        )
      )}
      {!finalPrognosis && prognoses.length > 0 && (
        <div className="form__prognoses">
          <h2>Prognoses</h2>
          {prognoses.map((prog) => (
            <div key={prog.prognosis} className="prognosis">
              <h3>{prog.prognosis} <button className="form__confirm-button" onClick={() => handleConfirm(prog.prognosis)}>Confirm</button></h3>
              <p>Confidence: {prog.confidence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
