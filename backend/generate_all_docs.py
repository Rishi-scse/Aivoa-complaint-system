import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_pdf(filename, title, subtitle, data_table, summary_text, footer_text):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=12
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    story = []
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#CBD5E1'), spaceAfter=12))

    # Format table content as Paragraphs for clean wrapping
    formatted_data = []
    for row in data_table:
        col0 = Paragraph(f"<b>{row[0]}</b>", body_style)
        col1 = Paragraph(row[1], body_style)
        formatted_data.append([col0, col1])

    t = Table(formatted_data, colWidths=[160, 380])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>DETAILED COMPLAINT / INVESTIGATION SUMMARY:</b>", ParagraphStyle('H2', parent=styles['Heading2'], fontSize=11, fontName='Helvetica-Bold', textColor=colors.HexColor('#1E293B'))))
    story.append(Spacer(1, 4))
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 16))

    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))
    story.append(Paragraph(f"<i>{footer_text}</i>", ParagraphStyle('Footer', parent=styles['Italic'], fontSize=8, textColor=colors.HexColor('#64748B'))))

    doc.build(story)
    print(f"[OK] Generated PDF: {filename}")

def generate_all_documents():
    samples_dir = os.path.join(os.path.dirname(__file__), "samples")
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs")

    # Document 1: Metformin Quality Complaint PDF
    create_pdf(
        os.path.join(samples_dir, "Metformin_Quality_Issue.pdf"),
        "PHARMA QUALITY ASSURANCE - CUSTOMER COMPLAINT REPORT",
        "API MANUFACTURER QUALITY MANAGEMENT SYSTEM | FORM REF: QMS-CC-2026-0892",
        [
            ["Complaint Source", "Novartis Global Operations / Regional Quality Assurance"],
            ["Customer Name", "Apex Healthcare Ltd."],
            ["Product Name", "Metformin Hydrochloride API"],
            ["Product Strength / Grade", "IP / BP Grade (Pharma Pure)"],
            ["Batch / Lot Number", "MFH260712A"],
            ["Manufacturing Date", "2026-03-15"],
            ["Expiry Date", "2029-03-14"],
            ["Quantity Affected", "50 kg (2 Sealed HDP Drums)"],
            ["Complaint Type", "Physical Appearance Defect / Spec Speckles"],
            ["Complaint Date", "2026-07-19"],
        ],
        "During incoming raw material quality control (IQC) testing at Apex Healthcare plant, batch MFH260712A of Metformin Hydrochloride API exhibited off-white speckles and localized clumping inside 2 sealed HDP drums. Moisture content tested at 2.4% vs specification limit <= 0.5%. Material quarantined immediately. Immediate replacement and root cause investigation requested.",
        "Confidential - AIVOA Quality Management System (QMS) - Generated for Automated AI Intake"
    )

    # Document 2: Amoxicillin Retailer Complaint PDF
    create_pdf(
        os.path.join(samples_dir, "Amoxicillin_Customer_Complaint.pdf"),
        "PHARMACEUTICAL CUSTOMER COMPLAINT INTAKE FORM",
        "FDF QUALITY ASSURANCE MODULE | COMPLAINT ID: CC-FDF-2026-0412",
        [
            ["Complaint Source", "Apollo Pharmacy (Central Regional Warehouse)"],
            ["Customer Name", "Apollo Pharmacy"],
            ["Product Name", "Amoxicillin Capsules"],
            ["Product Strength / Grade", "500 mg"],
            ["Batch / Lot Number", "BMX24602"],
            ["Manufacturing Date", "2026-02-10"],
            ["Expiry Date", "2028-02-09"],
            ["Quantity Affected", "48 capsules (2 blister packs)"],
            ["Complaint Type", "Discoloration / Foreign Matter in Blister"],
            ["Complaint Date", "2026-07-21"],
        ],
        "Store pharmacist reported discolored capsules inside sealed PVC/PVDC blister packs. Distinct yellow-brownish spots were observed on capsule shells of 48 capsules across 2 blister cards. No outer packaging damage reported. Retention samples reserved for QA verification. Urgent credit note and replacement requested.",
        "Quality Assurance Department - AIVOA QMS Intake File"
    )

    # Document 3: Paracetamol OOS Lab Investigation Report PDF
    create_pdf(
        os.path.join(samples_dir, "Paracetamol_OOS_Investigation_Report.pdf"),
        "OUT-OF-SPECIFICATION (OOS) QUALITY INVESTIGATION REPORT",
        "QUALITY CONTROL LAB REPORT | INCIDENT REF: OOS-2026-1108",
        [
            ["Reporting Facility", "AIVOA Central Testing Laboratory"],
            ["Customer / Plant", "Sun Pharma Manufacturing Division"],
            ["Product Name", "Paracetamol Tablets"],
            ["Product Strength / Grade", "650 mg"],
            ["Batch / Lot Number", "PCM260519X"],
            ["Manufacturing Date", "2026-05-19"],
            ["Expiry Date", "2029-05-18"],
            ["Quantity Affected", "120,000 Tablets (1 Commercial Lot)"],
            ["Investigation Type", "Dissolution Rate Out of Specification"],
            ["Date of Testing", "2026-07-18"],
        ],
        "Routine stability sample testing for Paracetamol 650mg tablets (Batch PCM260519X) showed dissolution rate Q=68% at 30 minutes versus release specification Q >= 80%. Phase 1 laboratory investigation ruled out analyst error and instrument calibration failure. Root cause assigned to binder concentration variation during wet granulation process.",
        "Approved by Head of Quality Control - AIVOA QMS Systems"
    )

    # Document 4: System Architecture & QMS Specification PDF
    create_pdf(
        os.path.join(docs_dir, "AIVOA_System_Architecture_Doc.pdf"),
        "AIVOA AI-POWERED QMS SYSTEM SPECIFICATION & ARCHITECTURE",
        "TECHNICAL DOCUMENTATION & DEPLOYMENT GUIDE",
        [
            ["Project Name", "AIVOA Customer Complaint Management System"],
            ["Industry Domain", "Pharmaceutical Manufacturing (API & FDF QMS)"],
            ["Frontend Stack", "React UI + Redux Toolkit + Google Inter Font"],
            ["Backend Stack", "FastAPI (Python) + SQLAlchemy ORM"],
            ["AI Agent Engine", "LangGraph State Graph + Groq LLM (gemma2-9b-it)"],
            ["Database Engine", "PostgreSQL / SQLite"],
            ["Primary AI Tools", "1. Log Complaint Tool | 2. Edit Tool | 3. Doc Extraction"],
            ["Bonus AI Features", "Root Cause & CAPA Engine, Database Records Modal"],
        ],
        "This document specifies the complete technical architecture and user workflow for the AI-Powered Customer Complaint Management System built for AIVOA Round 1 Full Stack Developer Assessment. The system automates complaint intake, field extraction, context-preserving natural language editing, and risk severity reasoning using LangGraph agent orchestration.",
        "Official Technical Deliverable - AIVOA Round 1 Full Stack Developer Assessment"
    )

if __name__ == "__main__":
    generate_all_documents()
