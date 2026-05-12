# Sentiment Analysis with NLP: Python Project Guide

This guide explains the modules of the python sentiment analysis project for beginners.

## 1. Project Overview
This project takes raw text input, processes it using Natural Language Processing (NLP), and uses a Machine Learning model (Logistic Regression) to predict if the sentiment is Positive, Negative, or Neutral.

## 2. Step-by-Step Implementation

### Step 1: Data Preparation
We use a labeled dataset (Text vs Sentiment). In `model_training.py`, we load this data using Pandas.

### Step 2: NLP Preprocessing
Before feeding text to a model, we must clean it:
- **Lowercasing**: To ensure 'Good' and 'good' are treated same.
- **Tokenization**: Breaking sentences into words.
- **Stopword Removal**: Removing common words like 'is', 'the', which don't add sentiment.
- **Lemmatization**: Converting words like 'running' to 'run'.

### Step 3: Vectorization (TF-IDF)
Computers can't read words, only numbers. TF-IDF (Term Frequency-Inverse Document Frequency) converts text into a matrix of numbers based on word importance.

### Step 4: Model Training
We use **Logistic Regression**, a powerful classification algorithm, to learn patterns between the word vectors and the sentiment labels.

### Step 5: Web Application
We use **Streamlit** to create a user-friendly interface. It captures user input, applies the trained model, and displays the result with colors and emojis.

## 3. How to Run
1. Install dependencies: `pip install -r requirements.txt`
2. Train the model: `python model_training.py`
3. Launch the app: `streamlit run app.py`
