import os
import json
import time
from llm import generate_questions
from assessment_engine import evaluate_submission

def main():
    print("=== AI Assessment Module (CLI Mode) ===")
    
    # Check enviroment
    if not os.getenv("OPENROUTER_API_KEY"):
        print("WARNING: OPENROUTER_API_KEY is not set in environment.")
        return

    # 1. Get Domain
    domain = input("\nEnter job role/domain (press Enter for Cloud Computing): ").strip()
    
    # 2. Generate
    print("\nGenerating questions... (this may take a few seconds)")
    try:
        start_time = time.time()
        result = generate_questions(domain)
        end_time = time.time()
        
        if "error" in result:
            print(f"Error: {result['error']}")
            return
            
        questions = result.get("questions", [])
        print(f"Generated {len(questions)} questions in {end_time - start_time:.2f}s.")
        
    except Exception as e:
        print(f"Critical Error: {e}")
        return

    # 3. Interactive Quiz
    user_answers = {}
    correct_answers_map = {}
    
    for idx, q in enumerate(questions):
        correct_answers_map[idx] = q["answer"]
        
        print(f"\nQ{idx+1}: {q['question']}")
        for opt in q['options']:
            print(f"  {opt}") # Assuming options are just list of strings, user types A, B, C, D? 
            # Wait, options list is ["A) ...", "B) ..."] or just ["...", "..."]?
            # LLM prompt said: "options": ["A", "B", "C", "D"] in strict JSON? 
            # Wait, the user prompt in llm.py says: "options": List of 4 options (A, B, C, D).
            # Usually LLM returns ["A. Option text", "B. Option text"] or just the text. 
            # Let's handle both.
            
        # The prompt in llm.py asks for: 
        # options: List[str] = Field(description="List of 4 options (A, B, C, D).", min_items=4, max_items=4)
        # It's ambiguous if the LLM puts "A" in the string.
        # Let's just print them as bullet points.
        
        # Actually, let's look at `llm.py` prompt again.
        # It just says "List of 4 options". 
        # We will assume they are just the text content or with prefixes.
        
        choice = input("Your Answer (A/B/C/D): ").strip().upper()
        user_answers[str(idx)] = choice
    
    # 4. Evaluate
    print("\nEvaluating...")
    score_data = evaluate_submission(correct_answers_map, user_answers)
    
    print("\n=== Results ===")
    print(f"Score: {score_data['score']} / {score_data['total_questions']}")
    print(f"Correct Answers: {score_data['correct_answers']}")
    
    if score_data['score'] >= 7:
        print("Result: PASS")
    else:
        print("Result: FAIL")

if __name__ == "__main__":
    main()
