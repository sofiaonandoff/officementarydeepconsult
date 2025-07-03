import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InitialInfo from './pages/InitialInfo';
import DesignPreview from './pages/DesignPreview';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function RedirectHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      navigate(redirect, { replace: true });
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <Router basename="/officementaryservice">
      <div className="App">
        <RedirectHandler />
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <img src="/officementaryservice/officementary_logo.png" alt="officementary" style={{ height: '1em', display: 'block' }} />
            </div>
            <div className="service-intro">다음 정보를 입력해주시면 더 빠르고 정확한 상담을 받으실 수 있습니다.</div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/initial-info" replace />} />
            <Route path="/initial-info" element={<InitialInfo />} />
            <Route path="/design-preview" element={<DesignPreview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
