import os
import datetime
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Supabase client not found. Please run: pip install supabase")
    Client = object # Dummy for type hinting if missing

# Initialize Supabase Client
# We check for both standard and Vercel/Frontend naming conventions
url = os.environ.get("SUPABASE_URL") or os.environ.get("PUBLIC_SUPABASE_URL")
# Prefer Service Role Key for backend operations to bypass RLS
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY") or os.environ.get("PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = None

def init_db():
    global supabase
    if url and key:
        try:
            supabase = create_client(url, key)
            # Debug: Check if we are likely using the Service Role Key
            if not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
                print("⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY not set. Writes may fail due to RLS.")
            print("✅ Connected to Supabase")
        except Exception as e:
            print(f"❌ Failed to connect to Supabase: {e}")
    else:
        print("⚠️ Supabase credentials not found. Set SUPABASE_URL and SUPABASE_KEY.")

def get_session(session_id):
    if not supabase: 
        print("❌ DB Error: Supabase not connected")
        return None
    try:
        # Fetch session from 'interview_sessions' table
        # We use 'id' and 'questions' to match the frontend schema
        # We only select columns that exist in your schema
        response = supabase.table("interview_sessions").select("questions").eq("id", session_id).execute()
        if response.data and len(response.data) > 0:
            row = response.data[0]
            questions = row.get("questions", [])
            
            # Extract difficulty from metadata inside the JSON since column doesn't exist
            difficulty = "Easy"
            if isinstance(questions, list):
                for item in questions:
                    if isinstance(item, dict) and item.get("meta") == "difficulty":
                        difficulty = item.get("value", "Easy")
                        break
            
            return (difficulty, questions)
    except Exception as e:
        print(f"⚠️ DB Error (get_session): {e}")
    return None

def get_user_sessions(user_id):
    if not supabase: return []
    try:
        response = supabase.table("interview_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        sessions = []
        for r in response.data:
            hist = r.get("questions", [])
            topic = "General Coding"
            
            # Extract difficulty from JSON metadata
            diff = "Easy"
            if hist and isinstance(hist, list) and len(hist) > 0 and isinstance(hist[0], dict):
                topic = hist[0].get("topic", "General Coding")
                # Search for difficulty meta
                for item in hist:
                    if item.get("meta") == "difficulty":
                        diff = item.get("value", "Easy")
                        break
            
            sessions.append({
                "session_id": r.get("id"),
                "topic": topic,
                "created_at": r.get("created_at"),
                "questions_count": max(0, len(hist) - 1),
                "difficulty": diff
            })
        return sessions
    except Exception as e:
        print(f"⚠️ DB Error (get_user_sessions): {e}")
        return []

def update_session(session_id, difficulty, history, user_id=None):
    if not supabase: 
        print("❌ DB Error: Supabase not connected. Cannot save session.")
        return False, "Supabase not connected. Check SUPABASE_URL/KEY."
    try:
        # Inject difficulty into history as metadata so it persists
        # Filter out old difficulty meta to prevent accumulation
        clean_history = [item for item in history if item.get("meta") != "difficulty"]
        clean_history.append({"meta": "difficulty", "value": difficulty})

        data = {
            "id": session_id,
            "questions": clean_history,
            # REMOVED: "difficulty" and "updated_at" as they don't exist in your schema
        }
        if user_id:
            data["user_id"] = user_id
            # We don't set created_at manually, letting the DB default (now()) handle it
        
        # Upsert (Insert or Update)
        supabase.table("interview_sessions").upsert(data).execute()
        return True, None
    except Exception as e:
        print(f"⚠️ DB Error (update_session): {e}")
        return False, str(e)