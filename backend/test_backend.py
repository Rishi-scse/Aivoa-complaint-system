import sys
import os
import json
from fastapi.testclient import TestClient

# Add backend dir to sys path
sys.path.append(os.path.dirname(__file__))

from app.main import app

client = TestClient(app)

def test_system():
    print("==================================================")
    print(" RUNNING AUTOMATED AI TOOL & BACKEND VERIFICATION ")
    print("==================================================")

    # 1. Test Root Endpoint
    res = client.get("/")
    assert res.status_code == 200
    print("[SUCCESS] Root API Endpoint OK:", res.json())

    # 2. Test Tool 1: Log Complaint Tool (Prompt: Apollo Pharmacy)
    print("\n--- Testing Tool 1: Log Complaint Tool ---")
    prompt_1 = "Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 mg"
    res1 = client.post("/api/ai/process", json={"prompt": prompt_1})
    assert res1.status_code == 200
    data1 = res1.json()
    print("Response Message:", data1["message"])
    print("Extracted Form Data:", json.dumps(data1["form_data"], indent=2))
    print("AI Risk Assessment:", json.dumps(data1["risk_assessment"], indent=2))

    assert data1["form_data"]["product_name"] == "Amoxicillin Capsules"
    assert data1["form_data"]["product_strength"] == "500 mg"
    assert data1["form_data"]["customer_name"] == "Apollo Pharmacy"
    assert data1["risk_assessment"]["initial_severity"] in ["Major", "Critical"]

    # 3. Test Tool 2: Edit Complaint Tool (Prompt: Edit batch & quantity)
    print("\n--- Testing Tool 2: Edit Complaint Tool ---")
    prompt_2 = "Sorry, the batch number is BMX24602 and the affected quantity is 48 capsules"
    res2 = client.post("/api/ai/process", json={
        "prompt": prompt_2,
        "current_form_data": data1["form_data"],
        "current_risk_assessment": data1["risk_assessment"]
    })
    assert res2.status_code == 200
    data2 = res2.json()
    print("Response Message:", data2["message"])
    print("Updated Form Data:", json.dumps(data2["form_data"], indent=2))

    assert data2["form_data"]["batch_number"] == "BMX24602"
    assert "48 capsules" in data2["form_data"]["quantity_affected"]
    # Check that previous fields were preserved
    assert data2["form_data"]["product_name"] == "Amoxicillin Capsules"

    # 4. Test Tool 3: Document Extraction Tool (Upload Sample PDF)
    print("\n--- Testing Tool 3: Document Extraction Tool ---")
    pdf_path = os.path.join(os.path.dirname(__file__), "samples", "Metformin_Quality_Issue.pdf")
    with open(pdf_path, "rb") as f:
        res3 = client.post("/api/ai/upload-doc", files={"file": ("Metformin_Quality_Issue.pdf", f, "application/pdf")})
    assert res3.status_code == 200
    data3 = res3.json()
    print("Response Message:", data3["message"])
    print("Extracted Form Data from PDF:", json.dumps(data3["form_data"], indent=2))

    assert "Metformin" in data3["form_data"]["product_name"]

    # 5. Test Follow-up Edit on Extracted Document
    print("\n--- Testing Follow-up Edit on Extracted Document ---")
    prompt_3 = "Sorry, the batch number is CHG260712A and affected quantity is 50 kg 2 HDP drums"
    res4 = client.post("/api/ai/process", json={
        "prompt": prompt_3,
        "current_form_data": data3["form_data"],
        "current_risk_assessment": data3["risk_assessment"]
    })
    assert res4.status_code == 200
    data4 = res4.json()
    print("Updated Form Data:", json.dumps(data4["form_data"], indent=2))
    assert data4["form_data"]["batch_number"] == "CHG260712A"

    # 6. Test Database CRUD: Save & List
    print("\n--- Testing Database Save & List ---")
    save_res = client.post("/api/complaints/", json={**data4["form_data"], **data4["risk_assessment"]})
    assert save_res.status_code == 200
    saved_record = save_res.json()
    print("Saved DB Record ID:", saved_record["id"])

    list_res = client.get("/api/complaints/")
    assert list_res.status_code == 200
    records = list_res.json()
    assert len(records) >= 1
    print(f"Total DB Records retrieved: {len(records)}")

    print("\n==================================================")
    print(" ALL TESTS PASSED SUCCESSFULLY! ")
    print("==================================================")

if __name__ == "__main__":
    test_system()
