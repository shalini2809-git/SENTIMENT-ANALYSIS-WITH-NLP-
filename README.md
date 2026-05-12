# Sentiment Lab: Advanced NLP Intelligence Platform

An enterprise-grade Sentiment Analysis and Emotional Intelligence platform. This project combines state-of-the-art Large Language Models (LLMs) with traditional Machine Learning architectures.

## 🚀 Advanced Features

### 1. Intelligence Core
- **Multi-Polar Sentiment**: Accurate classification into Positive, Negative, or Neutral.
- **Emotion Mining**: Detection of Happy, Sad, Angry, Fear, Excited, and Disgusted states.
- **Named Entity Recognition (NER)**: Automated extraction of Persons, Locations, and Organizations.
- **Summarization & Suggestions**: AI-generated executive summaries and context-aware transition suggestions.
- **Spam & Sarcasm Detection**: Identifies potential fake reviews or suspicious language patterns.

### 2. High-Density Analytics
- **Bulk Processing Hub**: Upload CSV/Excel files for real-time analysis of up to 50 entries.
- **Benchmarks**: Direct comparison between traditional ML (Logistic Regression, Random Forest, SVM) and Deep Learning (LSTM, BERT Transformers).
- **Interactive Reports**: Distribution pie charts and confusion matrices for model transparency.

### 3. User & Enterprise Scaling
- **Secure Authentication**: Google OAuth integration with persistent profile syncing.
- **Persistence Log**: All analyses are stored securely in Firestore for future reference.
- **Voice Integration**: Native Web Speech API support for real-time voice-to-text analysis.
- **Admin Center**: Shielded dashboard for monitoring session counts and system uptime.

### 4. Educational Python Sub-Project
Located in `/python_sentiment_project`, this module includes:
- `model_training.py`: Full NLP pipeline (Preprocessing, Tokenization, TF-IDF).
- `app.py`: Pure Python Streamlit interface.
- `CAREER.md`: Professional resume assets and interview prep for NLP roles.

## 📁 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Framer Motion.
- **Cloud/Data**: Firebase (Auth & Firestore).
- **Inference**: Google Generative AI (Gemini 1.5 Flash).
- **Python Stack**: Scikit-learn, NLTK, Streamlit, Pandas.

## 📖 Deployment
- **Frontend**: Best deployed on Cloud Run or Vercel.
- **Python App**: Designed for Streamlit Cloud or Render.
- **Docker**: Simple Dockerfile can wrap either environment for containerized deployment.
