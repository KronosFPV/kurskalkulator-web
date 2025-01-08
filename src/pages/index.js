import React from 'react';

const KursCalculator = () => {
  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    stundensatz: '',
    anzahlLektionen: '',
    kursdauerMinuten: '',
    kursgebuehr: '',
    teilnehmer: '',
    vorbereitungszeit: '',
    snackkosten: '',
    raummiete: ''
  });
  const [showResults, setShowResults] = React.useState(false);

  const MONATLICHE_LIZENZKOSTEN = 140;
  const KURS_MONATE = 2;
  const LIZENZKOSTEN_PRO_KURS = MONATLICHE_LIZENZKOSTEN * KURS_MONATE / 3;

  const questions = [
    { 
      key: 'stundensatz', 
      label: 'Wie hoch ist Ihr Stundensatz? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 35'
    },
    { 
      key: 'anzahlLektionen', 
      label: 'Wie viele Lektionen hat dieser Kurs insgesamt?', 
      type: 'number', 
      placeholder: 'z.B. 8'
    },
    {
      key: 'kursdauerMinuten',
      label: 'Wie lange dauert eine Lektion? (Minuten)',
      type: 'number',
      placeholder: 'z.B. 80 für 1h 20min'
    },
    { 
      key: 'kursgebuehr', 
      label: 'Wie viel kostet der gesamte Kurs pro Teilnehmer? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 200'
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
      key: 'snackkosten', 
      label: 'Budget für Snacks/Geschenke pro Lektion? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 20' 
    },
    { 
      key: 'raummiete', 
      label: 'Wie hoch ist die Raummiete pro Lektion? (CHF)', 
      type: 'number', 
      placeholder: 'z.B. 100' 
    }
  ];

  const calculateResults = () => {
    const lizenzkostenProLektion = LIZENZKOSTEN_PRO_KURS / Number(formData.anzahlLektionen);
    const zusatzkostenProLektion = Number(formData.snackkosten) + Number(formData.raummiete) + lizenzkostenProLektion;
    
    // Umrechnung der Kursdauer von Minuten in Stunden
    const kursdauerStunden = Number(formData.kursdauerMinuten) / 60;
    const zeitaufwandProLektion = Number(formData.vorbereitungszeit) + kursdauerStunden;
    const zeitkostenProLektion = zeitaufwandProLektion * Number(formData.stundensatz);
    const einnahmenProLektion = Number(formData.kursgebuehr) * Number(formData.teilnehmer) / Number(formData.anzahlLektionen);

    const gesamtZeitkosten = zeitkostenProLektion * Number(formData.anzahlLektionen);
    const gesamtZusatzkosten = (Number(formData.snackkosten) + Number(formData.raummiete)) * Number(formData.anzahlLektionen) + LIZENZKOSTEN_PRO_KURS;
    const gesamtEinnahmen = Number(formData.kursgebuehr) * Number(formData.teilnehmer);
    const gesamtGewinn = gesamtEinnahmen - gesamtZeitkosten - gesamtZusatzkosten;

    const stundenaufwandGesamt = zeitaufwandProLektion * Number(formData.anzahlLektionen);
    const stundenlohnEffektiv = gesamtGewinn / stundenaufwandGesamt;

    return {
      zeitaufwandProLektion,
      zeitkostenProLektion,
      zusatzkostenProLektion,
      lizenzkostenProLektion,
      einnahmenProLektion,
      gesamtZeitkosten,
      gesamtZusatzkosten,
      gesamtEinnahmen,
      gesamtGewinn,
      stundenaufwandGesamt,
      stundenlohnEffektiv
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
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4 text-white">
          {showResults ? 'Kurs-Auswertung' : 'Kurs-Kalkulator'}
        </h1>
        
        {!showResults ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Schritt {step + 1} von {questions.length}
            </div>
            
            <div className="space-y-2">
              <label className="block text-lg text-white">{currentQuestion.label}</label>
              <input
                type={currentQuestion.type}
                value={formData[currentQuestion.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                min="0"
                step="any"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 text-white"
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
                  <h3 className="font-bold text-lg text-white">Pro Lektion:</h3>
                  <div className="space-y-2 text-gray-200">
                    <p>Zeitaufwand: {results.zeitaufwandProLektion} Stunden</p>
                    <p>Zeitkosten: {results.zeitkostenProLektion.toFixed(2)} CHF</p>
                    <p>Lizenzkosten-Anteil: {results.lizenzkostenProLektion.toFixed(2)} CHF</p>
                    <p>Zusatzkosten gesamt: {results.zusatzkostenProLektion.toFixed(2)} CHF</p>
                    <p>Einnahmen: {results.einnahmenProLektion.toFixed(2)} CHF</p>
                  </div>

                  <h3 className="font-bold text-lg pt-4 text-white">Gesamtberechnung für {formData.anzahlLektionen} Lektionen:</h3>
                  <div className="space-y-2 text-gray-200">
                    <p>Gesamter Zeitaufwand: {results.stundenaufwandGesamt} Stunden</p>
                    <p>Gesamte Zeitkosten: {results.gesamtZeitkosten.toFixed(2)} CHF</p>
                    <p>Gesamte Zusatzkosten: {results.gesamtZusatzkosten.toFixed(2)} CHF</p>
                    <p>Gesamte Einnahmen: {results.gesamtEinnahmen.toFixed(2)} CHF</p>
                    <p className="text-lg font-bold pt-2">
                      {results.gesamtGewinn >= 0 ? (
                        <span className="text-green-400">Gewinn: {results.gesamtGewinn.toFixed(2)} CHF</span>
                      ) : (
                        <span className="text-red-400">Verlust: {Math.abs(results.gesamtGewinn).toFixed(2)} CHF</span>
                      )}
                    </p>
                    <p className="pt-2">
                      Effektiver Stundenlohn: {results.stundenlohnEffektiv.toFixed(2)} CHF
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-gray-700 rounded text-sm">
                    <h4 className="font-bold mb-2 text-white">Berechnungsgrundlagen:</h4>
                    <ul className="space-y-1 text-gray-200">
                      <li>• Stundensatz: {formData.stundensatz} CHF/h</li>
                      <li>• Kursgebühr pro Teilnehmer: {formData.kursgebuehr} CHF</li>
                      <li>• Anzahl Lektionen: {formData.anzahlLektionen}</li>
                      <li>• Anzahl Teilnehmer: {formData.teilnehmer}</li>
                      <li>• Lizenzkosten-Anteil: {LIZENZKOSTEN_PRO_KURS.toFixed(2)} CHF pro Kurs</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setStep(0);
                      setFormData({
                        stundensatz: '',
                        anzahlLektionen: '',
                        kursdauerMinuten: '',
                        kursgebuehr: '',
                        teilnehmer: '',
                        vorbereitungszeit: '',
                        snackkosten: '',
                        raummiete: ''
                      });
                      setShowResults(false);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
