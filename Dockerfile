FROM python:3.12-slim

# Prevent Python from writing .pyc and buffer stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

WORKDIR /app

# Install build dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK stopwords quiet
RUN python -c "import nltk; nltk.download('stopwords', quiet=True)"

# Copy application source
COPY . .

# Ensure instance and models directories exist
RUN mkdir -p instance models

EXPOSE 5000

# Run with Gunicorn
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5000} --workers 2 --timeout 120"]
