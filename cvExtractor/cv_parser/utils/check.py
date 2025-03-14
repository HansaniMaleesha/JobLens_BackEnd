# import base64
# import json
# import os

# # Load environment variables from the .env file
# from dotenv import load_dotenv
# load_dotenv()

# # Step 1: Get the base64 encoded credentials string from the environment
# encoded_credentials = os.getenv("CREDENTIALS_BASE64")

# if encoded_credentials is None:
#     raise ValueError("CREDENTIALS_BASE64 is not set in the .env file")

# # Make sure to strip any leading/trailing whitespaces
# encoded_credentials = encoded_credentials.strip()

# # Step 2: Ensure the base64 string is properly padded
# # Check the length of the base64 string and add padding if necessary
# if len(encoded_credentials) % 4 != 0:
#     padding_needed = 4 - len(encoded_credentials) % 4
#     encoded_credentials += "=" * padding_needed

# # Step 3: Decode the base64 string safely
# try:
#     decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
#     print("Decoded Credentials:", decoded_credentials)  # Optionally, log this for debugging
# except Exception as e:
#     print(f"Error decoding base64 string: {e}")
#     raise

# # Step 4: Load the decoded JSON string into a Python dictionary
# credentials_dict = json.loads(decoded_credentials)
# print("Credentials Dictionary:", credentials_dict)
