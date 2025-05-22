# type: ignore
from textblob import TextBlob
import requests
from langdetect import detect
import requests

def analyze_sentiment(message):
    analysis = TextBlob(message)
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
