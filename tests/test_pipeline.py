"""
Unit tests for NLP pipeline, Sensationalism metrics, and ML prediction.
"""

import os
import unittest
from ml.nlp_processor import processor
from ml.explainable_ai import ExplainableAI

class TestNLPPipeline(unittest.TestCase):
    def test_clean_text_basic(self):
        raw = "SHOCKING! The quick brown fox jumps over http://example.com/fake news!"
        cleaned = processor.clean_text(raw)
        # Should be lowercase, no exclamation, no url, no stopword 'the', 'over'
        self.assertNotIn("http", cleaned)
        self.assertNotIn("!", cleaned)
        self.assertNotIn("the", cleaned.split())
        self.assertIn("shocking", cleaned)
        self.assertIn("quick", cleaned)

    def test_linguistic_features(self):
        clickbait_text = "SHOCKING BOMBSHELL: MIRACLE CURE THEY DON'T WANT YOU TO KNOW!!!"
        features = processor.extract_linguistic_features(clickbait_text)
        self.assertGreater(features["uppercase_ratio"], 50.0)
        self.assertGreaterEqual(features["exclamation_count"], 3)
        self.assertGreaterEqual(features["sensational_trigger_count"], 1)
        self.assertGreater(features["sensationalism_score"], 40.0)

    def test_linguistic_features_calm(self):
        calm_text = "The committee convened on Tuesday morning to discuss municipal water filtration standards."
        features = processor.extract_linguistic_features(calm_text)
        self.assertEqual(features["exclamation_count"], 0)
        self.assertEqual(features["sensational_trigger_count"], 0)
        self.assertLess(features["sensationalism_score"], 20.0)

    def test_xai_highlighting_fallback(self):
        xai = ExplainableAI()
        raw = "Scientists confirm new discovery"
        explanation = xai.explain_prediction(
            raw_text=raw,
            cleaned_text="scientists confirm new discovery",
            prediction=0,
            confidence=90.0,
            linguistic_stats={"sensationalism_score": 0.0}
        )
        self.assertIn("highlighted_html", explanation)
        self.assertIn("educational_summary", explanation)
        self.assertIn("fact_check_resources", explanation)
        self.assertEqual(len(explanation["fact_check_resources"]), 5)

if __name__ == "__main__":
    unittest.main()
