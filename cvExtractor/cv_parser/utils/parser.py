import sys
import fitz  # PyMuPDF
import re
import os
import base64
import gspread
import json
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from google.oauth2 import service_account

# Load environment variables from the .env file
load_dotenv()

# Step 1: Get the base64 encoded credentials string from the environment
encoded_credentials = os.getenv("CREDENTIALS_BASE64")

# Step 2: Decode the base64 string
if encoded_credentials is None:
    raise ValueError("CREDENTIALS_BASE64 is not set in the .env file")

decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
print("Decoded Credentials:", decoded_credentials)  # Log decoded credentials to verify

# Step 3: Load the decoded JSON string into a Python dictionary
credentials_dict = json.loads(decoded_credentials)

# Check if the credentials are loaded correctly
print("Credentials Dictionary:", credentials_dict)


def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        return text.encode('utf-8', 'ignore').decode('utf-8')
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_cv_data(text):
    try:
        name_match = re.search(r'([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)', text)
        name = name_match.group(0) if name_match else 'N/A'
        
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)
        email = email_match.group(0) if email_match else 'N/A'
        
        phone_match = re.search(r'\+94\s?\(?0?(\d{1,2})\)?[-.\s]?\d{6,10}', text)
        phone = phone_match.group(0) if phone_match else 'N/A'


        
        education_match = re.search(r'(Education|Degree|Bachelor|B\.?Sc|University)[\s\n]*(.*?)(?=(?:Work Experience|Employment History|Technical Skills|Projects|Certifications|Languages|Achievements|References|\Z))',text,re.IGNORECASE | re.DOTALL)
        education = education_match.group(2).strip() if education_match else 'N/A'


        qualifications_match = re.search(r'(?:Technical Skills|Skills|Qualifications)[\s\n]*(.*?)(?=(?:Projects|Languages|Achievements|References|Work Experience|Education|\Z))',text, re.IGNORECASE | re.DOTALL)
        qualifications = qualifications_match.group(1).strip() if qualifications_match else 'N/A'


        projects_match = re.search(r'(Projects|Research|Development)[\s\n]*(.*?)(?=(?:Education|Skills|Certifications|Languages|Achievements|References|\Z))', text, re.IGNORECASE | re.DOTALL)
        projects = projects_match.group(2).strip() if projects_match else 'N/A'

       

        return {
            'name': name,
            'email': email,
            'phone': phone,
            'education': education,
            'qualifications': qualifications,
            'projects': projects,
            
        }
    except Exception as e:
        print(f"Error extracting CV data: {e}")
        return {}

def upload_to_google_sheets(data, cv_link):
    print("Uploading to Google Sheets...")
    try:
        print("Connecting to Google Sheets...")
        SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
        creds = service_account.Credentials.from_service_account_info(credentials_dict, scopes=SCOPES)

        # Verify that the credentials are valid
        print("Credentials are valid:", creds.valid)

        client = gspread.authorize(creds)

        # Check if the connection is successful
        print("Google Sheets client connected.")

        SHEET_ID = "16EFjHDM8etpajIKWd9TYdoQ_sW4pqgZQPdnplGfCXBc"
        sheet = client.open_by_key(SHEET_ID).sheet1

        # Rearranged the data to match the sheet columns
        row = [
            data['name'], 
            data['email'], 
            data['phone'],
            data['education'], 
            data['qualifications'], 
            data['projects'],
            cv_link
        ]
        print("Uploading Data:", row)

        sheet.append_row(row)
        print("Data uploaded successfully!")

    except Exception as e:
        print(f"Google Sheets Upload Error: {e}")
        # Additional detailed logging
        if hasattr(e, 'response'):
            print("Error response from Google Sheets:", e.response)
