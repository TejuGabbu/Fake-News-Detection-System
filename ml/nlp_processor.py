"""
News Processing Module: Natural Language Processing (NLP) pipeline
Provides text cleaning, normalization, tokenization, stopword removal,
and sensationalism metric extraction for Fake News Detection.
"""

import re
import string
import unicodedata

# Comprehensive English stop words list (zero-dependency fallback ensuring offline robustness)
DEFAULT_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", 
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", 
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", 
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", 
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", 
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", 
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", 
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", 
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", 
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", 
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", 
    "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", 
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", 
    "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", 
    "yourself", "yourselves"
}

# High-frequency sensationalist & clickbait trigger phrases
CLICKBAIT_TRIGGERS = {
    "shocking", "bombshell", "unbelievable", "secret", "they don't want you to know",
    "miracle", "cure", "hoax", "exposed", "conspiracy", "mainstream media won't tell you",
    "must see", "mind blowing", "urgent alert", "wake up", "banned", "coverup",
    "hidden truth", "proven fraud", "leaked audio", "breaking bombshell", "rigged",
    "instant cure", "poison", "deep state", "scientists baffled", "classified leak"
}


class TextProcessor:
    """
    Standardized NLP pipeline for cleaning, tokenizing,
    and analyzing stylistic markers in news articles.
    """

    def __init__(self, use_nltk: bool = True):
        self.stopwords = set(DEFAULT_STOPWORDS)
        if use_nltk:
            try:
                import nltk
                try:
                    from nltk.corpus import stopwords
                    self.stopwords.update(stopwords.words("english"))
                except Exception:
                    # If NLTK data isn't downloaded yet, download quiet
                    nltk.download("stopwords", quiet=True)
                    from nltk.corpus import stopwords
                    self.stopwords.update(stopwords.words("english"))
            except Exception:
                pass

    def clean_text(self, text: str, remove_stopwords: bool = True) -> str:
        """
        Executes full text sanitization:
        1. Unicode normalization
        2. Lowercasing
        3. Stripping URLs, HTML tags, email addresses
        4. Removing punctuation and special symbols
        5. Stopword removal & extra whitespace compression
        """
        if not text or not isinstance(text, str):
            return ""

        # Normalize unicode (accents, curly quotes)
        text = unicodedata.normalize("NFKD", text)

        # Lowercase
        text = text.lower()

        # Remove URLs
        text = re.sub(r"https?://\S+|www\.\S+", " ", text)

        # Remove HTML tags
        text = re.sub(r"<.*?>", " ", text)

        # Remove email addresses
        text = re.sub(r"\S+@\S+", " ", text)

        # Remove numbers/digits if standalone
        text = re.sub(r"\b\d+\b", " ", text)

        # Remove punctuation and symbols
        text = re.sub(r"[%s]" % re.escape(string.punctuation), " ", text)

        # Tokenize by whitespace
        tokens = text.split()

        # Filter stopwords and short tokens
        if remove_stopwords:
            tokens = [t for t in tokens if t not in self.stopwords and len(t) > 2]

        return " ".join(tokens)

    def extract_linguistic_features(self, raw_text: str) -> dict:
        """
        Analyzes raw text for clickbait/manipulative linguistic markers:
        - Uppercase word ratio (shouting)
        - Exclamation and question mark density
        - Sensationalist trigger word count
        - Average sentence length
        """
        if not raw_text or not isinstance(raw_text, str):
            return {
                "uppercase_ratio": 0.0,
                "exclamation_count": 0,
                "question_count": 0,
                "sensational_trigger_count": 0,
                "detected_triggers": [],
                "sensationalism_score": 0.0,
                "word_count": 0
            }

        words = raw_text.split()
        word_count = len(words)
        if word_count == 0:
            return {
                "uppercase_ratio": 0.0,
                "exclamation_count": 0,
                "question_count": 0,
                "sensational_trigger_count": 0,
                "detected_triggers": [],
                "sensationalism_score": 0.0,
                "word_count": 0
            }

        # Calculate uppercase ratio for words with len > 1 (excluding 'I' or 'A')
        multi_char_words = [w for w in words if len(w) > 1 and w.isalpha()]
        uppercase_words = [w for w in multi_char_words if w.isupper()]
        uppercase_ratio = (len(uppercase_words) / len(multi_char_words)) if multi_char_words else 0.0

        # Punctuation counts
        exclamation_count = raw_text.count("!")
        question_count = raw_text.count("?")

        # Check for sensational triggers
        lower_raw = raw_text.lower()
        detected_triggers = []
        for trigger in CLICKBAIT_TRIGGERS:
            if re.search(r"\b" + re.escape(trigger) + r"\b", lower_raw):
                detected_triggers.append(trigger)

        # Composite Sensationalism Score (0.0 - 100.0)
        # Factor in: uppercase intensity, exclamation frequency, triggers
        trigger_penalty = min(len(detected_triggers) * 20, 50)
        caps_penalty = min(uppercase_ratio * 100, 30)
        punct_penalty = min((exclamation_count / max(word_count, 1)) * 300, 20)

        sensationalism_score = round(min(100.0, trigger_penalty + caps_penalty + punct_penalty), 1)

        return {
            "uppercase_ratio": round(uppercase_ratio * 100, 1),
            "exclamation_count": exclamation_count,
            "question_count": question_count,
            "sensational_trigger_count": len(detected_triggers),
            "detected_triggers": detected_triggers,
            "sensationalism_score": sensationalism_score,
            "word_count": word_count
        }


# Global default instance
processor = TextProcessor()
