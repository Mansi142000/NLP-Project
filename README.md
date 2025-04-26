# Cinebot: A Knowledge-Augmented Chatbot for Movie Recommendations
# Authors:
- Rohan Rajendra Dalvi (dalvi.ro@northeastern.edu)
- Mansi Negi (negi.ma@northeastern.edu)
# Drive links
- Prject dependancies OneDrive Link - (https://northeastern-my.sharepoint.com/:f:/g/personal/negi_ma_northeastern_edu/EnFd3IBD9ORPs0UpGEXt-q0BSHAZM_zfCfSqAyaZnkeS7Q?e=Obcv10)
- LLM Finetuning GoogleColab Notebookline - (https://drive.google.com/drive/folders/12bLtqtR8QpQI_FP5eic55-sByMcJ8RiP?usp=drive_link)


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

# Setup Instructions
Follow the steps below to set up the project on your local machine.

## Unzip the Project Folder
Unzip the project directory to your desired location.

## Initialize the Node.js Project
Navigate to the project folder in your terminal and run the following command to initialize the Node.js project:

``` npm init ```

## Install Python Dependencies
Navigate to the ./backend directory and install the required Python packages from the  ```requirements.txt``` file:
 
``` pip install -r ./backend/requirements.txt ```

## Download FAISS Embeddings Folders
Download the following FAISS embeddings folders from the provided drive link:

```
faiss_embeddings1
faiss_embeddings2
faiss_embeddings3
faiss_embeddings4
faiss_embeddings5
```

Add these folders directly to the root directory of your project, maintaining the folder structure.

## Download chromadb_client Folder
Download the chromadb_client folder and place it directly in the root directory.

## Download and Run Ollama
Download the Ollama model and ensure it's properly installed and working on your system. To install and start Ollama, use the following commands:

### Install Ollama (if not installed):
Follow the instructions on the Ollama website or run the following command to install:
``` pip install ollama ```

### Run Ollama to check if it's working:
After installation, verify Ollama is working by running:


``` ollama run --model gemma2:2b ```

This should start Ollama and load the gemma2:2b model. Make sure it runs without errors before proceeding.

## Install Gemma2 with 2 Billion Parameters
Download and install the Gemma2 model with 2 billion parameters (1.7 GB). After installation, ensure it is accessible on your system as gemma2:2b.

## Download gemma2-json-tuned Folder
Download the gemma2-json-tuned folder and place it in the root directory. The folder should contain:

- Modelfile
- gemma-2b-finetuned.gguf

Use these files to load your Ollama as gemma-json.

## Load Gemma2 model with Ollama:
Use the following Ollama command to load the fine-tuned Gemma2 model:

```
ollama run --model gemma-json --file ./gemma2-json-tuned/gemma-2b-finetuned.gguf 
```
## Update .env File
Update the ```.env``` file’s Python path to reflect the correct path for your system's python.exe. Also, note that the Groq API key is included in the .env file, which will be uploaded to Canvas.

### Run the Client and Server
After completing the setup, run the following commands to start the client and server:


```
npm run client
npm run server
```
## Test Suite and Training/Unit Testing
In the ```python-scripts``` folder, you will find two main test suites and the training/unit testing files. Follow the instructions provided within those files to run them and verify the setup:

### Make sure to download these folders from the drive before running the test suits. 
- LLM_training_data
- Vector_test_data

