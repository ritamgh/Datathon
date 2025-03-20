import requests
import json

def test_ollama():
    response = requests.post("http://localhost:11434/api/generate", 
                            json={"model": "llama3.2", 
                                  "prompt": "Hello, how are you?",
                                  "stream": False})
    
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_ollama()