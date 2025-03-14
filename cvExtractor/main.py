from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Import other necessary functions
from cv_parser.utils.file_converter import convert_to_text
from cv_parser.utils.parser import extract_cv_data
from cv_parser.utils.parser import upload_to_google_sheets
import nltk
import os

# Download necessary NLTK data files
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

# Create the Flask app instance
app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)

@app.route('/process_cv', methods=['POST'])
def process_cv():
    # Get the file from the request
    file = request.files.get('file')
    cv_link = request.form.get('cv_link')

    if not file:
        return jsonify({"error": "No file provided"}), 400
    if not cv_link:
        return jsonify({"error": "No CV link provided"}), 400

    # Use the current working directory for temp files and ensure the directory exists
    temp_directory = os.path.join(os.getcwd(), 'temp')
    if not os.path.exists(temp_directory):
        os.makedirs(temp_directory)

    # Save file temporarily
    temp_file_path = os.path.join(temp_directory, file.filename)
    file.save(temp_file_path)

    try:
        # Convert CV to text
        print("Converting CV to text...")
        text = convert_to_text(temp_file_path)

        # Extract information from CV
        print("Extracting information...")
        extracted_data = extract_cv_data(text)

        # Upload to Google Sheets
        upload_to_google_sheets(extracted_data, cv_link)

        # Return extracted data
        return jsonify({"message": "CV processed successfully", "data": extracted_data}), 200

    except Exception as e:
        print(f"Error processing CV: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
