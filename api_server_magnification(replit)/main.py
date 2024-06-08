from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app) 

@app.route('/magnify', methods=['POST'])
def magnify():
    url = request.form.get('url')
    technique = request.form.get('technique')
    mode = request.form.get('mode')
    print(request.form)

    if not url or not technique:
        return jsonify({'error': 'url and technique are required'}), 400

    destination_url = 'https://d9f0-2409-40d7-7-598-e4d1-9e10-abe6-878e.ngrok-free.app/upload'

    try:
        response = requests.post(destination_url, data=request.form)
        response_data = response.text

        # Log the response received from the URL
        print('Response:', response_data)

        # Send a response to the client indicating success
        return response_data
    except Exception as e:
        # If an error occurs, log it and send an error response to the client
        print('Error:', str(e))
        return 'Error sending POST request', 500

if __name__ == '__main__':
    app.run(debug=True)
