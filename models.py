from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def utc_now():
    return datetime.now(timezone.utc)

class User(UserMixin, db.Model):
    """Admin User Model for authentication and session management."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default="admin", nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }


class PredictionLog(db.Model):
    """Audit trail of all analyzed articles, predictions, and XAI token attributions."""
    __tablename__ = "prediction_logs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    text_snippet = db.Column(db.Text, nullable=False)
    full_text = db.Column(db.Text, nullable=True)
    predicted_label = db.Column(db.String(50), nullable=False)  # "Real News" or "Potentially Fake News"
    prediction_code = db.Column(db.Integer, nullable=False)     # 0 or 1
    confidence = db.Column(db.Float, nullable=False)
    sensationalism_score = db.Column(db.Float, default=0.0)
    top_tokens_json = db.Column(db.Text, nullable=True)         # JSON serialized string
    user_feedback = db.Column(db.String(20), nullable=True)     # "agreed", "disputed"
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title or "Untitled News Text",
            "snippet": self.text_snippet,
            "predicted_label": self.predicted_label,
            "prediction_code": self.prediction_code,
            "confidence": self.confidence,
            "sensationalism_score": self.sensationalism_score,
            "user_feedback": self.user_feedback,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M")
        }


class DatasetArticle(db.Model):
    """Stored articles used for retraining and fine-tuning ML classifiers."""
    __tablename__ = "dataset_articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    label = db.Column(db.Integer, nullable=False)  # 0 = Real, 1 = Fake
    source = db.Column(db.String(128), default="Manual Submission")
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "label": "Potentially Fake News" if self.label == 1 else "Real News",
            "label_code": self.label,
            "source": self.source,
            "snippet": self.content[:140] + ("..." if len(self.content) > 140 else ""),
            "created_at": self.created_at.strftime("%Y-%m-%d")
        }


class ModelRetrainLog(db.Model):
    """Historical record of model retraining events and benchmark metrics."""
    __tablename__ = "model_retrain_logs"

    id = db.Column(db.Integer, primary_key=True)
    algorithm = db.Column(db.String(64), nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    precision = db.Column(db.Float, nullable=False)
    recall = db.Column(db.Float, nullable=False)
    f1_score = db.Column(db.Float, nullable=False)
    sample_count = db.Column(db.Integer, nullable=False)
    triggered_by = db.Column(db.String(64), default="admin")
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "algorithm": self.algorithm,
            "accuracy": self.accuracy,
            "precision": self.precision,
            "recall": self.recall,
            "f1_score": self.f1_score,
            "samples": self.sample_count,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M")
        }
