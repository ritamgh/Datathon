from flask import Flask, request, jsonify, Response, render_template
import requests
import json
import threading
import queue
import time
import random  # Add this import

app = Flask(__name__)

# Ollama API base URL
OLLAMA_API_URL = "http://localhost:11434/api"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/models', methods=['GET'])
def list_models():
    """Get list of available models from Ollama"""
    try:
        response = requests.get(f"{OLLAMA_API_URL}/tags")
        if response.status_code == 200:
            return jsonify(response.json()["models"])
        return jsonify({"error": f"Failed to get models: {response.status_code}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@app.route('/generate/<model_name>', methods=['POST'])
def generate(model_name):
    """Generate text from a single model with streaming"""
    prompt = request.json.get('prompt', '')
    
    def generate_stream():
        headers = {"Content-Type": "application/json"}
        data = {
            "model": model_name,
            "prompt": prompt,
            "stream": True
        }
        
        try:
            with requests.post(f"{OLLAMA_API_URL}/generate", json=data, headers=headers, stream=True) as response:
                if response.status_code == 200:
                    for line in response.iter_lines():
                        if line:
                            yield f"data: {line.decode('utf-8')}\n\n"
                else:
                    yield f"data: {json.dumps({'error': f'Error: {response.status_code}'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return Response(generate_stream(), mimetype='text/event-stream')

@app.route('/generate-multi', methods=['POST'])
def generate_multi():
    """Generate text from multiple models simultaneously with streaming"""
    models = request.json.get('models', [])
    prompt = request.json.get('prompt', '')
    
    if not models:
        return jsonify({"error": "No models specified"}), 400
    
    def generate_all():
        yield "event: start\ndata: " + json.dumps({"message": f"Starting generation with models: {', '.join(models)}"}) + "\n\n"
        
        # Dictionary to track responses from each model
        model_responses = {model: "" for model in models}
        model_completed = {model: False for model in models}
        
        # Create a queue for each model's stream
        model_queues = {model: queue.Queue() for model in models}
        
        def stream_model(model, q):
            headers = {"Content-Type": "application/json"}
            data = {
                "model": model,
                "prompt": prompt,
                "stream": True
            }
            
            try:
                with requests.post(f"{OLLAMA_API_URL}/generate", json=data, headers=headers, stream=True) as response:
                    if response.status_code == 200:
                        for line in response.iter_lines():
                            if line:
                                try:
                                    response_json = json.loads(line.decode('utf-8'))
                                    q.put(response_json)
                                except json.JSONDecodeError:
                                    q.put({"error": "Failed to decode response"})
                    else:
                        q.put({"error": f"Error: {response.status_code}"})
            except Exception as e:
                q.put({"error": str(e)})
            finally:
                q.put(None)  # Signal that this model has completed
        
        # Start threads for each model
        threads = []
        for model in models:
            thread = threading.Thread(target=stream_model, args=(model, model_queues[model]))
            thread.daemon = True
            thread.start()
            threads.append(thread)
        
        # Process queues and yield updates
        while not all(model_completed.values()):
            for model, q in model_queues.items():
                if model_completed[model]:
                    continue
                    
                try:
                    data = q.get(block=False)
                    if data is None:
                        model_completed[model] = True
                        yield f"event: model-complete\ndata: {json.dumps({'model': model})}\n\n"
                    else:
                        if "response" in data:
                            # This is a chunk of generated text
                            chunk = data["response"]
                            model_responses[model] += chunk
                            yield f"event: model-update\ndata: {json.dumps({'model': model, 'chunk': chunk, 'full_text': model_responses[model]})}\n\n"
                        elif "done" in data and data["done"]:
                            # This is the final message
                            model_completed[model] = True
                            yield f"event: model-complete\ndata: {json.dumps({'model': model})}\n\n"
                        else:
                            # Handle other message types or errors
                            yield f"event: model-message\ndata: {json.dumps({'model': model, 'message': data})}\n\n"
                except queue.Empty:
                    pass
            
            # Small sleep to prevent CPU spinning
            time.sleep(0.05)
        
        yield "event: end\ndata: " + json.dumps({"message": "All models completed"}) + "\n\n"
    
    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no"
    }
    return Response(generate_all(), mimetype='text/event-stream', headers=headers)

@app.route('/analyze-differences', methods=['POST'])
def analyze_differences():
    """Analyze differences between model outputs"""
    model_outputs = request.json.get('outputs', {})
    
    # Mock analysis logic with random values
    analysis_results = {}
    
    models = list(model_outputs.keys())
    if len(models) >= 2:
        for i in range(len(models)):
            for j in range(i+1, len(models)):
                model1 = models[i]
                model2 = models[j]
                pair_key = f"{model1}_vs_{model2}"
                
                analysis_results[pair_key] = {
                    "similarity_score": round(random.random() * 100, 2),
                    "word_count_diff": random.randint(-50, 50),
                    "sentiment_diff": round(random.random() * 2 - 1, 2),
                    "response_time_diff": f"{round(random.random() * 5, 2)}s",
                    "key_insights": [
                        f"Insight {random.randint(1, 10)}",
                        f"Insight {random.randint(1, 10)}",
                        f"Insight {random.randint(1, 10)}"
                    ],
                    "unique_concepts": {
                        model1: [f"concept_{random.randint(1, 100)}" for _ in range(3)],
                        model2: [f"concept_{random.randint(1, 100)}" for _ in range(3)]
                    }
                }
    
    return jsonify({
        "analysis": analysis_results,
        "summary": {
            "most_similar_pair": random.choice(list(analysis_results.keys())) if analysis_results else None,
            "least_similar_pair": random.choice(list(analysis_results.keys())) if analysis_results else None,
            "average_similarity": round(random.random() * 100, 2) if analysis_results else 0
        }
    })

if __name__ == '__main__':
    app.run(debug=True, threaded=True, host='0,0,0,0', port=5000)