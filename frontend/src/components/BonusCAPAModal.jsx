import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowCAPAModal } from '../store/complaintSlice';
import { Sparkles, AlertTriangle, CheckCircle, ShieldCheck, X } from 'lucide-react';

export default function BonusCAPAModal() {
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.complaint.showCAPAModal);
  const capaData = useSelector((state) => state.complaint.capaData);

  if (!showModal || !capaData) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(setShowCAPAModal(false))}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color="#0284C7" size={22} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>AI Root Cause & CAPA Recommendation</h2>
          </div>
          <button
            onClick={() => dispatch(setShowCAPAModal(false))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Completeness Score */}
        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 'bold' }}>Complaint Data Completeness Score</div>
            <div style={{ fontSize: '11px', color: '#0284C7' }}>Sufficient details present for QA root cause analysis</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284C7' }}>
            {capaData.completeness_score}
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="#D97706" /> AI Recommended Root Cause
          </div>
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#92400E' }}>
            {capaData.root_cause_analysis}
          </div>
        </div>

        {/* Corrective Actions */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#16A34A" /> Suggested Corrective Actions (Immediate)
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
            {capaData.corrective_actions?.map((ca, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{ca}</li>
            ))}
          </ul>
        </div>

        {/* Preventive Actions */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#2563EB" /> Suggested Preventive Actions (Long-Term CAPA)
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
            {capaData.preventive_actions?.map((pa, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{pa}</li>
            ))}
          </ul>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={() => dispatch(setShowCAPAModal(false))}>
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
