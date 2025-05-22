# type: ignore
from textblob import TextBlob
import requests
from langdetect import detect
import requests
import google.generativeai as genai
import os

def generalize_feedback(feedback_text, service_name):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    try:
        prompt = f"""
You are a helpful assistant that summarizes farmer feedback about the service: {service_name}.

1. If the feedback is just something like "It is good", "It is bad", "It's okay", or doesn't explain anything, then ignore it and respond with: "ignore".
2. If the feedback includes even a small detail or a recommendation, then give me a resonce containing only one or two short sentences that summarize what the farmer is trying to address.
3. Emphasize issues where the farmer has a specific recommendation and improvement points.
4. Avoid fancy language — use simple, real farmer wording.

Feedback:
\"{feedback_text}\"

Output:
"""
        response = model.generate_content(prompt)
        response_text = response.text.strip().lower()

        if "ignore" in response_text:
            return "This feedback was too vague to summarize clearly."

        # Clean response
        sentences = [s.strip() for s in response.text.strip().split('\n') if s.strip()]
        return ' '.join(sentences[:2])

    except Exception as e:
        print(f"Gemini generalization error: {str(e)}")
        return "Could not summarize feedback at this time."

def analyze_sentiment(message):
    analysis = TextBlob(me  ssage)
    polarity = analysis.sentiment.polarity
    if polarity > 0:
        return 'positive'
    elif polarity == 0:
        return 'neutral'
    else:
        return 'negative'



def translate_text(text, source_lang="Autodetect"):
    """Translate text using MyMemory API, only if not English"""
    try:
        # Auto-detect the language if set to "Autodetect"
        if source_lang == "Autodetect":
            detected_lang = detect(text)
        else:
            detected_lang = source_lang.lower()

        # If the text is already in English, return it as-is
        if detected_lang == "en":
            return text

        # Otherwise, call the API to translate
        url = "https://api.mymemory.translated.net/get"
        params = {
            "q": text,
            "langpair": f"{detected_lang}|en"
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if 'responseData' in data and data['responseData']['translatedText']:
            return data['responseData']['translatedText']
        return None

    except Exception as e:
        print(f"Translation failed: {str(e)}")
        return None
