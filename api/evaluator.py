from api.gemini_client import GeminiClient
import json

class Evaluator:
    def __init__(self):
        self.client = GeminiClient()

    def evaluate(self, question, answer):
        prompt = f"""
        You are a technical interviewer.
        Question: {question}
        Candidate Answer: {answer}
        
        Evaluate the answer on a scale of 1-10.
        Provide feedback and the correct solution.
        Return ONLY valid JSON in this format: 
        {{ "score": number, "feedback": "string", "correct_solution": "string" }}
        """
        
        response_text = self.client.generate(prompt)
        
        if not response_text:
            return {"score": 0, "feedback": "AI Service Unavailable", "correct_solution": "N/A"}
        
        try:
            # Clean up response to ensure JSON parsing works
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            return {"score": 0, "feedback": "Could not parse AI response.", "correct_solution": "N/A"}