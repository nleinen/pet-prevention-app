import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
 
   const orderedProducts = {
     "Heartworm/Flea/Tick": ["Simparica Trio", "Proheart 12 + Bravecto", "Proheart 12 + Nexgard", "Heartgard Plus + Nexgard"],
     "Heartworm": ["Proheart 12", "Heartgard Plus"],
     "Flea/Tick": ["Bravecto", "Nexgard"]
   };
 
   const organizedRecommendations = matchedRecommendations.reduce((acc, rec) => {
     if (!acc[rec.coverage]) acc[rec.coverage] = [];
     acc[rec.coverage].push(rec);
     return acc;
   }, {});
 
   const sortedCoverageKeys = ["Heartworm/Flea/Tick", "Heartworm", "Flea/Tick"];
   const sortedRecommendations = sortedCoverageKeys.map(key => {
     const products = organizedRecommendations[key] || [];
     products.sort((a, b) => orderedProducts[key].indexOf(a.name) - orderedProducts[key].indexOf(b.name));
     return { [key]: products };
   }).filter(group => Object.values(group)[0].length > 0);
 
   setRecommendationsList(sortedRecommendations);
 };
 
   return (
     <div style={styles.container}>
       <h1 style={styles.title}>Pet Prevention Recommendation Tool</h1>
       <div style={styles.inputContainer}>
         <select value={species} onChange={(e) => setSpecies(e.target.value)} style={styles.input}>
           <option value="dog">Dog</option>
           <option value="cat">Cat</option>
         </select>
         <input 
           type="number" 
           value={weight} 
           onChange={(e) => setWeight(e.target.value)} 
           placeholder="Enter Weight (lbs)" 
           style={styles.input}
         />
         <button onClick={handleGenerate} style={styles.button}>
           Generate
         </button>
       </div>
       {error && <div style={styles.error}>{error}</div>}
       <div style={styles.tableContainer}>
         {recommendationsList.map((group, index) => {
           const coverageType = Object.keys(group)[0];
           const products = group[coverageType];
 
           return (
             <div key={index} style={styles.coverageGroup}>
               <h2 style={styles.header}>{coverageType}</h2>
               {products.map((rec, idx) => (
                 <div key={idx} style={styles.productContainer}>
                   <div style={styles.leftColumn}>
                     <strong style={{ fontSize: '14px' }}>{rec.name}</strong><br />
                     <span style={{ fontSize: '13px' }}>{rec.description}</span>
                   </div>
                   <div style={styles.rightColumn}>
                     <div style={{ fontSize: '16px' }}>6-Month: {rec.prices['6-month'] || 'N/A'}</div>
                     <div style={{ fontSize: '16px' }}>12-Month: {rec.prices['12-month'] || 'N/A'}</div>
                   </div>
                 </div>
               ))}
             </div>
           );
         })}
       </div>
     </div>
   );
 };
 
 const styles = {
   container: {
     padding: '20px',
     backgroundColor: '#f0f4f8',
     maxWidth: '1200px',
     margin: '0 auto',
     borderRadius: '12px',
   },
   title: {
     textAlign: 'left',
     fontSize: '28px',
     marginBottom: '20px',
   },
   productContainer: {
     display: 'flex',
     justifyContent: 'space-between',
     padding: '10px',
     marginBottom: '10px',
     border: '1px solid #0D6EFD',
     borderRadius: '8px',
     alignItems: 'center',
   },
   leftColumn: {
     width: '50%',
   },
   rightColumn: {
     width: '50%',
     textAlign: 'left',
     textAlign: 'right',
   }
 };
 
 export default PetPreventionApp;


=======
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

  const orderedProducts = {
    "Heartworm/Flea/Tick": ["Simparica Trio", "Proheart 12 + Bravecto", "Proheart 12 + Nexgard", "Heartgard Plus + Nexgard"],
    "Heartworm": ["Proheart 12", "Heartgard Plus"],
    "Flea/Tick": ["Bravecto", "Nexgard"]
  };

  const organizedRecommendations = matchedRecommendations.reduce((acc, rec) => {
    if (!acc[rec.coverage]) acc[rec.coverage] = [];
    acc[rec.coverage].push(rec);
    return acc;
  }, {});

  const sortedCoverageKeys = ["Heartworm/Flea/Tick", "Heartworm", "Flea/Tick"];
  const sortedRecommendations = sortedCoverageKeys.map(key => {
    const products = organizedRecommendations[key] || [];
    products.sort((a, b) => orderedProducts[key].indexOf(a.name) - orderedProducts[key].indexOf(b.name));
    return { [key]: products };
  }).filter(group => Object.values(group)[0].length > 0);

  setRecommendationsList(sortedRecommendations);
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pet Prevention Recommendation Tool</h1>
      <div style={styles.inputContainer}>
        <select value={species} onChange={(e) => setSpecies(e.target.value)} style={styles.input}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
        <input 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          placeholder="Enter Weight (lbs)" 
          style={styles.input}
        />
        <button onClick={handleGenerate} style={styles.button}>
          Generate
        </button>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.tableContainer}>
        {recommendationsList.map((group, index) => {
          const coverageType = Object.keys(group)[0];
          const products = group[coverageType];

          return (
            <div key={index} style={styles.coverageGroup}>
              <h2 style={styles.header}>{coverageType}</h2>
              {products.map((rec, idx) => (
                <div key={idx} style={styles.productContainer}>
                  <div style={styles.leftColumn}>
                    <strong style={{ fontSize: '14px' }}>{rec.name}</strong><br />
                    <span style={{ fontSize: '13px' }}>{rec.description}</span>
                  </div>
                  <div style={styles.rightColumn}>
                    <div style={{ fontSize: '16px' }}>6-Month: {rec.prices['6-month'] || 'N/A'}</div>
                    <div style={{ fontSize: '16px' }}>12-Month: {rec.prices['12-month'] || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f4f8',
    maxWidth: '1200px',
    margin: '0 auto',
    borderRadius: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px',
  },
  productContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #0D6EFD',
    borderRadius: '8px',
    alignItems: 'center',
  },
  leftColumn: {
    width: '50%',
  },
  rightColumn: {
    width: '50%',
    textAlign: 'right',
  }
};

export default PetPreventionApp;
>>>>>>> 89826a55a74ee9536733f4f30376deb0eeb79849

































