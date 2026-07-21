import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSavedModal } from '../store/complaintSlice';
import axios from 'axios';
import { X, Database, CheckCircle, RefreshCw } from 'lucide-react';

export default function SavedComplaintsModal() {
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.complaint.showSavedModal);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/complaints/');
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchRecords();
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(setShowSavedModal(false))}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database color="#2563EB" size={20} />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Saved Customer Complaints (DB Records)</h2>
          </div>
          <button
            onClick={() => dispatch(setShowSavedModal(false))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading complaints from Database...</div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
            No saved complaints in database yet. Log a complaint on the main screen and click <b>Save Complaint</b>!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '8px 12px' }}>ID</th>
                  <th style={{ padding: '8px 12px' }}>Customer</th>
                  <th style={{ padding: '8px 12px' }}>Product</th>
                  <th style={{ padding: '8px 12px' }}>Batch #</th>
                  <th style={{ padding: '8px 12px' }}>Severity</th>
                  <th style={{ padding: '8px 12px' }}>Status</th>
                  <th style={{ padding: '8px 12px' }}>Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>#{c.id}</td>
                    <td style={{ padding: '8px 12px' }}>{c.customer_name || 'N/A'}</td>
                    <td style={{ padding: '8px 12px' }}>{c.product_name} ({c.product_strength})</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{c.batch_number}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        background: c.initial_severity === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                        color: c.initial_severity === 'Critical' ? '#991B1B' : '#92400E'
                      }}>
                        {c.initial_severity || 'Major'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span className="status-badge">{c.status}</span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>{c.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={fetchRecords} style={{ marginRight: '8px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => dispatch(setShowSavedModal(false))}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
