from pdfminer.high_level import extract_text
import os

def convert_to_text(file_path):
    """
    Extract text from the provided PDF file.

    Args:
        file_path (str): The path to the PDF file.

    Returns:
        str: The extracted text from the PDF.
    """
    try:
        # Ensure the provided file path is valid
        if not file_path:
            raise ValueError(" Error: No file path provided.")

        # Ensure the file exists before proceeding
        if not os.path.exists(file_path):
            raise FileNotFoundError(f" Error: The file '{file_path}' does not exist.")

        print(f" Extracting text from: {file_path}")

        # Extract text using pdfminer
        text = extract_text(file_path)

        if not text.strip():
            print(f" Warning: No text extracted from {file_path}.")

        return text
    except Exception as e:
        print(f" Error extracting text from PDF: {e}")
        return ""  # Return an empty string in case of an error

# 