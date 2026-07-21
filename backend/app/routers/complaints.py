from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Complaint
from app.schemas import ComplaintCreate, ComplaintResponse

router = APIRouter(prefix="/api/complaints", tags=["Complaints DB"])

@router.post("/", response_model=ComplaintResponse)
def create_complaint(complaint_in: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Save a new customer complaint record into the database.
    """
    db_obj = Complaint(
        complaint_source=complaint_in.complaint_source,
        customer_name=complaint_in.customer_name,
        product_name=complaint_in.product_name,
        product_strength=complaint_in.product_strength,
        batch_number=complaint_in.batch_number,
        mfg_date=complaint_in.mfg_date,
        expiry_date=complaint_in.expiry_date,
        quantity_affected=complaint_in.quantity_affected,
        complaint_type=complaint_in.complaint_type,
        complaint_date=complaint_in.complaint_date,
        detailed_description=complaint_in.detailed_description,
        initial_severity=complaint_in.initial_severity,
        priority=complaint_in.priority,
        recommended_action=complaint_in.recommended_action,
        risk_summary=complaint_in.risk_summary,
        status="Pending Triage"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    return ComplaintResponse(
        id=db_obj.id,
        complaint_source=db_obj.complaint_source,
        customer_name=db_obj.customer_name,
        product_name=db_obj.product_name,
        product_strength=db_obj.product_strength,
        batch_number=db_obj.batch_number,
        mfg_date=db_obj.mfg_date,
        expiry_date=db_obj.expiry_date,
        quantity_affected=db_obj.quantity_affected,
        complaint_type=db_obj.complaint_type,
        complaint_date=db_obj.complaint_date,
        detailed_description=db_obj.detailed_description,
        initial_severity=db_obj.initial_severity,
        priority=db_obj.priority,
        recommended_action=db_obj.recommended_action,
        risk_summary=db_obj.risk_summary,
        status=db_obj.status,
        created_at=db_obj.created_at.strftime("%Y-%m-%d %H:%M:%S") if db_obj.created_at else ""
    )

@router.get("/", response_model=List[ComplaintResponse])
def list_complaints(db: Session = Depends(get_db)):
    """
    Retrieve all saved customer complaints.
    """
    records = db.query(Complaint).order_by(Complaint.id.desc()).all()
    res = []
    for c in records:
        res.append(ComplaintResponse(
            id=c.id,
            complaint_source=c.complaint_source,
            customer_name=c.customer_name,
            product_name=c.product_name,
            product_strength=c.product_strength,
            batch_number=c.batch_number,
            mfg_date=c.mfg_date,
            expiry_date=c.expiry_date,
            quantity_affected=c.quantity_affected,
            complaint_type=c.complaint_type,
            complaint_date=c.complaint_date,
            detailed_description=c.detailed_description,
            initial_severity=c.initial_severity,
            priority=c.priority,
            recommended_action=c.recommended_action,
            risk_summary=c.risk_summary,
            status=c.status,
            created_at=c.created_at.strftime("%Y-%m-%d %H:%M:%S") if c.created_at else ""
        ))
    return res
