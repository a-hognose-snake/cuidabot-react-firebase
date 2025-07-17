import React, { useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      setError('Failed to create an account. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
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
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>
        <div className="auth-switch-link">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
