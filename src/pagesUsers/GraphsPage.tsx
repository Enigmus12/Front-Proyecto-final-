import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/GraphsPage.css';

const GraphsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoutmenu = () => {
    navigate('/'); 
  };

  return (
    <div className="graphs-container">
      <div className="graphs-content">
        <h1>Acá van las gráficas</h1>
        <button className="btn-logmenu" onClick={handleLogoutmenu}>
          Volver al menú
        </button>
        <div className="graphs-placeholder">
          <div className="placeholder-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <line x1="3" y1="20" x2="21" y2="20" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphsPage;
