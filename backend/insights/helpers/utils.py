import google.generativeai as genai #type: ignore
from feedback.models import Feedback
import os
from dotenv import load_dotenv
load_dotenv()



genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash-latest")
    
def generate_recommendations_from_feedbacks(summaries, admin_needs):
    # genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    # model = genai.GenerativeModel("gemini-1.5-flash-latest")
    import pprint
    pprint.pprint(f"Generating recommendations for {admin_needs} with {len(summaries)} feedbacks")
    pprint.pprint(summaries)
    if not summaries:
        return ["No feedback available."]

    if len(summaries) > 15:#adjust this based on the charechter limit of the model
        return ["ERROR: Maximum 15 feedbacks allowed."]

    prompt = f"""
You are an expert agricultural consultant for a farmers' cooperative union in Ethiopia. Your task is to analyze sentiment and feedback from farmers and provide a focused summary of their collective concerns, insights, and common themes.

Here is the list of summarized feedback from the farmers:
Feedbacks:
{chr(10).join(summaries)}

Here is what the admin wants from the summary:
{admin_needs}

Instructions for Generating the Summary:

Core Task: Your primary goal is to synthesize the provided farmer feedback into a coherent summary that aligns with the admin's specified needs.
Focus on Commonality: Identify and highlight recurring issues, widely shared sentiments, and common requests or observations from the farmers.
Insightful Language: Describe the farmers' concerns and perspectives clearly and concisely. For example, instead of just saying "farmers complain about price," explain "Farmers frequently express frustration regarding fluctuating market prices and a perceived lack of transparency in pricing mechanisms."
Tone: Maintain a neutral, analytical, and professional tone.
Relevance Check:
If the admin's needs are not clearly related to or supported by the farmers' summarized feedback, your sole response must be: "Your needs are not related to the farmers' feedbacks, so the system could not provide any summary."
Be extremely cautious: The admin's needs might be misleading. Always default to the farmer feedback as the primary source of truth.
General Summary: If the admin explicitly requests a "general summary," then provide a comprehensive overview based on the overall feedback themes, without specific filtering.
Output Format: Provide a summary consisting of 3 to 6 distinct points or observations. Each point must be separated by a | character. Do not use bullet points, numbering, or introductory phrases like "Here is a summary..."
Generate the summary now, or the specific error message if conditions for summary generation are not met."""
    
    pprint.pprint({chr(10).join(summaries)})
    try:
        response = model.generate_content(prompt)
        text = response.text.strip().lstrip("•").strip()
        # If the system could not provide recommendations, return as a message
        if "the system could not provide" in text.lower():
            return {
                "recommendations": [],
                "message": text
            }
        # If the response does not contain '|', treat as failure
        if "|" not in text:
            return {
                "recommendations": [],
                "message": "Recommendation could not be generated. Please try again or refine your input."
            }
        # Otherwise, split by '|'
        recommendations = [rec.strip() for rec in text.split('|') if rec.strip()]
        return {
            "recommendations": recommendations,
            "message": ""
        }
    except Exception as e:
        return {
            "recommendations": [],
            "message": f"Error: {str(e)}"
        }
    


def load_all_feedback():
    """
    Returns a list of dictionaries, each containing all columns for every feedback entry.
    """
    feedbacks = Feedback.objects.all().values()
    # print(feedbacks)
    return list(feedbacks)
