import os
import requests

# Your current key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

print("🔍 Checking available models for your API Key (REST API)...")

if not GOOGLE_API_KEY:
    print("❌ GOOGLE_API_KEY not set.")
else:
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GOOGLE_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])
            count = 0
            for m in models:
                if 'generateContent' in m.get('supportedGenerationMethods', []):
                    print(f"✅ FOUND: {m.get('name')}")
                    count += 1
            if count == 0:
                print("❌ No text generation models found. Check API Key permissions.")
        else:
            print(f"❌ API Error {response.status_code}: {response.text}")

    except Exception as e:
        print(f"❌ Error: {e}")