from flask import Flask, jsonify, request
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"})

# Home endpoint
@app.route('/api/home', methods=['GET'])
def return_home():
    return jsonify({"message": "Welcome to the Home API!"})

# Placeholder endpoint for model prediction
# Your teammate will implement the actual model logic here
@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Placeholder for model prediction endpoint.
    Expected input: JSON with 'data' or file upload
    Returns: JSON with prediction results
    """
    try:
        # Example for JSON input
        if request.is_json:
            data = request.get_json()
            # TODO: Your teammate will add model inference here
            # result = model.predict(data)
            return jsonify({
                "status": "success",
                "message": "Model prediction placeholder",
                "data": data,
                "prediction": "This will be replaced with actual model output"
            })
        
        # Example for file upload
        if 'file' in request.files:
            file = request.files['file']
            # TODO: Your teammate will process the file and run model inference
            # result = model.predict_from_file(file)
            return jsonify({
                "status": "success",
                "message": "File received",
                "filename": file.filename,
                "prediction": "This will be replaced with actual model output"
            })
        
        return jsonify({"status": "error", "message": "No data provided"}), 400
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)