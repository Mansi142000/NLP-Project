# Cinebot: A Knowledge-Augmented Chatbot for Movie Recommendations
# Authors:
Rohan Rajendra Dalvi (dalvi.ro@northeastern.edu)
Mansi Negi (negi.ma@northeastern.edu)

## Project Overview
Cinebot is an intelligent movie recommendation system that enhances suggestions using Retrieval-Augmented Generation (RAG) with Large Language Models (LLMs).
Users simply type a natural-language query like "Find me an action movie from the 90s" and the system:

Parses the query into structured JSON (positive/negative keywords + filters),

Retrieves relevant movies from a vector database,

Applies metadata filters (genre, language, year, rating),

Generates natural language recommendations using an LLM.

No technical knowledge needed — just type what you're looking for!

## Technologies Used
LLMs: Groq's LLaMA 3, Gemma 2 (Ollama, Google Colab)

Embedding Models: MiniLM, DistilBERT variants

Vector Database: FAISS, ChromaDB

Frameworks: Python, Huggingface, LangChain, Scikit-Learn

Datasets: Kaggle Movie Metadata (60k+ titles, 192 genres, 296 languages)

## Key Achievements
Achieved 71% recommendation accuracy using the all-MiniLM-L6-v2 model.

Gemma 2, despite being 35× smaller, closely competed with Groq LLaMA on retrieval tasks.

Developed a robust metadata filtering and negative scoring pipeline.

Efficient retrieval and recommendation generation (~35–40 ms/query).

## Instructions to run. 
1. Unzip the project folder and do npm init
2. pip install from ./backend/requirements.txt
3. download the 5 faiss embeddings folders from our drive link (faiss_embeddings1...faiss_embeddings2) and add them directly to root directory. Include folder stucture.
4. download the gemma2-json-tuned folder..  it contains Modelfile and gemma-2b-finetuned-ggu