import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Sparkles, Image as ImageIcon, Volume2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIStudio = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Image Generation State
  const [imageType, setImageType] = useState('exercise');
  const [exerciseName, setExerciseName] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [generatedImage, setGeneratedImage] = useState(null);
  
  // Voice Generation State
  const [voiceText, setVoiceText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [generatedAudio, setGeneratedAudio] = useState(null);

  const generateImage = async () => {
    if (imageType === 'exercise' && !exerciseName) {
      toast.error('Please enter exercise name');
      return;
    }
    if (imageType === 'meal' && !mealName) {
      toast.error('Please enter meal name');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      
      let response;
      if (imageType === 'exercise') {
        response = await axios.post(
          `${API}/generate-exercise-image`,
          { name: exerciseName, type: 'exercise' },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 90000
          }
        );
      } else {
        response = await axios.post(
          `${API}/generate-meal-image`,
          { name: mealName, type: mealType },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 90000
          }
        );
      }
      
      setGeneratedImage(response.data.image_base64);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateVoice = async () => {
    if (!voiceText) {
      toast.error('Please enter text');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      
      const response = await axios.post(
        `${API}/generate-voice-guidance`,
        { text: voiceText, voice: selectedVoice },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      setGeneratedAudio(response.data.audio_base64);
      toast.success('Voice generated successfully!');
    } catch (error) {
      console.error('Voice generation error:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate voice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="ai-studio-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <Button onClick={() => navigate('/dashboard')} variant="ghost" data-testid="back-btn">
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
            Dashboard
          </Button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Sparkles size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              AI Studio
            </h1>
          </div>

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="image" data-testid="image-tab">
                <ImageIcon size={18} style={{ marginRight: '0.5rem' }} />
                Image Generation
              </TabsTrigger>
              <TabsTrigger value="voice" data-testid="voice-tab">
                <Volume2 size={18} style={{ marginRight: '0.5rem' }} />
                Voice Assistant
              </TabsTrigger>
            </TabsList>

            {/* Image Generation Tab */}
            <TabsContent value="image">
              <div className="glass-card" data-testid="image-generation">
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
                  Generate AI Images
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <Label>Image Type</Label>
                  <Select value={imageType} onValueChange={setImageType}>
                    <SelectTrigger data-testid="image-type-select" style={{ marginTop: '0.5rem' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="meal">Meal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {imageType === 'exercise' ? (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Label htmlFor="exercise-name">Exercise Name</Label>
                    <Input
                      id="exercise-name"
                      data-testid="exercise-name-input"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                      placeholder="e.g., Push-ups, Squats, Deadlift"
                      className="input-field"
                      style={{ marginTop: '0.5rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <Label htmlFor="meal-name">Meal Name</Label>
                      <Input
                        id="meal-name"
                        data-testid="meal-name-input"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder="e.g., Grilled Chicken Salad"
                        className="input-field"
                        style={{ marginTop: '0.5rem' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <Label>Meal Type</Label>
                      <Select value={mealType} onValueChange={setMealType}>
                        <SelectTrigger data-testid="meal-type-select" style={{ marginTop: '0.5rem' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                          <SelectItem value="pre_workout">Pre-Workout</SelectItem>
                          <SelectItem value="post_workout">Post-Workout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button
                  onClick={generateImage}
                  data-testid="generate-image-btn"
                  className="btn-primary"
                  style={{ width: '100%', marginBottom: '2rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} style={{ marginRight: '0.5rem' }} className="animate-spin" />
                      Generating... (this may take up to 1 minute)
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} style={{ marginRight: '0.5rem' }} />
                      Generate Image
                    </>
                  )}
                </Button>

                {generatedImage && (
                  <div data-testid="generated-image" className="fade-in">
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1rem' }}>
                      Generated Image:
                    </h4>
                    <img
                      src={`data:image/png;base64,${generatedImage}`}
                      alt="Generated"
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        border: '2px solid rgba(14, 165, 233, 0.3)'
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Voice Generation Tab */}
            <TabsContent value="voice">
              <div className="glass-card" data-testid="voice-generation">
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
                  Generate Voice Guidance
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <Label htmlFor="voice-text">Text to Speak</Label>
                  <Input
                    id="voice-text"
                    data-testid="voice-text-input"
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    placeholder="e.g., Let's begin with push-ups. 3 sets of 15 reps."
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <Label>Voice Type</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger data-testid="voice-select" style={{ marginTop: '0.5rem' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy - Neutral</SelectItem>
                      <SelectItem value="nova">Nova - Energetic</SelectItem>
                      <SelectItem value="shimmer">Shimmer - Bright</SelectItem>
                      <SelectItem value="echo">Echo - Smooth</SelectItem>
                      <SelectItem value="fable">Fable - Expressive</SelectItem>
                      <SelectItem value="onyx">Onyx - Deep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateVoice}
                  data-testid="generate-voice-btn"
                  className="btn-primary"
                  style={{ width: '100%', marginBottom: '2rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} style={{ marginRight: '0.5rem' }} className="animate-spin" />
                      Generating Voice...
                    </>
                  ) : (
                    <>
                      <Volume2 size={18} style={{ marginRight: '0.5rem' }} />
                      Generate Voice
                    </>
                  )}
                </Button>

                {generatedAudio && (
                  <div data-testid="generated-audio" className="fade-in">
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1rem' }}>
                      Generated Audio:
                    </h4>
                    <audio
                      controls
                      style={{ width: '100%' }}
                      src={`data:audio/mp3;base64,${generatedAudio}`}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
