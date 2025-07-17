import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, getAllSurveyResponses } from '../services/firestoreService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, Star, Edit, Phone, MapPin, Newspaper } from 'lucide-react';
import Chatbot from '../components/chatbot/Chatbot';
import ChatbotIcon from '../components/chatbot/ChatbotIcon';

const userBlocks = [
  {
    type: 'location',
    icon: <MapPin size={28} className="info-card-icon-main" />,
    title: 'Hospital Clínico Félix Bulnes',
    content: 'Mapocho Sur N° 7432, Cerro Navia, RM',
    details: 'Comunas de Cerro Navia, Quinta Normal y Renca.'
  },
  {
    type: 'contact',
    icon: <Phone size={28} className="info-card-icon-main" />,
    title: 'Mesa Central',
    content: '22 575 4000',
    details: 'Llámanos para consultas generales.'
  },
  {
    type: 'contact',
    icon: <Phone size={28} className="info-card-icon-main" />,
    title: 'Salud Responde',
    content: '600 360 7777',
    details: 'Tiempo de respuesta máximo de acuerdo a normativa: 15 días hábiles, posterior a la recepción del requerimiento en el establecimiento.'
  },
  {
    type: 'location',
    icon: <MapPin size={28} className="info-card-icon-main" />,
    title: 'Oficinas OIRS',
    content: '1° Piso, Torres B y C',
    details: 'Urgencia Adulto, Gineco-obstétrica, Infantil (24 hrs-365 días)'
  },
  {
    type: 'location',
    icon: <MapPin size={28} className="info-card-icon-main" />,
    title: 'Oficina OIRS Block central',
    content: '1° Piso, Torre A',
    details: 'Lunes a Jueves, de 08:00 a 17:00 horas, y Viernes, de 8:00 a 16:00 horas; y festivos, de 09:00 a 17:00 horas.'
  },
  {
    type: 'news',
    icon: <Newspaper size={28} className="info-card-icon-main" />,
    title: 'Últimas Noticias',
    content: 'Campaña de vacunación de invierno ya disponible.',
    details: 'Fechas y horarios.',
    link: 'https://felixbulnes.cl/wp/'
  }
];

const UserDashboard = ({ currentUser }) => (
  <>
    <div className="dashboard-header">
        <h1>Información</h1>
        <Link to="/survey" className="btn btn-primary">
            <Edit size={16} /> Responder Encuesta
        </Link>
    </div>
    <div className="info-grid data-grid">
      {userBlocks.map((block, index) => (
        <div key={index} className="info-card-general data-card">
          <div className="info-card-general-header">
            {block.icon}
            <h3 className="info-card-general-title">{block.title}</h3>
          </div>
          <div className="info-card-general-content">
            <p className="info-card-general-main">{block.content}</p>
            {block.link ? (
              <a href={block.link} target="_blank" rel="noopener noreferrer" className="info-card-general-link">
                {block.details}
              </a>
            ) : (
              <p className="info-card-general-details">{block.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
    <Chatbot currentUser={currentUser} />
  </>
);


// --- COMPONENTE AdminDashboard COMPLETAMENTE NUEVO ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSurveys: 0,
    avgSatisfaction: 0,
    satisfactionDistribution: [],
    surveysByDay: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Obtenemos los datos de usuarios y encuestas al mismo tiempo
        const [users, surveys] = await Promise.all([
          getAllUsers(),
          getAllSurveyResponses()
        ]);

        // Calcular satisfacción promedio
        const totalSatisfaction = surveys.reduce((acc, cur) => acc + cur.overallSatisfaction, 0);
        const avgSatisfaction = surveys.length > 0 ? (totalSatisfaction / surveys.length).toFixed(1) : 0;

        // Calcular distribución de satisfacción para el gráfico de barras
        const distribution = Array(7).fill(0);
        surveys.forEach(s => {
          if (s.overallSatisfaction >= 1 && s.overallSatisfaction <= 7) {
            distribution[s.overallSatisfaction - 1]++;
          }
        });
        const satisfactionDistribution = distribution.map((count, index) => ({
          name: `Nota ${index + 1}`,
          "Nº de Respuestas": count,
        }));
        
        // Calcular encuestas por día para el gráfico de líneas
        const dailyCounts = surveys.reduce((acc, cur) => {
            const date = new Date(cur.submittedAt.seconds * 1000).toLocaleDateString('es-CL');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        const surveysByDay = Object.keys(dailyCounts).map(date => ({
            date,
            "Encuestas": dailyCounts[date]
        })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));


        setStats({
          totalUsers: users.length,
          totalSurveys: surveys.length,
          avgSatisfaction,
          satisfactionDistribution,
          surveysByDay,
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="loading-indicator">Cargando métricas...</div>;
  }

  return (
    <>
      <h1>Panel de Métricas</h1>
      <div className="metrics-grid data-grid">
        {/* Tarjetas de Métricas Principales */}
        <div className="metric-card data-card">
          <div className="metric-header">
            <span className="metric-title">Total de Usuarios</span>
            <Users className="metric-icon" size={22} />
          </div>
          <p className="metric-value">{stats.totalUsers}</p>
        </div>
        <div className="metric-card data-card">
          <div className="metric-header">
            <span className="metric-title">Encuestas Completadas</span>
            <FileText className="metric-icon" size={22} />
          </div>
          <p className="metric-value">{stats.totalSurveys}</p>
        </div>
        <div className="metric-card data-card">
          <div className="metric-header">
            <span className="metric-title">Satisfacción Promedio</span>
            <Star className="metric-icon" size={22} />
          </div>
          <p className="metric-value">{stats.avgSatisfaction} / 7</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid data-grid">
        <div className="chart-card data-card">
          <h3>Distribución de la Satisfacción</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.satisfactionDistribution} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Nº de Respuestas" fill="var(--main-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card data-card">
          <h3>Encuestas por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.surveysByDay} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Encuestas" stroke="var(--accent-secondary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};


export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <ChatbotIcon />
            <span>CuidaBot</span>
          </div>
          <div className="nav-user-section">
            <span className="nav-user-email">¡Hola, {currentUser?.email}!</span>
            {currentUser?.role === 'admin' ? (
              <>
                <Link to="/admin/knowledge" className="nav-link">Chatbot</Link>
                <Link to="/admin/surveys" className="nav-link">Feedback</Link>
                <Link to="/admin/faqs" className="nav-link">FAQs</Link> 
                <Link to="/admin" className="nav-link">Users</Link>
              </>
            ) : (
              <Link to="/faqs" className="nav-link">Preguntas Frecuentes</Link>
            )}
            <button onClick={handleLogout} className="btn btn-secondary">Cerrar sesión</button>
          </div>
        </div>
      </nav>
      <main className="dashboard-main">
        <div className="main-content">
          {currentUser?.role === 'admin' ? <AdminDashboard /> : <UserDashboard currentUser={currentUser} />}
        </div>
      </main>
    </div>
  );
}
