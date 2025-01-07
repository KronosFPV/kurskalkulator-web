import React from 'react';

const KursCalculator = () => {
  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    parallelKurse: '',
    teilnehmer: '',
    vorbereitungszeit: '',
    materialkosten: '',
    raummiete: ''
  });
  const [showResults, setShowResults] = React.useState(false);

  const MONATLICHE_LIZENZKOSTEN = 140;
  const KURS_MONATE = 2;
  const KURS_WOCHEN = 8;
  const STUNDENSATZ = 35;
  const TEILNEHMER_SATZ = 25;

  const questions = [
    { 
      key: 'parallelKurse', 
      label: 'Wie viele Kurse laufen in diesem Monat insgesamt?', 
      type: 'number', 
      placeholder: 'z.B. 3'
    },
    { 
      key: 'teilnehmer', 
      label: 'Wie viele Teilnehmer sind in diesem Kurs?', 
      type: 'number', 
      placeholder: 'z.B. 8'
    },
    { 
      key: 'vorbereitungszeit', 
      label: 'Wie hoch ist die Vorbereitungszeit pro Lektion? (Stunden)', 
      type: 'number', 
      placeholder: 'z.B. 2' 
    },
    { 
      key: 'materialkosten', 
      label: 'Wie hoch sind die Materialkosten pro Lektion? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 50' 
    },
    { 
      key: 'raummiete', 
      label: 'Wie hoch ist die Raummiete pro Lektion? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 100' 
    }
  ];

  const calculateResults = () => {
    const gesamtLizenzkosten = MONATLICHE_LIZENZKOSTEN * KURS_MONATE;
    const lizenzkostenProKurs = gesamtLizenzkosten / Number(formData.parallelKurse);
    const lizenzkostenProLektion = lizenzkostenProKurs / KURS_WOCHEN;

    const zeitaufwandProLektion = Number(formData.vorbereitungszeit) + 1;
    const zeitkostenProLektion = zeitaufwandProLektion * STUNDENSATZ;
    const zusatzkostenProLektion = Number(formData.materialkosten) + Number(formData.raummiete) + lizenzkostenProLektion;
    const einnahmenProLektion = Number(formData.teilnehmer) * TEILNEHMER_SATZ;

    const gesamtZeitkosten = zeitkostenProLektion * KURS_WOCHEN;
    const gesamtZusatzkosten = (Number(formData.materialkosten) + Number(formData.raummiete)) * KURS_WOCHEN + lizenzkostenProKurs;
    const gesamtEinnahmen = einnahmenProLektion * KURS_WOCHEN;
    const gesamtGewinn = gesamtEinnahmen - gesamtZeitkosten - gesamtZusatzkosten;

    return {
      zeitaufwandProLektion,
      zeitkostenProLektion,
      zusatzkostenProLektion,
      lizenzkostenProKurs,
      lizenzkostenProLektion,
      einnahmenProLektion,
      gesamtZeitkosten,
      gesamtZusatzkosten,
      gesamtEinnahmen,
      gesamtGewinn
    };
  };

  const handleInputChange = (value) => {
    setFormData({
      ...formData,
      [questions[step].key]: value
    });
  };

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4">
          {showResults ? 'Kurs-Auswertung (8 Wochen)' : 'Kurs-Kalkulator'}
        </h1>
        
        {!showResults ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Schritt {step + 1} von {questions.length}
            </div>
            
            <div className="space-y-2">
              <label className="block text-lg">{currentQuestion.label}</label>
              <input
                type={currentQuestion.type}
                value={formData[currentQuestion.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-2 border rounded"
                min="0"
                step="any"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Zurück
              </button>
              <button
                onClick={() => {
                  if (step < questions.length - 1) {
                    setStep(step + 1);
                  } else {
                    setShowResults(true);
                  }
                }}
                disabled={!formData[currentQuestion.key]}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {step === questions.length - 1 ? 'Auswerten' : 'Weiter'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              const results = calculateResults();
              return (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Pro Lektion:</h3>
                  <div className="space-y-2">
                    <p>Zeitaufwand: {results.zeitaufwandProLektion} Stunden</p>
                    <p>Zeitkosten: {results.zeitkostenProLektion.toFixed(2)} CHF</p>
                    <p>Lizenzkosten-Anteil: {results.lizenzkostenProLektion.toFixed(2)} CHF</p>
                    <p>Zusatzkosten gesamt: {results.zusatzkostenProLektion.toFixed(2)} CHF</p>
                    <p>Einnahmen: {results.einnahmenProLektion.toFixed(2)} CHF</p>
                  </div>

                  <h3 className="font-bold text-lg pt-4">Gesamtberechnung (8 Wochen):</h3>
                  <div className="space-y-2">
                    <p>Gesamte Zeitkosten: {results.gesamtZeitkosten.toFixed(2)} CHF</p>
                    <p>Gesamte Zusatzkosten: {results.gesamtZusatzkosten.toFixed(2)} CHF</p>
                    <p>Gesamte Einnahmen: {results.gesamtEinnahmen.toFixed(2)} CHF</p>
                    <p className="text-lg font-bold pt-2">
                      {results.gesamtGewinn >= 0 ? (
                        <span className="text-green-600">Gewinn: {results.gesamtGewinn.toFixed(2)} CHF</span>
                      ) : (
                        <span className="text-red-600">Verlust: {Math.abs(results.gesamtGewinn).toFixed(2)} CHF</span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setStep(0);
                      setFormData({
                        parallelKurse: '',
                        teilnehmer: '',
                        vorbereitungszeit: '',
                        materialkosten: '',
                        raummiete: ''
                      });
                      setShowResults(false);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Neue Berechnung
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default KursCalculator;
