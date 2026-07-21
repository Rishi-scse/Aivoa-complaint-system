import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    
    # 1. Origin & Customer Details
    complaint_source = Column(String(255), nullable=True)
    customer_name = Column(String(255), nullable=True)
    
    # 2. Product & Batch Identification
    product_name = Column(String(255), nullable=True)
    product_strength = Column(String(255), nullable=True)
    batch_number = Column(String(255), nullable=True)
    mfg_date = Column(String(100), nullable=True)
    expiry_date = Column(String(100), nullable=True)
    quantity_affected = Column(String(255), nullable=True)
    
    # 3. Complaint Details
    complaint_type = Column(String(255), nullable=True)
    complaint_date = Column(String(100), nullable=True)
    detailed_description = Column(Text, nullable=True)
    
    # 4. Initial Assessment & Priority (AI Co-pilot Risk Assessment)
    initial_severity = Column(String(100), nullable=True) # e.g. Minor, Major, Critical
    priority = Column(String(100), nullable=True)          # e.g. Low, Medium, High, Urgent
    recommended_action = Column(Text, nullable=True)
    risk_summary = Column(Text, nullable=True)
    status = Column(String(100), default="Pending Triage") # Pending Triage, In Investigation, Closed
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
