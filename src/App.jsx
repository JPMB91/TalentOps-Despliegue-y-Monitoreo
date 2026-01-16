import { useState, useEffect } from 'react';


function App() {
  const [count, setCount] = useState(0);
  const [cached, setCached] = useState('');
  const [loading, setLoading] = useState(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
  const fetchCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/count`);
      const data = await res.json();
      setCount(data.count);
      setCached(data.cached ? '(desde caché)' : '(desde DB)');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  fetchCount();
}, [API_URL]);

  const incrementCount = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/increment`, { method: 'POST' });
      const data = await res.json();
      setCount(data.count);
      setCached('');
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  return (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    minWidth: '100vw'
  }}>
    <h1>Counter</h1>
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      padding: '40px',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      textAlign: 'center'
    }}>
      <h2>Contador: {count}</h2>
      <p style={{ fontSize: '14px', opacity: 0.8 }}>{cached}</p>
      <button 
        onClick={incrementCount}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: '#fff',
          color: '#667eea',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '20px'
        }}
      >
        {loading ? 'Incrementando...' : 'Incrementar'}
      </button>
    </div>
  </div>
);
}

export default App;