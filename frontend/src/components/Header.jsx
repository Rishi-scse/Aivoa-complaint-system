import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSavedModal, setShowCAPAModal, setCAPAData } from '../store/complaintSlice';
import axios from 'axios';
import { Database, ShieldAlert, Sparkles } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);

  const fetchSavedComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints/');
      dispatch(setShowSavedModal(true));
    } catch (e) {
      console.error(e);
    }
  };

  const openCAPAModal = async () => {
    try {
      const res = await axios.post('/api/ai/bonus/capa', formData);
      dispatch(setCAPAData(res.data));
      dispatch(setShowCAPAModal(true));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-badge">AIVOA</div>
        <div className="header-title-container">
          <h1>Log Customer Complaint</h1>
          <span>API & FDF Quality Assurance Module</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={fetchSavedComplaints}
          title="View saved complaints in MySQL/SQLite DB"
        >
          <Database size={15} /> Database Records
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={openCAPAModal}
          style={{ background: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' }}
          title="Bonus: Run Root Cause & CAPA Analysis"
        >
          <Sparkles size={15} color="#0284C7" /> Root Cause & CAPA
        </button>

        <span className="status-badge">Pending Triage</span>
      </div>
    </header>
  );
}
