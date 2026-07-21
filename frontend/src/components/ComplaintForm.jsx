import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetForm, setFormData, setRiskAssessment } from '../store/complaintSlice';
import axios from 'axios';
import { RotateCcw, Save, ShieldCheck } from 'lucide-react';

export default function ComplaintForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);
  const riskAssessment = useSelector((state) => state.complaint.riskAssessment);
  const isProcessing = useSelector((state) => state.complaint.isProcessing);

  const handleReset = () => {
    dispatch(resetForm());
  };

  const handleSave = async () => {
    if (!formData.product_name && !formData.customer_name) {
      alert("Form is empty! Please log a complaint using the AI assistant on the right.");
      return;
    }

    try {
      const payload = {
        ...formData,
        ...riskAssessment
      };
      const res = await axios.post('/api/complaints/', payload);
      alert(`Complaint #${res.data.id} successfully saved to DB with status '${res.data.status}'!`);
    } catch (e) {
      console.error(e);
      alert("Failed to save complaint to Database.");
    }
  };

  return (
    <div className="card-panel">
      {/* 1. ORIGIN & CUSTOMER DETAILS */}
      <div className="section-header">1. Origin & Customer Details</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Complaint Source</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.complaint_source || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.customer_name || ''}
            readOnly
          />
        </div>
      </div>

      {/* 2. PRODUCT & BATCH IDENTIFICATION */}
      <div className="section-header" style={{ marginTop: '12px' }}>2. Product & Batch Identification</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.product_name || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Product Strength/Grade</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.product_strength || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Batch/Lot Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.batch_number || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Manufacturing Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.mfg_date || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Expiry Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.expiry_date || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity Affected</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.quantity_affected || ''}
            readOnly
          />
        </div>
      </div>

      {/* 3. COMPLAINT DETAILS */}
      <div className="section-header" style={{ marginTop: '12px' }}>3. Complaint Details</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Complaint Type</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.complaint_type || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Complaint Date</label>
          <input
            type="text"
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.complaint_date || ''}
            readOnly
          />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Detailed Complaint Description</label>
          <textarea
            className="form-control"
            placeholder="Awaiting AI extraction..."
            value={formData.detailed_description || ''}
            readOnly
          />
        </div>
      </div>

      {/* 4. INITIAL ASSESSMENT & PRIORITY (AI Co-pilot Risk Assessment) */}
      <div className="section-header" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>4. Initial Assessment & Priority</span>
        <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 'bold' }}>AI CO-PILOT ASSESSED</span>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Initial Severity</label>
          <select
            className="form-control"
            value={riskAssessment.initial_severity || 'Major'}
            disabled
          >
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-control"
            value={riskAssessment.priority || 'High'}
            disabled
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        {riskAssessment.recommended_action && (
          <div className="form-group full-width" style={{ background: '#EFF6FF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1E40AF' }}>Recommended Next Action:</span>
            <span style={{ fontSize: '12px', color: '#1E3A8A', marginLeft: '6px' }}>{riskAssessment.recommended_action}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button className="btn btn-secondary" onClick={handleReset} disabled={isProcessing}>
          <RotateCcw size={14} /> Reset Form
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={isProcessing}>
          <Save size={14} /> Save Complaint
        </button>
      </div>
    </div>
  );
}
