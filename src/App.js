import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GOOGLE_SHEET_ID = '2PACX-1vSJ1WqsqGhW46D5MRCWpLWGBeVU6ig_ADRFPXfJrMEnDrcmwK1OmzDihpYxsRm0WynwrUIk-jetNjEZ';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${GOOGLE_SHEET_ID}/pub?output=csv`;

const PetPreventionApp = () => {
  const [species, setSpecies] = useState('dog');
  const [weight, setWeight] = useState('');
  const [recommendationsList, setRecommendationsList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(SHEET_URL);
        const rows = response.data.split('\n').slice(1);
        const formattedData = [];

        rows.forEach((row) => {
          const cells = row.split(',');

          if (cells.length < 8) return;  

          const [species, weightMin, weightMax, name, coverage, sixMonthPrice, twelveMonthPrice, description] = cells.map(cell => cell.trim());

          if (!species || !weightMin || !weightMax || !name) return;

          formattedData.push({
            species: species.toLowerCase(),
            weightMin: parseFloat(weightMin),
            weightMax: parseFloat(weightMax),
            name,
            coverage,
            description,
            prices: { "6-month": sixMonthPrice, "12-month": twelveMonthPrice }
          });
        });

        setRecommendations(formattedData);
        setError(null);
      } catch (error) {
        setError('Error fetching data. Ensure your sheet is published to the web.');
      }
    };

    fetchRecommendations();
  }, []);

const handleGenerate = () => {
  const parsedWeight = parseFloat(weight);

  if (isNaN(parsedWeight)) {
      alert('Please enter a valid number for weight.');
      return;
  }

  const speciesKey = species.toLowerCase();
  const matchedRecommendations = recommendations.filter(rec => 
    rec.species === speciesKey &&
    parsedWeight >= rec.weightMin &&
    parsedWeight <= rec.weightMax
  );

  const organizedRecommendations = matchedRecommendations.reduce((acc, rec) => {
    if (!acc[rec.coverage]) acc[rec.coverage] = [];
    acc[rec.coverage].push(rec);
    return acc;
  }, {});

  const sortedCoverageKeys = ["Heartworm/Flea/Tick", "Heartworm", "Flea/Tick"];
  const sortedRecommendations = sortedCoverageKeys
    .map(key => ({ [key]: organizedRecommendations[key] || [] }))
    .filter(group => Object.values(group)[0].length > 0);

  // Sorting Products within Categories
  sortedRecommendations.forEach(group => {
    const category = Object.keys(group)[0];
    const products = group[category];

    if (category === "Heartworm/Flea/Tick") {
      products.sort((a, b) => {
        const desiredOrder = [
          "Simparica Trio", 
          "Proheart 12 + Bravecto 3m", 
          "Proheart 12 + Nexgard", 
          "Heartgard Plus + Nexgard"
        ];
        return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
      });
    }

    if (category === "Heartworm") {
      products.sort((a, b) => {
        const desiredOrder = ["Proheart 12", "Heartgard Plus"];
        return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
      });
    }

    if (category === "Flea/Tick") {
      products.sort((a, b) => {
        const desiredOrder = ["Bravecto", "Nexgard"];
        return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
      });
    }
  });

  setRecommendationsList(sortedRecommendations);
};

  return (
    <div style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', padding: '10px', backgroundColor: '#f0f4f8', maxWidth: '1000px', margin: '0 auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ color: '#0D6EFD', textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        Pet Prevention Recommendation Tool
      </h1>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <select value={species} onChange={(e) => setSpecies(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #0D6EFD', marginRight: '5px', fontSize: '16px' }}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
        <input 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          placeholder="Enter Weight (lbs)" 
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #0D6EFD', marginRight: '5px', fontSize: '16px', width: '150px' }}
        />
        <button onClick={handleGenerate} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', fontSize: '16px' }}>
          Generate
        </button>
      </div>
      {recommendationsList.map((coverageGroup, index) => {
        const coverageType = Object.keys(coverageGroup)[0];
        const products = coverageGroup[coverageType];
        
        return (
          <div key={index} style={{ marginBottom: '15px' }}>
            <h2 style={{ color: '#0D6EFD', fontSize: '24px', marginBottom: '5px' }}>{coverageType}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '18px', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0D6EFD', color: 'white' }}>
                  <th>Product</th>
                  <th>Description</th>
                  <th>6-Month Price</th>
                  <th>12-Month Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.name}</td>
                    <td>{rec.description}</td>
                    <td>{rec.prices["6-month"] || "N/A"}</td>
                    <td>{rec.prices["12-month"] || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default PetPreventionApp;

























