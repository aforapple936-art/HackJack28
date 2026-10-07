import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DecisionDetail from './pages/DecisionDetail';
import NearbySearch from './pages/NearbySearch';
import ResearchPage from './pages/ResearchPage';
import PreferencesPage from './pages/PreferencesPage';
import UsagePage from './pages/UsagePage';
import CompareDecisions from './pages/CompareDecisions';
import DecisionInterview from './components/DecisionInterview';
import AlertManager from './components/AlertManager';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('decisions');
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const handleSelectDecision = (id) => {
    setSelectedDecisionId(id);
    setActiveTab('detail');
  };

  const handleBackToDecisions = () => {
    setSelectedDecisionId(null);
    setActiveTab('decisions');
  };

  const handleInterviewComplete = async (extracted) => {
    try {
      // 1. Generate criteria via Gemini
      const criteriaRes = await api.generateCriteria(extracted.goal, extracted.domain);
      const generatedCriteria = (criteriaRes && criteriaRes.data) || [
        { name: 'Core Capability', weight: 35, scale_type: 'higher_is_better', unit: 'Score /10' },
        { name: 'Cost & Efficiency', weight: 30, scale_type: 'lower_is_better', unit: 'INR' },
        { name: 'Reliability', weight: 20, scale_type: 'higher_is_better', unit: 'Score /10' },
        { name: 'Support & Warranty', weight: 15, scale_type: 'higher_is_better', unit: 'Years' }
      ];

      // 2. Discover candidate alternatives via provider
      const altRes = await api.discoverAlternatives(extracted.domain, extracted.goal, extracted.budget);
      const candidateAlternatives = (altRes && altRes.data) || [];

      // 3. Create the new decision
      const created = await api.createDecision({
        title: extracted.title,
        goal: extracted.goal,
        domain: extracted.domain,
        subdomain: extracted.subdomain,
        budget: extracted.budget,
        currency: extracted.currency,
        criteria: generatedCriteria,
        alternatives: candidateAlternatives,
        constraints: extracted.constraints || []
      });

      if (created && created.data) {
        handleSelectDecision(created.data.id);
      }
    } catch (err) {
      alert(`Failed to create decision from interview: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDecisionId(null);
          setActiveTab(tab);
        }}
        onNewDecision={() => setIsInterviewOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'decisions' && (
          <Dashboard
            onSelectDecision={handleSelectDecision}
            onNewDecision={() => setIsInterviewOpen(true)}
            onOpenNearby={() => setActiveTab('nearby')}
            onOpenResearch={() => setActiveTab('research')}
          />
        )}

        {activeTab === 'detail' && selectedDecisionId && (
          <DecisionDetail
            decisionId={selectedDecisionId}
            onBack={handleBackToDecisions}
          />
        )}

        {activeTab === 'nearby' && (
          <NearbySearch />
        )}

        {activeTab === 'research' && (
          <ResearchPage
            onSelectDecision={handleSelectDecision}
          />
        )}

        {activeTab === 'compare' && (
          <CompareDecisions
            onSelectDecision={handleSelectDecision}
          />
        )}

        {activeTab === 'preferences' && (
          <PreferencesPage />
        )}

        {activeTab === 'usage' && (
          <UsagePage />
        )}
      </main>

      {/* Decision Interview Assistant Modal */}
      <DecisionInterview
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        onInterviewComplete={handleInterviewComplete}
      />

      {/* Alerts Manager Modal */}
      <AlertManager
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />
    </div>
  );
}

