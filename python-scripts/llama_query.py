from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv('API_KEY')
client = Groq(api_key=API_KEY)

def prompt_with_role_content_obj_list(role_content_obj_list){
    chat_completion = client.chat.completions.create(
        messages=role_content_obj_list,
        model="llama-3.3-70b-versatile",
        max_completion_tokens=500,
    )
    response = chat_completion.choices[0].message.content
    return response
}


