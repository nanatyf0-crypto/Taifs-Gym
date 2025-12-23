import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, UtensilsCrossed, Filter, Heart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MealLibrary = ({ user }) => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [filters, setFilters] = useState({
    meal_type: '',
    is_budget_friendly: null,
    is_child_friendly: null
  });
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchMeals();
    fetchFavorites();
  }, [filters]);

  const fetchMeals = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.meal_type) params.append('meal_type', filters.meal_type);
      if (filters.is_budget_friendly !== null) params.append('is_budget_friendly', filters.is_budget_friendly);
      if (filters.is_child_friendly !== null) params.append('is_child_friendly', filters.is_child_friendly);
      
      const response = await axios.get(`${API}/meals?${params.toString()}`);
      setMeals(response.data);
    } catch (error) {
      console.error('Fetch meals error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="meal-library-page">
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
            <UtensilsCrossed size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Meal Library</h1>
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ marginBottom: '2rem' }} data-testid="filters">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Filter size={20} color="#0ea5e9" style={{ marginRight: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0' }}>Filters</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Select value={filters.meal_type} onValueChange={(value) => setFilters({ ...filters, meal_type: value })}>
                <SelectTrigger data-testid="meal-type-filter">
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Types</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="pre_workout">Pre-Workout</SelectItem>
                  <SelectItem value="post_workout">Post-Workout</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.is_budget_friendly?.toString() || ''} onValueChange={(value) => setFilters({ ...filters, is_budget_friendly: value === 'true' ? true : value === 'false' ? false : null })}>
                <SelectTrigger data-testid="budget-filter">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="true">Budget-Friendly</SelectItem>
                  <SelectItem value="false">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.is_child_friendly?.toString() || ''} onValueChange={(value) => setFilters({ ...filters, is_child_friendly: value === 'true' ? true : value === 'false' ? false : null })}>
                <SelectTrigger data-testid="child-filter">
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="true">Child-Friendly</SelectItem>
                  <SelectItem value="false">Adult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meals Grid */}
          {loading ? (
            <div className="loading-screen"><div className="loader"></div></div>
          ) : meals.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <UtensilsCrossed size={60} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No meals found. Add some delicious recipes!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {meals.map((meal, idx) => (
                <div
                  key={idx}
                  className="glass-card fade-in"
                  data-testid={`meal-${idx}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt={meal.name}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
                    />
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#e2e8f0' }}>{meal.name}</h3>
                    {meal.is_premium && (
                      <span style={{ padding: '0.25rem 0.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>PRO</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', textTransform: 'capitalize' }}>
                      {meal.meal_type?.replace('_', ' ')}
                    </span>
                    {meal.is_budget_friendly && (
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Budget</span>
                    )}
                    {meal.is_child_friendly && (
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(251, 146, 60, 0.1)', color: '#fb923c' }}>Kid-Friendly</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Calories</p>
                      <p style={{ color: '#0ea5e9', fontWeight: '600' }}>{meal.calories}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Protein</p>
                      <p style={{ color: '#10b981', fontWeight: '600' }}>{meal.protein}g</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Carbs</p>
                      <p style={{ color: '#f59e0b', fontWeight: '600' }}>{meal.carbs}g</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Fats</p>
                      <p style={{ color: '#ef4444', fontWeight: '600' }}>{meal.fats}g</p>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Prep time: {meal.prep_time} min</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealLibrary;