import os
import time
from resumeparser import ResumeParser
from llm import analyze_resume

def get_multiline_input(prompt_text):
    print(prompt_text)
    print("(Press 'Enter' twice to finish)")
    lines = []
    while True:
        line = input()
        if not line:
            break
        lines.append(line)
    return "\n".join(lines)

def main():
    print("=== Resume Compatibility Analyzer ===")
    
    # Check enviroment
    if not os.getenv("OPENROUTER_API_KEY"):
        print("WARNING: OPENROUTER_API_KEY is not set in environment. Queries may fail.")
        # Optional: Ask user for one if not found (omitted for strict instructions)

    # 1. Get PDF Path
    while True:
        pdf_path = input("\nEnter path to resume PDF: ").strip().strip('"').strip("'")
        if os.path.isfile(pdf_path):
            break
        print("File not found. Please try again.")

    # 2. Parse PDF
    print("\nProcessing Resume...")
    try:
        parser = ResumeParser()
        resume_text = parser.parse(pdf_path)
        if not resume_text:
            print("Failed to extract text from PDF.")
            return
        print(f"Successfully extracted {len(resume_text)} characters.")
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return

    # 3. Get Job Description
    jd_text = get_multiline_input("\nEnter the Job Description:")

    if not jd_text.strip():
        print("Job Description is empty. Exiting.")
        return

    # 4. Analyze
    print("\nAnalyzing with AI (Gemini 2.0 Flash Lite)...")
    try:
        start_time = time.time()
        result = analyze_resume(resume_text, jd_text)
        end_time = time.time()
        
        print("\n=== Analysis Result ===")
        import json
        print(json.dumps(result, indent=2))
        print(f"\nAnalysis time: {end_time - start_time:.2f}s")
        
    except Exception as e:
        print(f"\nAn error occurred during analysis: {e}")

if __name__ == "__main__":
    main()
