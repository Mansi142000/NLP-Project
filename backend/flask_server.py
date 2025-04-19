from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
import os
import json
import chromadb

load_dotenv()

API_KEY = os.getenv("API_KEY")
client = Groq(api_key=API_KEY)
app = Flask(__name__)
CORS(app) 
chroma_client = chromadb.PersistentClient(path="./chromadb_client2")
collection = chroma_client.get_collection(name="best_movies_database")

@app.route('/run-groq', methods=['POST'])
def run_groq():
    try:
        data = request.get_json()
        print("Received data:", data)

        role_content_obj_list = data.get("messages", [])
        #print("Parsed messages:", role_content_obj_list)

        chat_completion = client.chat.completions.create(
            messages=role_content_obj_list,
            model="llama-3.3-70b-versatile",
            max_tokens=500,
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
