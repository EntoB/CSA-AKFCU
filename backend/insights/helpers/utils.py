import google.generativeai as genai #type: ignore
from feedback.models import Feedback
import os
from dotenv import load_dotenv
load_dotenv()



genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash-latest")

def generate_recommendations_from_feedbacks(feedback_list, service_name):
    if not feedback_list:
        return "No feedback available."

    if len(feedback_list) > 15:
        return "ERROR: Maximum 15 feedbacks allowed."

    prompt = f"""Analyze these {len(feedback_list)} farmer feedbacks about {service_name} service 
and provide 5-7 direct bullet-point recommendations.

Format requirements:
- Each point must start with a bullet (•)
- Only include actionable recommendations
- No explanations or justifications
- Prioritize by importance
- Use simple language

Feedbacks:
{chr(10).join(feedback_list)}

Recommendations:
• """

    try:
        response = model.generate_content(prompt)
        return "• " + response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"


def load_all_feedback():
    """
    Returns a list of dictionaries, each containing all columns for every feedback entry.
    """
    feedbacks = Feedback.objects.all().values()
    # print(feedbacks)
    return list(feedbacks)
