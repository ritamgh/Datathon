import sys
import json
import nltk
import time
import requests
from nltk.sentiment import SentimentIntensityAnalyzer

# Make sure NLTK resources are downloaded
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

def check_ollama_available():
    """Check if Ollama is running and available"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        return response.status_code == 200
    except Exception as e:
        print(f"Error checking Ollama availability: {str(e)}", file=sys.stderr)
        return False

def query_model_direct(prompt, model="dolphin-mistral"):
    """Query Ollama directly using the HTTP API (fallback method)"""
    try:
        data = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        
        start_time = time.time()
        response = requests.post("http://localhost:11434/api/generate", json=data)
        end_time = time.time()
        
        if response.status_code == 200:
            return response.json()["response"], end_time - start_time
        else:
            print(f"Error from Ollama API: {response.status_code}", file=sys.stderr)
            print(f"Response body: {response.text}", file=sys.stderr)
            return None, 0
    except Exception as e:
        print(f"Error in direct query: {str(e)}", file=sys.stderr)
        return None, 0

def analyze_response(text):
    """Analyze the response for various metrics"""
    if not text:
        return {}
    
    # Calculate sentiment
    sentiment = sia.polarity_scores(text)
    
    # Count words and characters
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    
    # Simple toxicity detection
    toxic_words = ["hate", "stupid", "idiot", "dumb", "awful", "terrible"]
    toxicity_score = sum(1 for word in words if word.lower() in toxic_words) / max(1, word_count)
    
    # Calculate average word length
    avg_word_length = char_count / max(1, word_count)
    
    # Count sentences (very simple approximation)
    sentence_count = text.count('.') + text.count('!') + text.count('?')
    sentence_count = max(1, sentence_count)  # Ensure at least 1
    
    # Calculate average words per sentence
    avg_words_per_sentence = word_count / sentence_count
    
    # Simple hallucination detection (placeholder)
    hallucination_score = 0.0
    
    return {
        "sentiment_compound": sentiment["compound"],
        "sentiment_positive": sentiment["pos"],
        "sentiment_negative": sentiment["neg"],
        "sentiment_neutral": sentiment["neu"],
        "word_count": word_count,
        "char_count": char_count,
        "toxicity_score": toxicity_score,
        "hallucination_score": hallucination_score,
        "avg_word_length": avg_word_length,
        "sentence_count": sentence_count,
        "avg_words_per_sentence": avg_words_per_sentence
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No prompt provided"}))
        sys.exit(1)
    
    prompt = sys.argv[1]
    model = sys.argv[2] if len(sys.argv) > 2 else "llama3.2"
    
    # Check if Ollama is running
    if not check_ollama_available():
        print(json.dumps({"error": "Ollama is not running. Please start Ollama with 'ollama serve' and make sure it's available at http://localhost:11434"}))
        sys.exit(1)
    
    print(f"Querying Ollama with model '{model}' and prompt: {prompt[:50]}...", file=sys.stderr)
    
    # Query using direct API (simpler approach)
    response_text, response_time = query_model_direct(prompt, model)
    
    if not response_text:
        print(json.dumps({"error": "Failed to get response from Ollama. Make sure the model exists."}))
        sys.exit(1)
    
    # Analyze the response
    metrics = analyze_response(response_text)
    
    # Add response time to metrics
    metrics["response_time_seconds"] = response_time
    
    # Return both the response and metrics
    result = {
        "response": response_text,
        "metrics": metrics
    }
    
    print(json.dumps(result))