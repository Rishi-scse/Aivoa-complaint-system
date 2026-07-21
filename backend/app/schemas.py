from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ComplaintFormData(BaseModel):
    # Section 1
    complaint_source: Optional[str] = Field(None, description="Source of the complaint e.g. Customer, Quality Assurance, Retailer")
    customer_name: Optional[str] = Field(None, description="Name of customer or institution e.g. Apollo Pharmacy")
    
    # Section 2
    product_name: Optional[str] = Field(None, description="Name of the pharmaceutical product or API")
    product_strength: Optional[str] = Field(None, description="Dosage strength or grade e.g. 500 mg, IP/BP Grade")
    batch_number: Optional[str] = Field(None, description="Batch / Lot number e.g. BMX24602, MFH260712A")
    mfg_date: Optional[str] = Field(None, description="Manufacturing Date (YYYY-MM-DD or readable date)")
    expiry_date: Optional[str] = Field(None, description="Expiry Date (YYYY-MM-DD or readable date)")
    quantity_affected: Optional[str] = Field(None, description="Quantity affected e.g. 48 capsules, 50 kg (2 HDP Drums)")
    
    # Section 3
    complaint_type: Optional[str] = Field(None, description="Type of complaint e.g. Discoloration, Packaging Defect, Impurity")
    complaint_date: Optional[str] = Field(None, description="Date complaint occurred or reported")
    detailed_description: Optional[str] = Field(None, description="Comprehensive description of quality issue reported")

class RiskAssessmentData(BaseModel):
    initial_severity: Optional[str] = Field("Major", description="Minor, Major, or Critical")
    priority: Optional[str] = Field("High", description="Low, Medium, High, or Urgent")
    recommended_action: Optional[str] = Field("Route to QA Investigation and issue replacement", description="Recommended next action")
    risk_summary: Optional[str] = Field(None, description="Brief AI risk assessment summary")

class ExtractedComplaintResult(BaseModel):
    form_data: ComplaintFormData
    risk_assessment: RiskAssessmentData
    explanation: str = Field(..., description="Short message explaining what AI extracted or updated")

class AIProcessRequest(BaseModel):
    prompt: str
    current_form_data: Optional[Dict[str, Any]] = None
    current_risk_assessment: Optional[Dict[str, Any]] = None

class AIProcessResponse(BaseModel):
    form_data: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    message: str
    action_type: str # log_complaint, edit_complaint, document_extraction, chat

class ComplaintCreate(ComplaintFormData, RiskAssessmentData):
    pass

class ComplaintResponse(ComplaintFormData, RiskAssessmentData):
    id: int
    status: str
    created_at: str

    class Config:
        from_attributes = True
