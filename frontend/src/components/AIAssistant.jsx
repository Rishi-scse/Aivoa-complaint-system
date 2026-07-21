import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFormData,
  setRiskAssessment,
  addChatMessage,
  setExtractionProgress,
  setIsProcessing,
} from '../store/complaintSlice';
import axios from 'axios';
import { Bot, UploadCloud, Send, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AIAssistant() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);
  const riskAssessment = useSelector((state) => state.complaint.riskAssessment);
  const chatMessages = useSelector((state) => state.complaint.chatMessages);
  const extractionProgress = useSelector((state) => state.complaint.extractionProgress);
  const extractionStatus = useSelector((state) => state.complaint.extractionStatus);
  const isProcessing = useSelector((state) => state.complaint.isProcessing);

  const [inputPrompt, setInputPrompt] = useState('');
  const fileInputRef = useRef(null);

  // Trigger LLM processing for text prompts or edits
  const handleSendPrompt = async (textToSend) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim()) return;

    dispatch(addChatMessage({ sender: 'user', text: promptText }));
    if (!textToSend) setInputPrompt('');
    
    dispatch(setIsProcessing(true));
    dispatch(setExtractionProgress({ progress: 25, status: 'Parsing prompt and understanding intent...' }));

    try {
      setTimeout(() => {
        dispatch(setExtractionProgress({ progress: 65, status: 'LangGraph executing extraction & risk reasoning...' }));
      }, 300);

      const res = await axios.post('/api/ai/process', {
        prompt: promptText,
        current_form_data: formData,
        current_risk_assessment: riskAssessment,
      });

      setTimeout(() => {
        dispatch(setExtractionProgress({ progress: 100, status: 'Extraction complete. Left form populated.' }));
        dispatch(setFormData(res.data.form_data));
        dispatch(setRiskAssessment(res.data.risk_assessment));
        dispatch(addChatMessage({ sender: 'ai', text: res.data.message }));
        dispatch(setIsProcessing(false));
      }, 700);

    } catch (err) {
      console.error(err);
      dispatch(addChatMessage({ sender: 'ai', text: 'Error connecting to AI service. Please try again.' }));
      dispatch(setExtractionProgress({ progress: 0, status: 'Extraction failed.' }));
      dispatch(setIsProcessing(false));
    }
  };

  // Handle File Upload (Document Extraction Tool)
  const handleFileUpload = async (file) => {
    if (!file) return;

    dispatch(addChatMessage({ sender: 'user', text: `[Uploaded File: ${file.name}]` }));
    dispatch(setIsProcessing(true));
    dispatch(setExtractionProgress({ progress: 20, status: `Reading file ${file.name}...` }));

    const formPayload = new FormData();
    formPayload.append('file', file);
    formPayload.append('prompt', `Extract complaint details from document ${file.name}`);

    try {
      setTimeout(() => {
        dispatch(setExtractionProgress({ progress: 60, status: 'Analyzing document content and extracting key details...' }));
      }, 400);

      const res = await axios.post('/api/ai/upload-doc', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTimeout(() => {
        dispatch(setExtractionProgress({ progress: 100, status: 'Document details successfully extracted & populated!' }));
        dispatch(setFormData(res.data.form_data));
        dispatch(setRiskAssessment(res.data.risk_assessment));
        dispatch(addChatMessage({ sender: 'ai', text: res.data.message }));
        dispatch(setIsProcessing(false));
      }, 800);

    } catch (err) {
      console.error(err);
      dispatch(addChatMessage({ sender: 'ai', text: 'Failed to process document file.' }));
      dispatch(setIsProcessing(false));
    }
  };

  // Helper to load sample files from backend directly
  const loadSampleDoc = async (sampleName) => {
    try {
      const response = await fetch(`/samples/${sampleName}`);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: blob.type });
      handleFileUpload(file);
    } catch (e) {
      console.error("Failed to load sample doc:", e);
    }
  };

  return (
    <div className="card-panel">
      <div className="assistant-header">
        <div className="assistant-title">
          <Bot size={20} color="#2563EB" />
          <span>AI Complaint Intake Assistant</span>
          <span className="beta-tag">BETA</span>
        </div>
      </div>

      {/* Drag and Drop Box */}
      <div
        className="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        <UploadCloud size={32} className="dropzone-icon" />
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
          Drag & drop complaint document here
        </div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>or <span style={{ color: '#2563EB', textDecoration: 'underline' }}>click to browse</span></div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.txt,.eml,.docx"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />
      </div>

      {/* Quick Test Sample Document Chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>Quick Load Sample Files:</span>
        <button
          className="chip"
          style={{ background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' }}
          onClick={() => loadSampleDoc('Metformin_Quality_Issue.pdf')}
        >
          <FileText size={12} /> Metformin_Quality_Issue.pdf
        </button>
        <button
          className="chip"
          style={{ background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' }}
          onClick={() => loadSampleDoc('Amoxicillin_Complaint.eml')}
        >
          <FileText size={12} /> Amoxicillin_Complaint.eml
        </button>
      </div>

      {/* Extraction Progress Bar */}
      {extractionProgress > 0 && (
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${extractionProgress}%` }} />
          </div>
          <div className="progress-text">
            <span>{extractionStatus}</span>
            <span style={{ fontWeight: 'bold' }}>{extractionProgress}%</span>
          </div>
        </div>
      )}

      {/* Quick Test Prompts matching Video Demonstration */}
      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
          Video Test Scenario Prompts:
        </div>
        <div className="prompt-chips">
          <span
            className="chip"
            onClick={() => handleSendPrompt("Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 mg")}
          >
            💡 Log Complaint Tool: Apollo Pharmacy discolored capsules...
          </span>
          <span
            className="chip"
            onClick={() => handleSendPrompt("Sorry, the batch number is BMX24602 and the affected quantity is 48 capsules")}
          >
            ✏️ Edit Tool 1: Sorry, batch is BMX24602 & qty is 48 capsules...
          </span>
          <span
            className="chip"
            onClick={() => handleSendPrompt("Sorry, the batch number is CHG260712A and affected quantity is 50 kg 2 HDP drums")}
          >
            ✏️ Edit Tool 2: Sorry, batch is CHG260712A & qty is 50 kg...
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-container">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input-box">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything or give a complaint prompt..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
          disabled={isProcessing}
        />
        <button className="btn-send" onClick={() => handleSendPrompt()} disabled={isProcessing}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
