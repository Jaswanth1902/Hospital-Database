import React from 'react';
import { Users, Calendar, Pill, Receipt, Activity, Hospital } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isConnected }) {
  const menuItems = [
    { id: 'patients', label: 'Patient Desk', icon: Users },
    { id: 'doctor', label: 'Doctor Morning Dashboard', icon: Calendar },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill },
    { id: 'billing', label: 'Billing & Debts', icon: Receipt },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-header">
        <div className="brand-icon">
          <Hospital size={24} />
        </div>
        <span className="brand-title">MedPulse PERN</span>
      </div>

      <ul className="nav-list">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <button onClick={() => setActiveTab(item.id)}>
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="status-badge">
        <div className="pulse-dot" style={{ backgroundColor: isConnected ? '#10b981' : '#f43f5e', boxShadow: isConnected ? '0 0 10px #10b981' : '0 0 10px #f43f5e' }} />
        <span>PostgreSQL API: {isConnected ? 'Online' : 'Connecting...'}</span>
      </div>
    </aside>
  );
}
