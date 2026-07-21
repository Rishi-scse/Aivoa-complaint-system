import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_sample_pdf(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=12
    )
    
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    normal_style.leading = 14

    story = []
    
    story.append(Paragraph("<b>CUSTOMER COMPLAINT REPORT - API & FDF QUALITY ASSURANCE</b>", title_style))
    story.append(Paragraph("<b>Form Ref:</b> QMS-CC-2026-0892 | <b>Date of Report:</b> 2026-07-20", normal_style))
    story.append(Spacer(1, 15))
    
    data = [
        ["1. ORIGIN & CUSTOMER DETAILS", ""],
        ["Complaint Source:", "Novartis Global Operations / Regional QA"],
        ["Customer Name:", "Apex Healthcare Ltd."],
        ["2. PRODUCT & BATCH IDENTIFICATION", ""],
        ["Product Name:", "Metformin Hydrochloride API"],
        ["Product Strength / Grade:", "IP / BP Grade"],
        ["Batch / Lot Number:", "MFH260712A"],
        ["Manufacturing Date:", "2026-03-15"],
        ["Expiry Date:", "2029-03-14"],
        ["Quantity Affected:", "50 kg (2 HDP Drums)"],
        ["3. COMPLAINT DETAILS", ""],
        ["Complaint Type:", "Physical Appearance / Contamination"],
        ["Complaint Date:", "2026-07-19"],
        ["Detailed Description:", "During incoming quality control inspection at Apex Healthcare plant, batch MFH260712A of Metformin Hydrochloride API exhibited off-white spec speckles and sticky clumping in 2 sealed HDP drums. Moisture test showed 2.4% vs spec <= 0.5%."],
    ]

    t = Table(data, colWidths=[180, 340])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0,0), (1,0), colors.HexColor('#0F172A')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,3), (1,3), colors.HexColor('#F1F5F9')),
        ('BACKGROUND', (0,10), (1,10), colors.HexColor('#F1F5F9')),
    ]))
    
    story.append(t)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Reported By:</b> Dr. Rajesh Sharma, Quality Control Lead (Apex Healthcare)", normal_style))
    
    doc.build(story)
    print(f"Generated PDF sample at: {filename}")

def generate_sample_eml(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    content = """From: quality@apollopharmacy.com
To: qa-complaints@pharma-corp.com
Date: Tue, 21 Jul 2026 10:30:00 +0530
Subject: URGENT: Quality Complaint - Discolored Capsules in Amoxicillin 500mg Batch

Dear Quality Assurance Team,

This is to log an urgent customer complaint regarding a batch received at our Central Apollo Pharmacy Warehouse.

Details:
- Customer Name: Apollo Pharmacy (Central Warehouse)
- Product Name: Amoxicillin Capsules
- Product Strength: 500 mg
- Batch / Lot Number: BMX24602
- Manufacturing Date: 2026-02-10
- Expiry Date: 2028-02-09
- Quantity Affected: 48 capsules (2 blister packs)
- Complaint Type: Discoloration / Foreign Matter

Description of Issue:
Our store pharmacists reported distinct brownish spots and yellow discoloration on Amoxicillin 500mg capsules inside sealed blister packaging. 2 packs containing 48 capsules total were affected. Please investigate immediately and arrange for replacement.

Regards,
Priya Sharma
Senior QA Manager, Apollo Pharmacy
    """
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated EML sample at: {filename}")

if __name__ == "__main__":
    samples_dir = os.path.join(os.path.dirname(__file__), "samples")
    generate_sample_pdf(os.path.join(samples_dir, "Metformin_Quality_Issue.pdf"))
    generate_sample_eml(os.path.join(samples_dir, "Amoxicillin_Complaint.eml"))
