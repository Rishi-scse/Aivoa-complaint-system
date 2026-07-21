import React from 'react';
import Header from './components/Header';
import ComplaintForm from './components/ComplaintForm';
import AIAssistant from './components/AIAssistant';
import SavedComplaintsModal from './components/SavedComplaintsModal';
import BonusCAPAModal from './components/BonusCAPAModal';

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <ComplaintForm />
        <AIAssistant />
      </main>
      <SavedComplaintsModal />
      <BonusCAPAModal />
    </div>
  );
}
