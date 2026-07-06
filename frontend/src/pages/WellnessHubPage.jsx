// src/pages/WellnessHubPage.jsx
import React, { useState, useEffect } from 'react';
import './WellnessHubPage.css';

export default function WellnessHubPage() {
    // View states: 'hub', 'genderSelect', 'muscleSelect', 'dietSelect'
    const [view, setView] = useState('hub');
    const [data, setData] = useState({ workouts: null, diets: null, suggestion: { men: '...', women: '...' } });
    const [loading, setLoading] = useState(true);

    // User selections for Workouts
    const [gender, setGender] = useState('men');
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [displayedExercises, setDisplayedExercises] = useState([]);
    
    // --- ADDED STATE FOR DIET SELECTIONS ---
    const [selectedDietGoal, setSelectedDietGoal] = useState('weight_loss');
    const [selectedDietType, setSelectedDietType] = useState('non_veg');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workoutsRes, dietsRes, suggestionRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/content/workouts'),
                    fetch('http://127.0.0.1:8000/content/diets'),
                    fetch('http://127.0.0.1:8000/content/suggestion')
                ]);

                const workoutsData = await workoutsRes.json();
                const dietsData = await dietsRes.json();
                const suggestionData = await suggestionRes.json();

                if (!workoutsData || !dietsData || !suggestionData) {
                    throw new Error("Failed to fetch data from the backend.");
                }

                setData({ workouts: workoutsData, diets: dietsData, suggestion: suggestionData });
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        const suggestedMuscle = data.suggestion[selectedGender];
        setSelectedMuscle(suggestedMuscle);
        setDisplayedExercises([]); 
        setView('muscleSelect');
    };

    const handleShowWorkouts = () => {
        if (data.workouts && selectedMuscle) {
            setDisplayedExercises(data.workouts[gender]?.[selectedMuscle] || []);
        }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="hub-page">
            {/* -------- HUB VIEW -------- */}
            {view === 'hub' && (
                <>
                    <div className="hub-header"><h1>Wellness Hub</h1></div>
                    <div className="recommendation-section">
                        <h2>Today's Recommendation</h2>
                        <p>
                            We suggest training <strong>{data.suggestion.men?.toUpperCase()}</strong> (Men) or 
                            <strong> {data.suggestion.women?.toUpperCase()}</strong> (Women) today.
                        </p>
                    </div>
                    <div className="choice-container">
                        <div className="choice-card" onClick={() => setView('genderSelect')}>
                            <h3>Explore Workouts</h3>
                            <p>Select a gender and muscle group to see exercises.</p>
                        </div>
                        <div className="choice-card" onClick={() => setView('dietSelect')}>
                            <h3>Explore Diet Plans</h3>
                            <p>Find meal plans based on your goals.</p>
                        </div>
                    </div>
                </>
            )}

            {/* -------- GENDER SELECTION VIEW -------- */}
            {view === 'genderSelect' && (
                <div className="content-display">
                    <button className="back-button" onClick={() => setView('hub')}>← Back to Hub</button>
                    <h2>Select a Workout Plan</h2>
                    <div className="gender-select-container">
                        <div className="gender-card" onClick={() => handleGenderSelect('men')}>
                            <img src="menworkout.jpg" alt="Men's workout" />
                            <h3>Men's Plan</h3>
                        </div>
                        <div className="gender-card" onClick={() => handleGenderSelect('women')}>
                            <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5" alt="Women's workout" />
                            <h3>Women's Plan</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* -------- MUSCLE SELECTION VIEW -------- */}
            {view === 'muscleSelect' && (
                <div className="content-display">
                    <button className="back-button" onClick={() => setView('genderSelect')}>← Change Gender</button>
                    <h2>{gender === 'men' ? "Men's" : "Women's"} Workout Library</h2>
                    <div className="suggestion-box">
                        Today's Suggestion: <strong>{data.suggestion[gender]?.toUpperCase()}</strong>
                    </div>

                    <div className="filters">
                        <div className="filter-group">
                            <label>Muscle Group:</label>
                            <select onChange={(e) => { setSelectedMuscle(e.target.value); setDisplayedExercises([]); }} value={selectedMuscle}>
                                <option value="">Select...</option>
                                {data.workouts && data.workouts[gender] && Object.keys(data.workouts[gender]).map(muscle => (
                                    <option key={muscle} value={muscle}>
                                        {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="submit-button" onClick={handleShowWorkouts}>Show Workouts</button>
                    </div>

                    {displayedExercises.length > 0 && (
                        <div className="card-container">
                            {displayedExercises.map((exercise, i) => (
                                <div className="plan-card" key={i}>
                                    <img src={exercise.image_url} alt={exercise.name} className="card-image" />
                                    <div className="card-content">
                                        <h3>{exercise.name}</h3>
                                        <p className="sets-reps">{exercise.sets} sets of {exercise.reps} reps</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* -------- DIET SELECTION VIEW (NOW COMPLETE) -------- */}
            {view === 'dietSelect' && (
                <div className="content-display">
                    <button className="back-button" onClick={() => setView('hub')}>← Back to Hub</button>
                    <h2>Diet Library</h2>
                    <div className="filters">
                        <div className="filter-group">
                           <label>Goal:</label>
                           <div className="toggle-buttons">
                               <button onClick={() => setSelectedDietGoal('weight_loss')} className={selectedDietGoal === 'weight_loss' ? 'active' : ''}>Weight Loss</button>
                               <button onClick={() => setSelectedDietGoal('muscle_gain')} className={selectedDietGoal === 'muscle_gain' ? 'active' : ''}>Muscle Gain</button>
                           </div>
                       </div>
                       <div className="filter-group">
                           <label>Preference:</label>
                           <div className="toggle-buttons">
                               <button onClick={() => setSelectedDietType('non_veg')} className={selectedDietType === 'non_veg' ? 'active' : ''}>Non-Veg</button>
                               <button onClick={() => setSelectedDietType('veg')} className={selectedDietType === 'veg' ? 'active' : ''}>Veg</button>
                           </div>
                       </div>
                   </div>
                   <div className="card-container">
                        {(data.diets?.[selectedDietGoal]?.[selectedDietType] || []).map((meal, i) => (
                            <div className="plan-card" key={i}>
                               <img src={meal.image_url} alt={meal.name} className="card-image"/>
                               <div className="card-content">
                                   <h3>{meal.name}</h3>
                                   <p className="sets-reps">{meal.type}</p>
                                   {meal.desc && <p>{meal.desc}</p>}
                               </div>
                           </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}