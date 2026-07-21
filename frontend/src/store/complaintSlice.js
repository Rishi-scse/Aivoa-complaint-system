import { createSlice } from '@reduxjs/toolkit';

const initialFormData = {
  complaint_source: '',
  customer_name: '',
  product_name: '',
  product_strength: '',
  batch_number: '',
  mfg_date: '',
  expiry_date: '',
  quantity_affected: '',
  complaint_type: '',
  complaint_date: '',
  detailed_description: '',
};

const initialRiskAssessment = {
  initial_severity: 'Major',
  priority: 'High',
  recommended_action: 'Route to QA Investigation and issue replacement',
  risk_summary: 'Pending AI assessment...',
};

export const complaintSlice = createSlice({
  name: 'complaint',
  initialState: {
    formData: initialFormData,
    riskAssessment: initialRiskAssessment,
    chatMessages: [
      {
        sender: 'ai',
        text: 'Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.',
      },
    ],
    extractionProgress: 0,
    extractionStatus: 'Awaiting AI extraction...',
    isProcessing: false,
    lastModifiedField: null,
    savedComplaintsList: [],
    showSavedModal: false,
    showCAPAModal: false,
    capaData: null,
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setRiskAssessment: (state, action) => {
      state.riskAssessment = { ...state.riskAssessment, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialFormData;
      state.riskAssessment = initialRiskAssessment;
      state.extractionProgress = 0;
      state.extractionStatus = 'Awaiting AI extraction...';
      state.chatMessages.push({
        sender: 'ai',
        text: 'Form reset. Enter a new complaint prompt or upload a document to begin.',
      });
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setExtractionProgress: (state, action) => {
      state.extractionProgress = action.payload.progress;
      if (action.payload.status) {
        state.extractionStatus = action.payload.status;
      }
    },
    setIsProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setSavedComplaintsList: (state, action) => {
      state.savedComplaintsList = action.payload;
    },
    setShowSavedModal: (state, action) => {
      state.showSavedModal = action.payload;
    },
    setShowCAPAModal: (state, action) => {
      state.showCAPAModal = action.payload;
    },
    setCAPAData: (state, action) => {
      state.capaData = action.payload;
    },
  },
});

export const {
  setFormData,
  setRiskAssessment,
  resetForm,
  addChatMessage,
  setExtractionProgress,
  setIsProcessing,
  setSavedComplaintsList,
  setShowSavedModal,
  setShowCAPAModal,
  setCAPAData,
} = complaintSlice.actions;

export default complaintSlice.reducer;
