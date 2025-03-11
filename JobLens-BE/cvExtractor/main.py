import sys
from cv_parser.utils.file_converter import convert_to_text
from cv_parser.utils.parser import extract_cv_data
from cv_parser.utils.parser import upload_to_google_sheets
import nltk

nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

def main():
    if len(sys.argv) < 3:
        print("Error: Not enough arguments provided!")
        sys.exit(1)

    cv_file = sys.argv[1]  # Get file path from command-line argument
    cv_link = sys.argv[2]  # Get the Firebase CV URL from the command-line argument

    print(" Converting CV to text...")
    text = convert_to_text(cv_file)
    
    print(" Extracting information...")
    extracted_data = extract_cv_data(text)

    print("Extracted CV Data:")
    for key, value in extracted_data.items():
        print(f"{key}: {value}")
    
    # Pass extracted data and CV link to Google Sheets function
    upload_to_google_sheets(extracted_data, cv_link)

if __name__ == "__main__":
    main() 