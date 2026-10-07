import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, CheckCircle2, ArrowRight, HelpCircle, X } from 'lucide-react';
import { api } from '../services/api';

export default function DecisionInterview({ isOpen, onClose, onInterviewComplete }) {
  if (!isOpen) return null;

  const [inputStatement, setInputStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!inputStatement.trim()) return;

    setLoading(true);
    try {
      const res = await api.interview(inputStatement);
      if (res && res.data) {
        setExtractedData(res.data);
      }
    } catch (err) {
      alert(`Interview assistant error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleFinalizeDecision = () => {
    if (!extractedData) return;
    onInterviewComplete({
      title: extractedData.decision || inputStatement,
      goal: extractedData.goal || inputStatement,
      domain: extractedData.domain || 'general',
      subdomain: extractedData.subdomain,
      budget: extractedData.budget || 125000,
      currency: extractedData.currency || 'INR',
      userAnswers: answers,
      constraints: extractedData.preliminaryConstraints || []
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0c1122',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>AI Decision Clarification Interview</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Conversational goal extraction, missing-information detection, and constraint discovery
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Prompt Input Form */}
        {!extractedData && (
          <form onSubmit={handleStartInterview}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                What are you trying to decide?
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={inputStatement}
                onChange={(e) => setInputStatement(e.target.value)}
                placeholder="Example: I need a laptop for college, programming, AI experimentation and gaming. My budget is around ₹1.25 lakh."
                style={{ resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* Quick Inspiration Prompts */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                Or try a real demo dilemma:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setInputStatement('I need a laptop for college, programming, AI experimentation and gaming. My budget is around ₹1.25 lakh.')}
                >
                  💻 Laptop under ₹1.25L
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setInputStatement('Find the best dermatologist clinic in Vijayawada with transparent consultation fees under ₹1500.')}
                >
                  🏥 Dermatologist Vijayawada
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setInputStatement('Plan a 4-day vacation from Vijayawada under ₹30,000 budget with hotel and transport included.')}
                >
                  🌴 4-Day Trip under ₹30k
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              {loading ? 'Analyzing with Gemini AI...' : 'Begin Decision Interview'}
            </button>
          </form>
        )}

        {/* Extracted Intent & Clarification Questions */}
        {extractedData && (
          <div>
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Extracted Decision Intent
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                {extractedData.goal || extractedData.decision}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Domain: <strong style={{ color: '#ffffff', textTransform: 'capitalize' }}>{extractedData.domain}</strong></span>
                {extractedData.budget && (
                  <span>Budget: <strong style={{ color: '#ffffff' }}>₹{Number(extractedData.budget).toLocaleString('en-IN')}</strong></span>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={16} color="var(--accent-cyan)" /> Choosy Needs to Clarify ({extractedData.questions?.length || 0} Questions):
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(extractedData.questions || []).map((q, idx) => (
                  <div key={q.id || idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
                      {idx + 1}. {q.question}
                    </div>
                    {q.whyItMatters && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        Why it matters: {q.whyItMatters}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(q.options || ['Yes', 'No', 'Not sure', 'Use default']).map((opt, oIdx) => {
                        const isSelected = answers[q.id || idx] === opt;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id || idx, opt)}
                            className="btn btn-sm"
                            style={{
                              background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                              color: isSelected ? '#22d3ee' : 'var(--text-secondary)',
                              border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {isSelected && <CheckCircle2 size={12} />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Setup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setExtractedData(null)} className="btn btn-secondary btn-sm">
                Back to Prompt
              </button>
              <button onClick={handleFinalizeDecision} className="btn btn-primary">
                Proceed to Multi-Criteria Analysis <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
