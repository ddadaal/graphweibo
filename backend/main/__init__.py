from flask import render_template
from flask import request, abort, json, jsonify, Response
# from flask_cors import *
from app import app
from pprint import pprint
import pathlib
import traceback
import jwt
from datetime import datetime, timedelta

app.config['JSON_AS_ASCII'] = False
screct_key = "secret"

def get_token(username):
    payload = {
        "user_id": username,
        'exp': datetime.utcnow() + timedelta(seconds=600)
    }
    return jwt.encode(payload, key=screct_key, algorithm='HS256')

def validate_token(token):
    try:
        data = jwt.decode(token, key=screct_key, algorithms='HS256')
        print(data)
        return data
    except:
        print("jwt验证失败!")

@app.route('/user', methods=['POST'])
def register():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']
    # TOTO 
    # 注册成功返回True，用户已存在返回False
    # state = register(username,password)
    state = True
    if(state == True): 
        payload = {
            "user_id": username,
            'exp': datetime.utcnow() + timedelta(seconds=600)
        }
        screct_key = "secret"
        token = jwt.encode(payload, key=screct_key, algorithm='HS256')
        token = get_token(username)
        return Response(json.dumps({'usrID': username, 'token': str(token)}), status=200, content_type='application/json')
        # return jsonify({'usrID': username, 'token': str(token)})
    else:
        return Response(status=405)

@app.route('/user/token', methods=['GET'])
def login():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']
    # TOTO 
    # 登陆成功返回True，否则返回False
    # state = login(username,password)
    state = True
    if(state == True): 
        token = get_token(username)
        return Response(json.dumps({'usrID': username, 'token': str(token)}), status=200, content_type='application/json')
        # return jsonify({'usrID': username, 'token': str(token)})
    else:
        return Response(status=401)







