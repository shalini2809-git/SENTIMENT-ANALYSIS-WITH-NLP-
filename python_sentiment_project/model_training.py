import pandas as pd
import numpy as np
import nltk
import re
import joblib
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 1. Dataset Handling (Using IMDb sample)
def load_data():
    # In a real project, replace with: pd.read_csv('dataset.csv')
    data = {
        'text': [
            'I loved this movie, it was fantastic!',
            'The acting was terrible and the plot was boring.',
            'It was an okay experience, nothing special.',
            'Absolutely wonderful cinematography!',
            'I hated every minute of it.',
            'The movie was decent, worth a watch once.',
            'Best film of the year!',
            'Complete waste of time and money.'
        ],
        'sentiment': ['Positive', 'Negative', 'Neutral', 'Positive', 'Negative', 'Neutral', 'Positive', 'Negative']
    }
    return pd.DataFrame(data)

# 2. Text Preprocessing
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words]
    return " ".join(tokens)

print("Pre-processing data...")
df = load_data()
df['clean_text'] = df['text'].apply(preprocess)

# 3. Vectorization
print("Vectorizing text...")
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['clean_text'])
y = df['sentiment']

# 4. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Model Training
print("Training model...")
model = LogisticRegression()
model.fit(X_train, y_train)

# 6. Evaluation
y_pred = model.predict(X_test)
print("\nModel Evaluation:")
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 7. Save Model
joblib.dump(model, 'sentiment_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
print("\nModel and Vectorizer saved successfully!")
