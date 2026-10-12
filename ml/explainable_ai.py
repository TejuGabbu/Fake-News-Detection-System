"""
Explainable AI (XAI) and Educational Context Module.
Provides transparent, token-level attribution to explain ML predictions,
highlights manipulative vs credible words, and generates educational fact-check advice.
"""

import re
import urllib.parse
from typing import List, Dict, Any, Tuple

class ExplainableAI:
    """
    Interprets model decisions using feature weights, TF-IDF representations,
    and linguistic markers to generate human-interpretable explanations.
    """

    def __init__(self, vectorizer=None, model=None):
        self.vectorizer = vectorizer
        self.model = model

    def set_artifacts(self, vectorizer, model):
        self.vectorizer = vectorizer
        self.model = model

    def explain_prediction(self, raw_text: str, cleaned_text: str, prediction: int, confidence: float, linguistic_stats: dict) -> dict:
        """
        Generates full explainability payload:
        - Top influential tokens for Fake vs Real
        - Token highlights injected into the original text
        - Educational diagnosis explaining why the prediction occurred
        - Pre-formatted fact-checking search links
        """
        top_fake_tokens = []
        top_real_tokens = []
        token_weights = {}

        if self.vectorizer is not None and self.model is not None and cleaned_text:
            token_weights, top_fake_tokens, top_real_tokens = self._extract_token_weights(cleaned_text)

        # Highlight tokens in the original raw text
        highlighted_html = self._generate_highlighted_html(raw_text, token_weights)

        # Educational rationale
        educational_summary = self._generate_educational_rationale(
            prediction=prediction,
            confidence=confidence,
            top_fake=top_fake_tokens,
            top_real=top_real_tokens,
            linguistic_stats=linguistic_stats
        )

        # Fact checking links
        fact_check_resources = self._generate_fact_check_links(raw_text)

        return {
            "top_fake_indicators": top_fake_tokens,
            "top_real_indicators": top_real_tokens,
            "highlighted_html": highlighted_html,
            "token_weights": token_weights,
            "educational_summary": educational_summary,
            "fact_check_resources": fact_check_resources
        }

    def _extract_token_weights(self, cleaned_text: str) -> Tuple[Dict[str, float], List[dict], List[dict]]:
        """
        Computes local token contribution using TF-IDF and classifier weights.
        """
        try:
            feature_names = self.vectorizer.get_feature_names_out()
            tfidf_vec = self.vectorizer.transform([cleaned_text])
            
            # Check if model has linear coefficients (LogisticRegression, SGD, LinearSVC, PassiveAggressive)
            if hasattr(self.model, "coef_"):
                coefs = self.model.coef_[0]
            elif hasattr(self.model, "feature_importances_"):
                # Random forest / tree models (all positive importances)
                coefs = self.model.feature_importances_
            else:
                coefs = None

            token_scores = {}
            if coefs is not None:
                cx = tfidf_vec.tocoo()
                for i, j, v in zip(cx.row, cx.col, cx.data):
                    feature_word = feature_names[j]
                    weight = float(coefs[j] * v)
                    token_scores[feature_word] = weight

            # Sort by weight
            # Positive weight: pushes toward Fake (label 1)
            # Negative weight: pushes toward Real (label 0)
            sorted_by_weight = sorted(token_scores.items(), key=lambda x: x[1], reverse=True)

            fake_indicators = []
            real_indicators = []

            for word, weight in sorted_by_weight:
                if weight > 0.05:
                    fake_indicators.append({
                        "token": word,
                        "weight": round(weight, 3),
                        "impact": "Manipulative / Sensationalist Flag",
                        "direction": "fake"
                    })
                elif weight < -0.05:
                    real_indicators.append({
                        "token": word,
                        "weight": round(abs(weight), 3),
                        "impact": "Credible / Objective Terminology",
                        "direction": "real"
                    })

            # Sort real indicators so largest negative impact is first
            real_indicators.sort(key=lambda x: x["weight"], reverse=True)

            return token_scores, fake_indicators[:8], real_indicators[:8]

        except Exception as e:
            print(f"XAI attribution warning: {e}")
            return {}, [], []

    def _generate_highlighted_html(self, raw_text: str, token_weights: Dict[str, float]) -> str:
        """
        Surrounds influential words in raw text with interactive styling and tooltips.
        """
        if not raw_text:
            return ""

        # Escape existing HTML to prevent injection
        text = raw_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        # Sort tokens by length descending so multi-word n-grams are matched before single words
        sorted_tokens = sorted(token_weights.keys(), key=lambda x: len(x), reverse=True)

        for token in sorted_tokens:
            weight = token_weights[token]
            if abs(weight) < 0.03:
                continue

            # Determine badge style
            if weight > 0:
                css_class = "xai-token xai-token-fake"
                category = "Misinformation Flag"
                tooltip = f"Suspicion influence: +{weight:.2f}"
            else:
                css_class = "xai-token xai-token-real"
                category = "Credibility Marker"
                tooltip = f"Verification influence: {weight:.2f}"

            # Regex replacement preserving original capitalization
            pattern = re.compile(r"\b(" + re.escape(token) + r")\b", re.IGNORECASE)
            replacement = (
                f'<mark class="{css_class}" tabindex="0" '
                f'data-bs-toggle="tooltip" data-bs-placement="top" '
                f'title="{category} ({tooltip})">\\1</mark>'
            )
            text = pattern.sub(replacement, text)

        # Convert line breaks to paragraphs
        paragraphs = text.split("\n\n")
        formatted = "".join(f"<p class='analysis-paragraph'>{p.replace(chr(10), '<br>')}</p>" for p in paragraphs if p.strip())
        return formatted if formatted else text

    def _generate_educational_rationale(self, prediction: int, confidence: float, top_fake: list, top_real: list, linguistic_stats: dict) -> dict:
        """
        Constructs educational insights to empower media literacy.
        """
        is_fake = (prediction == 1)

        points = []
        if is_fake:
            headline = "Why Was This Flagged as Potentially Fake News?"
            if linguistic_stats.get("sensational_trigger_count", 0) > 0:
                triggers = ", ".join(f"'{t}'" for t in linguistic_stats["detected_triggers"][:3])
                points.append(f"Sensationalist triggers detected ({triggers}), which are commonly leveraged to provoke impulsive emotional reactions.")
            
            if linguistic_stats.get("uppercase_ratio", 0) > 12.0:
                points.append(f"Unusually high uppercase letter density ({linguistic_stats['uppercase_ratio']}%), signaling hyperbolic shouting or urgent alarmist tone.")

            if linguistic_stats.get("exclamation_count", 0) >= 3:
                points.append(f"Repeated exclamation marks ({linguistic_stats['exclamation_count']}), an informal stylistic hallmark rarely seen in peer-reviewed or standard journalistic reporting.")

            if top_fake:
                top_words = ", ".join(f"'{item['token']}'" for item in top_fake[:3])
                points.append(f"Vocabulary attribution identified {top_words} as high-risk lexical patterns strongly correlated with unverified claims.")

            if not points:
                points.append("The phrasing exhibits lexical dissonance with verified news corpora, lacking named institutional citations or empirical qualifiers.")

            action_advice = "Exercise caution before sharing. Cross-reference this claim against verified fact-check databases below."
        else:
            headline = "Why Did the Model Rate This as Real / Credible News?"
            points.append("The syntax utilizes balanced, objective journalistic reporting conventions rather than hyperbolic urgency.")
            if top_real:
                top_words = ", ".join(f"'{item['token']}'" for item in top_real[:3])
                points.append(f"Strong lexical indicators detected ({top_words}) corresponding to institutional reporting, scientific methodology, or formal documentation.")
            points.append(f"Low sensationalism score ({linguistic_stats.get('sensationalism_score', 0)}/100) and minimal presence of emotional trigger words.")
            action_advice = "While this article exhibits structural characteristics of legitimate journalism, always consult the primary publication source for definitive confirmation."

        return {
            "headline": headline,
            "verdict_type": "fake" if is_fake else "real",
            "explanation_points": points,
            "action_advice": action_advice,
            "sensationalism_index": linguistic_stats.get("sensationalism_score", 0),
            "reading_level": "Professional / Analytical" if not is_fake else "Sensational / Alarmist"
        }

    def _generate_fact_check_links(self, raw_text: str) -> List[dict]:
        """
        Creates direct fact-checking search URLs pre-populated with article context.
        """
        # Extract first sentence or first 10 words as headline query
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        first_sentence = lines[0] if lines else raw_text[:80]
        # Clean special characters for search query
        query_text = re.sub(r"[^\w\s]", "", first_sentence)[:70].strip()
        encoded_query = urllib.parse.quote_plus(query_text)

        return [
            {
                "name": "Google Fact Check Explorer",
                "badge": "Search Engine",
                "icon": "fa-google",
                "url": f"https://toolbox.google.com/factcheck/explorer/search/{encoded_query};hl=en",
                "desc": "Searches global fact-checks reviewed by IFCN-accredited organizations."
            },
            {
                "name": "Snopes Fact Check",
                "badge": "Independent",
                "icon": "fa-magnifying-glass",
                "url": f"https://www.snopes.com/?s={encoded_query}",
                "desc": "Leading debunking database for viral internet rumors and urban legends."
            },
            {
                "name": "PolitiFact",
                "badge": "Pulitzer Prize Winner",
                "icon": "fa-scale-balanced",
                "url": f"https://www.politifact.com/search/?q={encoded_query}",
                "desc": "Detailed Truth-O-Meter assessments on political statements and public affairs."
            },
            {
                "name": "FactCheck.org",
                "badge": "Nonpartisan / Academic",
                "icon": "fa-shield-halved",
                "url": f"https://www.factcheck.org/?s={encoded_query}",
                "desc": "Annenberg Public Policy Center project monitoring factual accuracy."
            },
            {
                "name": "Reuters Fact Check",
                "badge": "Global Wire Service",
                "icon": "fa-newspaper",
                "url": f"https://www.reuters.com/site-search/?query={encoded_query}",
                "desc": "Wire-service investigation of viral digital media, photos, and claims."
            }
        ]
