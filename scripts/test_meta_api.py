import requests
import json
import sys

def test_meta_api():
    # Token proporcionado para la prueba
    # CUIDADO: Este token debe ser tratado como sensible. Para pruebas rapidas lo dejamos hardcodeado.
    TOKEN = "EAAWKh6JNvjwBQ2VTgsiQMLw6WPS3xev3omCGo0cZCZA7VG2f0LUisaejLIohfKsvcRBNZCI5TAtNUJPzkFXXpN9C2EcXCCcuxZCTZAkgdKHLZAcmV2MArPArEZBZB6SB1aTXa9Lp6mCtDZAvdrElDgVSsGtyYQZBf5EVs8TZBkZCg7xGqBBDo3YZAQFZCLjqSe23yBVssZD"
    
    URL = "https://graph.facebook.com/v19.0/me/adaccounts"
    
    params = {
        "access_token": TOKEN
    }
    
    print(f"Haciendo petición a: {URL}...")
    try:
        response = requests.get(URL, params=params)
        
        # Intentamos decodificar la respuesta JSON si está disponible
        try:
            data = response.json()
        except json.JSONDecodeError:
            data = {"error": "No JSON response", "text": response.text}
            
        # Revisamos si hubo error HTTP
        if response.status_code == 200:
            print("====================================")
            print("✅ LLAMADA EXITOSA (HTTP 200)")
            print("====================================")
            print(json.dumps(data, indent=2))
            print("\nEsta llamada debería activar el contador en el Dashboard de Meta para solicitar acceso avanzado.")
        else:
            print("====================================")
            print(f"❌ ERROR EN LA LLAMADA (HTTP {response.status_code})")
            print("====================================")
            print(json.dumps(data, indent=2))
            sys.exit(1)
            
    except requests.exceptions.RequestException as e:
        print(f"Error de red o conexión: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_meta_api()
