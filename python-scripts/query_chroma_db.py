import sys
import json
import chromadb

chroma_client = chromadb.PersistentClient(path="./../chromadb_client")
collection = chroma_client.get_collection(name="best_movies_database")

def query_chroma_and_return_results(query_text, filter_criteria=None, result_size=1):
    try:
        if filter_criteria:
            results = collection.query(
                query_texts=[query_text],
                n_results=result_size,  # Get only the closest result
                where=json.loads(filter_criteria)
            )
        else:
            results = collection.query(
                query_texts=[query_text],
                n_results=result_size,  # Get only the closest result
            )
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python query_chroma_db.py 'query' 'filter_criteria(optional)' 'result_size(optional)'")
        sys.exit(1)

    query_text = sys.argv[1]
    filter_criteria = sys.argv[2] if len(sys.argv) > 2 else None
    result_size = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    results = query_chroma_and_return_results(query_text, filter_criteria, result_size)
    if results:
        print(json.dumps(results))

if __name__ == "__main__":
    main()
