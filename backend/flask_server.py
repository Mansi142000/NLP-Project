import faiss
import pickle
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
import os
import json
import chromadb
import ast

# Load FAISS and metadata
base_dir = "./faiss_embeddings1"
model_name = 'sentence-transformers/multi-qa-MiniLM-L6-cos-v1'
index = faiss.read_index(f"{base_dir}/movie_index.faiss")

with open(f"{base_dir}/movie_ids.pkl", "rb") as f:
    id_list = pickle.load(f)

metadata = pd.read_csv(f"{base_dir}/movie_metadata.csv")
model = SentenceTransformer(model_name)

def clean_nans(obj):
    if isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(item) for item in obj]
    elif isinstance(obj, float) and (obj != obj):  # check for NaN
        return None
    return obj


# Metadata filtering logic
def metadata_filter(row, row_checker):
    min_year = row_checker.get("min_year", float("-inf"))
    max_year = row_checker.get("max_year", float("inf"))
    min_rating = row_checker.get("min_rating", float("-inf"))
    max_rating = row_checker.get("max_rating", float("inf"))
    min_duration = row_checker.get("min_duration", float("-inf"))
    max_duration = row_checker.get("max_duration", float("inf"))

    required_genres = set(row_checker.get("required_genres", []))
    excluded_genres = set(row_checker.get("excluded_genres", []))
    required_languages = set(row_checker.get("required_languages", []))
    excluded_languages = set(row_checker.get("excluded_languages", []))

    def parse_list(cell):
        try:
            return set(ast.literal_eval(cell)) if isinstance(cell, str) else set(cell)
        except (ValueError, SyntaxError):
            return set()

    try:
        year = int(row.get("year", 0))
        rating = float(row.get("rating", 0.0))
        duration = int(row.get("duration", 0))
    except (ValueError, TypeError):
        return False

    year_check = min_year <= year <= max_year
    rating_check = min_rating <= rating <= max_rating
    duration_check = min_duration <= duration <= max_duration

    genres = parse_list(row.get("genres", "[]"))
    languages = parse_list(row.get("languages", "[]"))

    genre_inclusion_check = not required_genres or bool(genres & required_genres)
    genre_exclusion_check = not (genres & excluded_genres)

    language_inclusion_check = not required_languages or bool(languages & required_languages)
    language_exclusion_check = not (languages & excluded_languages)

    return (
        year_check and
        rating_check and
        duration_check and
        genre_inclusion_check and
        genre_exclusion_check and
        language_inclusion_check and
        language_exclusion_check
    )

# Dual query movie search

def search_movies_dual_query_fast(
    positive_query,
    negative_query=None,
    top_k=10,
    search_batch_size=200,
    row_checker={},
    alpha=1.0,
    beta=1.0
):
    pos_embed = model.encode([positive_query], normalize_embeddings=True).astype("float32")
    neg_embed = None
    if negative_query:
        neg_embed = model.encode([negative_query], normalize_embeddings=True).astype("float32")

    D_pos, I_pos = index.search(pos_embed, search_batch_size)
    scored_results = []

    for rank, idx in enumerate(I_pos[0]):
        movie_id = id_list[idx]
        row = metadata[metadata["id"] == movie_id].iloc[0].to_dict()
        if not metadata_filter(row, row_checker):
            continue

        pos_sim = float(D_pos[0][rank])
        neg_sim = 0.0
        if neg_embed is not None:
            embedding = index.reconstruct(int(idx))
            neg_sim = float(np.dot(embedding, neg_embed[0]))

        score = alpha * pos_sim - beta * neg_sim

        scored_results.append({
            "id": movie_id,
            "positive_similarity": pos_sim,
            "negative_similarity": neg_sim,
            "score": score,
            "metadata": row
        })

    sorted_results = sorted(scored_results, key=lambda x: x["score"], reverse=True)
    return sorted_results[:top_k]

# Flask setup
load_dotenv()
API_KEY = os.getenv("API_KEY")
client = Groq(api_key=API_KEY)
app = Flask(__name__)
CORS(app)

chroma_client = chromadb.PersistentClient(path="./chromadb_client")
collection = chroma_client.get_collection(name="best_movies_database")

@app.route('/run-groq', methods=['POST'])
def run_groq():
    try:
        data = request.get_json()
        role_content_obj_list = data.get("messages", [])

        chat_completion = client.chat.completions.create(
            messages=role_content_obj_list,
            model="llama-3.3-70b-versatile",
            max_tokens=10000,
        )

        response = chat_completion.choices[0].message.content
        return jsonify({"response": response})
    except Exception as e:
        import traceback
        print("Error in /run-groq:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/run-query', methods=['GET'])
def run_query():
    query_text = request.args.get('query')
    filter_criteria = request.args.get('filter')
    result_size = request.args.get('size', default=1, type=int)

    if not query_text:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        if filter_criteria:
            results = collection.query(
                query_texts=[query_text],
                n_results=result_size,
                where=json.loads(filter_criteria)
            )
        else:
            results = collection.query(
                query_texts=[query_text],
                n_results=result_size
            )
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/advanced-query-search', methods=['POST'])
def advanced_query_search():
    try:
        data = request.get_json()
        positive_query = data.get('positive_query')
        negative_query = data.get('negative_query')
        top_k = int(data.get('top_k', 10))
        search_batch_size = int(data.get('search_batch_size', 200))
        row_checker = data.get('row_checker', {})
        alpha = float(data.get('alpha', 1.0))
        beta = float(data.get('beta', 1.0))

        if not positive_query:
            return jsonify({"error": "positive_query is required"}), 400

        results = search_movies_dual_query_fast(
            positive_query=positive_query,
            negative_query=negative_query,
            top_k=top_k,
            search_batch_size=search_batch_size,
            row_checker=row_checker,
            alpha=alpha,
            beta=beta
        )
        print("Results:", results)
        cleaned_results = clean_nans(results)
        return jsonify({"results": cleaned_results})
    except Exception as e:
        import traceback
        print("Error in /advanced-query-search:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
