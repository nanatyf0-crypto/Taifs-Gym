import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Dumbbell, Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ExerciseLibrary = ({ user }) => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    muscle_group: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const fetchExercises = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.muscle_group) params.append('muscle_group', filters.muscle_group);
      
      const response = await axios.get(`${API}/exercises?${params.toString()}`);
      setExercises(response.data);
    } catch (error) {
      console.error('Fetch exercises error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    return difficulty === 'beginner' ? '#10b981' : difficulty === 'intermediate' ? '#f59e0b' : '#ef4444';
  };

  return (
    <div className="page-wrapper" data-testid="exercise-library-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <Button onClick={() => navigate('/dashboard')} variant="ghost">
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
            Dashboard
          </Button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Dumbbell size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Exercise Library</h1>
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ marginBottom: '2rem' }} data-testid="filters">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Filter size={20} color="#0ea5e9" style={{ marginRight: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0' }}>Filters</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger data-testid="category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Categories</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight</SelectItem>
                  <SelectItem value="weights">Weights</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.difficulty} onValueChange={(value) => setFilters({ ...filters, difficulty: value })}>
                <SelectTrigger data-testid="difficulty-filter">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.muscle_group} onValueChange={(value) => setFilters({ ...filters, muscle_group: value })}>
                <SelectTrigger data-testid="muscle-filter">
                  <SelectValue placeholder="Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Muscles</SelectItem>
                  <SelectItem value="chest">Chest</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="legs">Legs</SelectItem>
                  <SelectItem value="arms">Arms</SelectItem>
                  <SelectItem value="shoulders">Shoulders</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exercises Grid */}
          {loading ? (
            <div className="loading-screen"><div className="loader"></div></div>
          ) : exercises.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Dumbbell size={60} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No exercises found. Add some to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="glass-card fade-in"
                  data-testid={`exercise-${idx}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {exercise.image_url && (
                    <img
                      src={exercise.image_url}
                      alt={exercise.name}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
                    />
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#e2e8f0' }}>{exercise.name}</h3>
                    {exercise.is_premium && (
                      <span style={{ padding: '0.25rem 0.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>PRO</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: `${getDifficultyColor(exercise.difficulty)}20`, color: getDifficultyColor(exercise.difficulty) }}>
                      {exercise.difficulty}
                    </span>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                      {exercise.muscle_group}
                    </span>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                      {exercise.category}
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {exercise.instructions?.substring(0, 100)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Equipment: {exercise.equipment}</span>
                    <span>{exercise.calories_burned} cal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;