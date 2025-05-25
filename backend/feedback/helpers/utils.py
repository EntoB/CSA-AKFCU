# type: ignore
from textblob import TextBlob
import requests
from langdetect import detect
import requests
import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv()

def generalize_feedback(feedback_text, service_name, service_type):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    try:
        prompt = f"""
You are a helpful assistant that summarizes a farmer's feedback about the service: {service_name} that is categrorized under the {service_type} category.

1. If the feedback is just something like "It is good", "It is bad", "It's okay", or doesn't explain anything, then ignore it and respond with: "ignore".
2. If the feedback includes even a small detail or a recommendation, then give me a resonce containing only one or two short sentences that summarize what the farmer is trying to address. If the feedback is too long, focus on the main points and make it 2 or 3 sentences.
3. Emphasize issues where the farmer has a specific recommendation and improvement points.
4. The summary should always be less than the original feedback.
Feedback:
\"{feedback_text}\"

After reading the feedback, please summarize it in one or two sentences. If the feedback is too vague, respond with "ignore".
"""
        response = model.generate_content(prompt)
        response_text = response.text.strip().lower()

        if "ignore" in response_text:
            return ''

        # Clean response
        sentences = [s.strip() for s in response_text.split('\n') if s.strip()]
        if len(sentences) < 2:
            sentences = [s.strip() for s in response_text.replace('.', '.\n').split('\n') if s.strip()]
        return ' '.join(sentences[:2])

    except Exception as e:
        print(f"Gemini generalization error: {str(e)}")
        return True

def analyze_sentiment(message):
    analysis = TextBlob(message)
    polarity = analysis.sentiment.polarity
    if polarity > 0:
        return 'positive'
    elif polarity == 0:
        return 'neutral'
    else:
        return 'negative'



from langdetect import detect, LangDetectException

def translate_text(text, source_lang="Autodetect"):
    """Translate text using MyMemory API, only if not English"""
    try:
        # Try to detect language, fallback to 'am' if detection fails and text contains Amharic characters
        try:
            lang = detect(text)
        except LangDetectException:
            # Fallback: check for Amharic unicode range
            if any('\u1200' <= c <= '\u137F' for c in text):
                lang = "am"
            else:
                lang = "en"  # Default to English if detection fails and not Amharic

        if lang == "am":
            detected_lang = "am"
        elif source_lang == "Autodetect":
            detected_lang = lang
        else:
            detected_lang = source_lang.lower()

        # If the text is already in English, return it as-is
        if detected_lang == "en":
            return text
        print(f"Detected language: {detected_lang}")
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
        print(f"Translation failed: {str(e)} {text}")
        return None
    
    
import requests

def classify_sentiment_with_api(text):
    """
    Calls the local sentiment analysis API to classify the given text.
    Returns a dict with predictions from both custom and pretrained models.
    """
    url = "http://127.0.0.1:9000/api/analyze/"
    try:
        response = requests.post(
            url,
            json={"text": text},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        print(f"Sentiment API response: {data}")
        # Example return:
        # {
        #   'predictions': {
        #       'custom_model': {'sentiment': 'positive', 'model_type': 'random_forest'},
        #       'pretrained_model': {'sentiment': 'positive', 'confidence': 0.98, 'model_type': 'roberta'}
        #   },
        #   'status': 'success'
        # }
        return data
    except Exception as e:
        print(f"Sentiment API error: {str(e)}")
        return {
            "predictions": {
                "custom_model": {"sentiment": "unknown", "model_type": "random_forest"},
                "pretrained_model": {"sentiment": "unknown", "confidence": 0.0, "model_type": "roberta"}
            },
            "status": "error",
            "error": str(e)
        }