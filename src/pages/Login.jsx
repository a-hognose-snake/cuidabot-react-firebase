import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard'); 
    } catch {
      setError('Failed to log in. Check your email and password.');
    }
    setLoading(false);
  }
  
  if (currentUser) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" ref={emailRef} required className="form-input"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" ref={passwordRef} required className="form-input"/>
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="auth-switch-link">
        ¿No tienes cuenta?{' '}
          <Link to="/signup">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
