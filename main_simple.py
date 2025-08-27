import functions_framework
import requests
import json
import base64
from flask import jsonify, request

APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBS3hejLICcmM8sREaKLjSurl56A-gaNyWWY00QYVaYHacZuM3S34IUtybk5nmTwg/exec"

@functions_framework.http
def proxy(request):
    # Headers CORS
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    
    # Manejar preflight OPTIONS
    if request.method == "OPTIONS":
        return ("", 204, headers)
    
    try:
        # Logging básico
        print(f"Request method: {request.method}")
        print(f"Request args: {dict(request.args)}")
        
        # Obtener ID
        user_id = request.args.get("id")
        if not user_id:
            return (jsonify({
                "status": "error", 
                "message": "ID parameter is required"
            }), 400, headers)
        
        # Verificar si hay archivo
        if 'file' in request.files:
            file = request.files['file']
            
            if file.filename:
                print(f"Processing file: {file.filename}")
                
                # Leer archivo
                file_content = file.read()
                file_size = len(file_content)
                
                # Convertir a base64
                file_b64 = base64.b64encode(file_content).decode('utf-8')
                
                # CORREGIDO: Usar los nombres de parámetros que espera el Apps Script
                data = {
                    "fileContent": file_b64,        # Cambiado de file_content
                    "fileName": file.filename,       # Cambiado de filename
                    "mimeType": file.content_type,   # Cambiado de content_type
                    "id": user_id                    # Cambiado de id
                }
                
                print(f"File processed: {file_size} bytes")
            else:
                return (jsonify({
                    "status": "error", 
                    "message": "No file selected"
                }), 400, headers)
        else:
            # Procesar JSON si no hay archivo
            json_data = request.get_json(silent=True)
            if json_data:
                data = {**json_data, "id": user_id}
            else:
                data = {"id": user_id}
        
        # Enviar al Apps Script
        print(f"Sending data to Apps Script...")
        response = requests.post(APPS_SCRIPT_URL, json=data, timeout=30)
        
        print(f"Apps Script response status: {response.status_code}")
        
        # Procesar respuesta
        if response.status_code == 200:
            try:
                response_json = response.json()
                return (jsonify(response_json), 200, headers)
            except:
                return (jsonify({
                    "status": "success",
                    "message": "File processed successfully",
                    "response": response.text
                }), 200, headers)
        else:
            return (jsonify({
                "status": "error",
                "message": f"Apps Script returned status {response.status_code}",
                "response": response.text
            }), response.status_code, headers)
            
    except Exception as e:
        print(f"Error in proxy function: {str(e)}")
        return (jsonify({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }), 500, headers)
