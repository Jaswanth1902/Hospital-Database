import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PatientsView from './components/PatientsView';
import DoctorDashboardView from './components/DoctorDashboardView';
import PharmacyView from './components/PharmacyView';
import BillingView from './components/BillingView';
import EHRModal from './components/EHRModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEHRId, setSelectedEHRId] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        if (res.ok) setIsConnected(true);
        else setIsConnected(false);
      } catch (err) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabTitles = {
    patients: 'Patient Registration & Profiles',
    doctor: "Doctor Morning Dashboard & Examinations",
    pharmacy: 'Pharmacy Station & Drug Inventory',
    billing: 'Billing Department & Accounts Receivable',
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
      />

      <div className="main-wrapper">
        <Header
          title={tabTitles[activeTab]}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="page-content">
          {activeTab === 'patients' && (
            <PatientsView
              searchTerm={searchTerm}
              onSelectEHR={(patientId) => setSelectedEHRId(patientId)}
            />
          )}

          {activeTab === 'doctor' && (
            <DoctorDashboardView
              onSelectEHR={(patientId) => setSelectedEHRId(patientId)}
            />
          )}

          {activeTab === 'pharmacy' && <PharmacyView />}

          {activeTab === 'billing' && <BillingView />}
        </main>
      </div>

      {selectedEHRId && (
        <EHRModal
          patientId={selectedEHRId}
          onClose={() => setSelectedEHRId(null)}
        />
      )}
    </div>
  );
}
