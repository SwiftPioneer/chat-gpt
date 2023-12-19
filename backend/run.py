from flask import Flask, request, jsonify, g
from datetime import datetime
from flask_cors import CORS
from openai import OpenAI
import random

from db_setup.mysql.database_handler import db_add_chat_log, db_get_all_content_for_chat, db_create_new_chat, db_get_chat_list, db_remove_chat


TITLE_LEN = 15
MODEL_GPT_4 = "gpt-4"
MODEL_GPT_3_5 = "gpt-3.5-turbo"


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in the app

app.config.from_pyfile('config.py')

client = OpenAI(
    # This is the default and can be omitted
    api_key= app.config.get('API_KEY'),
)

def get_completion(prompt):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=MODEL_GPT_3_5,
    )

    return chat_completion.choices[0].message.content


    # messages = [{"role": "user", "content": prompt}]
    # response = client.chat.completions.create(
    #     model=model,
    #     messages=messages,
    #     temperature=0,
    # )
    # return response.choices[0].message["content"]


app.config['current_chat_id'] = 0
@app.route('/', methods = ['GET', 'POST'])
def hello():
    return 'Hello! Welcome to the backend server of Tax Genii.'



@app.route("/api/get-response-message", methods=['POST']) 
def ask_a_question():
    if request.method == 'POST': 
        newChatCreated = False
        username = request.json['username']
        prompt = request.json['prompt']
        response = get_completion(prompt)

        # Get current time
        current_time = datetime.now()
        formatted_time = current_time.strftime("%Y-%m-%d")

        title = prompt[:TITLE_LEN + int(random.random()) % 3]
        if len(prompt) > TITLE_LEN:
            title += '...'

        current_chat_id = app.config['current_chat_id']
        if current_chat_id == 0:
            current_chat_id = db_create_new_chat(username, formatted_time, title)
            newChatCreated = True

        app.config['current_chat_id'] = current_chat_id



        # Adding new Chat log to Database
        newLog = {}
        newLog["id"] = current_chat_id
        newLog["user"] = username
        newLog["datetime"] = formatted_time
        newLog["question"] = prompt
        newLog["answer"] = response
        newLog["header"] = 0
        newLog["title"] = ''

        db_add_chat_log(newLog)

        responseVal = {}
        responseVal['message'] = response

        if newChatCreated:
            responseVal['newChatId'] = current_chat_id
            responseVal['title'] = title

        return jsonify(responseVal) 
    


@app.route("/api/get-chat-content", methods=['POST']) 
def get_all_chat():

    
    if request.method == 'POST': 
        username = request.json['username']
        chat_id = request.json['chat_id']
        response = db_get_all_content_for_chat(username, chat_id)

        app.config['current_chat_id'] = chat_id

        return jsonify({'message': response}) 



@app.route("/api/get-chat-list", methods=['POST']) 
def get_chat_list():
    if request.method == 'POST': 
        username = request.json['username']
        response = db_get_chat_list(username)
        print(response)
        return jsonify({'message': response, 'active_id': app.config['current_chat_id']}) 



@app.route("/api/create-new-chat", methods=['POST']) 
def create_new_chat():
    if request.method == 'POST': 
        app.config['current_chat_id'] = 0
        response = 'success'
        return jsonify({'message': response}) 
    


@app.route("/api/delete-chat", methods=['POST']) 
def delete_chat():
    if request.method == 'POST': 
        username = request.json['username']
        chat_id = request.json['chat_id']
        response = db_remove_chat(username, chat_id)

        app.config['current_chat_id'] = 0
        return jsonify({'message': response}) 


if __name__ == '__main__':
    app.run(debug=False)
