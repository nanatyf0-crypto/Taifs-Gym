import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Users, Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Community = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(
        `${API}/posts`,
        {
          content: newPost,
          post_type: 'progress'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost('');
      toast.success('Post created!');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const likePost = async (postId) => {
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(
        `${API}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="page-wrapper" data-testid="community-page">
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Users size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Community</h1>
          </div>

          {/* Create Post */}
          <div className="glass-card" style={{ marginBottom: '2rem' }} data-testid="create-post">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your progress, meals, or achievements..."
              data-testid="post-input"
              className="input-field"
              style={{ marginBottom: '1rem', minHeight: '100px' }}
            />
            <Button
              onClick={createPost}
              data-testid="post-submit-btn"
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <Send size={18} style={{ marginRight: '0.5rem' }} />
              Share Post
            </Button>
          </div>

          {/* Posts Feed */}
          <div data-testid="posts-feed">
            {posts.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Users size={60} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: '#94a3b8' }}>No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post, idx) => (
                <div
                  key={idx}
                  className="glass-card fade-in"
                  data-testid={`post-${idx}`}
                  style={{ marginBottom: '1.5rem', animationDelay: `${idx * 0.05}s` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        color: 'white',
                        fontWeight: '600'
                      }}
                    >
                      U
                    </div>
                    <div>
                      <p style={{ color: '#e2e8f0', fontWeight: '600' }}>User</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p style={{ color: '#e2e8f0', marginBottom: '1rem', lineHeight: '1.6' }}>{post.content}</p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post"
                      style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }}
                    />
                  )}

                  <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button
                      onClick={() => likePost(post.id)}
                      variant="ghost"
                      data-testid={`like-btn-${idx}`}
                      style={{ color: '#94a3b8', padding: '0.5rem' }}
                    >
                      <Heart size={18} style={{ marginRight: '0.5rem' }} />
                      {post.likes} Likes
                    </Button>
                    <Button
                      variant="ghost"
                      style={{ color: '#94a3b8', padding: '0.5rem' }}
                    >
                      <MessageCircle size={18} style={{ marginRight: '0.5rem' }} />
                      {post.comments_count} Comments
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;