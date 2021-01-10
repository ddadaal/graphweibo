from flask import render_template
from flask import request, abort, json, jsonify, Response
# from flask_cors import *
from app import app
from pprint import pprint
import pathlib
import traceback
from app.auths import *
from app.users.model import User

app.config['JSON_AS_ASCII'] = False

# 用户注册
@app.route('/user', methods=['POST'])
def register():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']
 
    registrant = User(username, hash(password))

    # TODO 
    # 注册成功返回True，用户已存在返回False
    # 找到一个现有数据中没有的ID号并返回
    # state,userID = register(registrant)

    state = True
    userID = '12345678'

    if(state): 
        token = encodeToken(userID)
        return Response(json.dumps({'usrID': userID, 'token': str(token)}), status=200, content_type='application/json')
        # return jsonify({'usrID': userID, 'token': str(token)})
    else:
        return Response(status=405)

# 用户登录
@app.route('/user/token', methods=['GET'])
def login():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']

    # TODO 
    # 登陆成功返回True和user，否则返回False
    # state,user = login(username,password)
    # userID = User.getID(user)  

    state = True
    userID = '12345678'
    
    if(state): 
        token = encodeToken(userID)
        return Response(json.dumps({'usrID': userID, 'token': str(token)}), status=200, content_type='application/json')
    else:
        return Response(status=401)

# 获取用户信息
@app.route('/dashboard/accountProfile', methods=['GET'])
def getAccountProfile():
    auth_header = request.headers.get('Authorization')
    if (auth_header):
        auth_tokenArr = auth_header.split(" ")
        if (not auth_tokenArr or auth_tokenArr[0] != 'JWT' or len(auth_tokenArr) != 2):
            return Response(status=405)
        else:
            auth_token = auth_tokenArr[1]
            payload = decodeToken(auth_token)
            userID = payload['user_id']

            # TODO
            # 通过用户ID获取用户的所有信息，返回User类型的对象
            # state, user = getprofile(userID)

            data = {
                'userID': user.user_id,
                'username': user.username,
                'registerTime': user.registerTime,
                'weiboCount': user.statusesnum,
                'followingsCount': user.followingsnum,
                'followersCount': user.followersnum
            }

            if state:
                return Response(json.dumps(data), status=200, content_type='application/json')
            else:
                return Response(status=405)
    
    else:
        return Response(status=405)






