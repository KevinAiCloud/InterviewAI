from typing import Dict, List, Any
from config import QUESTION_COUNT

def evaluate_submission(correct_answers: Dict[int, str], user_answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Evaluates the user's answers against the correct answers.
    
    Args:
        correct_answers: Dict mapping question index (int) to correct option (str, e.g., "A").
        user_answers: Dict mapping question index (str) to selected option (str).
        
    Returns:
        Dict containing total questions, correct count, score, and optional details.
    """
    correct_count = 0
    
    # Ensure we are comparing same types for keys
    # correct_answers keys are expected to be 0-based integers based on list index in generation
    
    for q_idx, correct_opt in correct_answers.items():
        # Convert index to string to match JSON keys from frontend usually
        q_key = str(q_idx)
        user_opt = user_answers.get(q_key)
        
        if user_opt and user_opt.strip().upper() == correct_opt.strip().upper():
            correct_count += 1
            
    score = correct_count  # Simple 1 point per question
    
    return {
        "total_questions": len(correct_answers),
        "correct_answers": correct_count,
        "score": score
    }
