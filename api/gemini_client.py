import requests
import json
import time
import os

# 🔑 YOUR API KEY
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

class GeminiClient:
    def __init__(self):
        # We use a string for 'model' to satisfy checks like 'if self.client.model:' in other files
        self.model = None 
        # ⚡ FIX 1: Removed 'models/' prefix which caused the 404 error
        self.model_name = 'gemini-1.5-flash'
        self.api_key_status = "not_set"
        
        if not GOOGLE_API_KEY:
            print("⚠️ GOOGLE_API_KEY not set - Gemini features will be disabled")
            return
            
        if len(GOOGLE_API_KEY) < 20 or not GOOGLE_API_KEY.startswith("AIza"):
            print("⚠️ GOOGLE_API_KEY format looks invalid (should start with 'AIza')")
            self.api_key_status = "invalid_format"
            return
            
        # Set model to truthy value so checks in question_engine/evaluator pass
        self.model = "REST_CLIENT"
        self.api_key_status = "configured"
        print(f"✅ Gemini Client Ready (REST Mode)")

    def generate(self, prompt: str):
        if not self.model:
            return None
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={GOOGLE_API_KEY}"
        headers = {'Content-Type': 'application/json'}
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        # ⚡ FIX 2: Reduced retries to avoid hitting the 10s Vercel limit
        max_retries = 2
        
        for attempt in range(max_retries):
            try:
                # ⚡ FIX 3: Timeout set to 9s (Vercel kills processes at 10s strict)
                response = requests.post(url, headers=headers, json=data, timeout=9)
                
                if response.status_code == 200:
                    self.api_key_status = "valid"
                    result = response.json()
                    try:
                        return result['candidates'][0]['content']['parts'][0]['text']
                    except (KeyError, IndexError, TypeError):
                        print(f"❌ Unexpected API response format: {result}")
                        return None
                
                # Handle specific error codes
                if response.status_code in [429, 503]:
                    # ⚡ FIX 4: Short wait time so we don't die waiting
                    wait_time = 1 
                    print(f"⚠️ Rate Limit/Quota Hit. Waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                
                if response.status_code in [400, 401, 403]:
                    print(f"❌ API Error {response.status_code}: {response.text}")
                    self.api_key_status = "invalid"
                    return None

                print(f"❌ API Error {response.status_code}: {response.text}")
                
            except Exception as e:
                print(f"❌ Request Failed: {e}")
                # Short sleep before retry
                if attempt < max_retries - 1:
                    time.sleep(1)
        
        return None