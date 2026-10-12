# Veritas AI: Web-Based Fake News Detection System

An enterprise-grade, Explainable AI (XAI) misinformation intelligence platform built to detect deceptive, manipulative, and fabricated digital news stories. Designed using modern Natural Language Processing (NLP), Machine Learning classifiers (Scikit-Learn), Python Flask, SQLite, and Bootstrap 5 with custom glassmorphism aesthetics.

---

## System Modules Overview

1. **User Module**: Sleek, responsive web interface allowing users to input headlines and article bodies, select pre-loaded verified sample stories with 1 click, and trigger real-time AI scanning.
2. **News Processing Module**: Custom NLP preprocessing pipeline that lowercases, removes punctuation, eliminates stopwords, sanitizes URLs and HTML, and transforms text into TF-IDF n-gram vectors (unigrams & bigrams).
3. **Prediction Module**: Evaluates multiple machine learning classifiers:
   - Calibrated Logistic Regression (Default & optimal for XAI)
   - Multinomial Naive Bayes
   - Passive-Aggressive Classifier / Linear SVM
   - Random Forest Classifier (120 Estimators)
4. **Result Module**:
   - Clear High-Contrast Verdict Card (`REAL NEWS` vs `POTENTIALLY FAKE NEWS`).
   - Circular SVG animated confidence gauge.
   - **Strict Automated Assessment Disclaimer** emphasizing probabilistic nature and warning against taking algorithmic assessments as absolute truth.
5. **Admin Module**:
   - Authenticated portal (`admin` / `admin123`).
   - Real-time telemetry: Total Scans, Fake % Ratio, Active Model, Corpus size.
   - Chart.js visual analytics (verdict distribution, scan history).
   - Dataset repository management with search, article addition, and CSV sync.
   - Live Model Retraining Studio: Benchmark and swap algorithms on-the-fly with immediate Accuracy, Precision, Recall, and F1 updates.
6. **Advanced Research Features**:
   - **Explainable AI (XAI)**: Token-level attribution highlighting manipulative words in red and credible words in green with interactive tooltips showing exact model weights.
   - **Educational Context & SIFT Protocol**: Diagnostic breakdown explaining why a verdict was reached, linguistic sensationalism index, and direct 1-click queries searching accredited fact-checkers (Google Fact Check Tools, Snopes, PolitiFact, FactCheck.org, Reuters).

---

## Technology Stack

- **Backend**: Python 3.14, Flask, Flask-SQLAlchemy, Flask-Login, Joblib
- **Machine Learning & NLP**: Scikit-learn, Pandas, NumPy, NLTK
- **Database**: SQLite (Zero configuration, stored in `instance/fakenews.db`)
- **Frontend**: HTML5, Vanilla CSS Design System with Glassmorphism, Bootstrap 5.3, FontAwesome 6, Chart.js, Google Fonts (Plus Jakarta Sans, JetBrains Mono)

---

## Installation & Running Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Dataset & Train Initial Model
```bash
python data/generate_dataset.py
python ml/train_model.py
```

### 3. Initialize Database
```bash
python seed_data.py
```

### 4. Start the Web Server
```bash
python app.py
```
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`
- **Dashboard URL**: `http://127.0.0.1:5000/admin/login`

---

## Running Automated Tests
```bash
python -m unittest tests/test_pipeline.py
python -m unittest tests/test_routes.py
```
