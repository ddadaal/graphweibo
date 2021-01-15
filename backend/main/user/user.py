#coding:utf-8 
#user 
from data.utils import follow, login, register, unfollow
from flask import Blueprint #, render_template, redirect 
from flask import request, json, jsonify, Response
from main.auths import *
from datetime import datetime

user = Blueprint('user',__name__) 

# 用户注册
@user.route('', methods=['POST'])
def register_api():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']

    # TODO 
    # 注册函数：完成用户注册，返回用户ID
    result = register(username,hash(password),str(datetime.utcnow().isoformat()))

    if(result['state']): 
        token = encodeToken(result['userID'])
        return Response(json.dumps({'usrID': result['userID'], 'token': str(token)}), status=201, content_type='application/json')
        # return jsonify({'usrID': userID, 'token': str(token)})
    else:
        return Response(status=405)

# 用户登录
@user.route('/token', methods=['GET'])
def login_api():
    data = json.loads(request.get_data())
    username = data['username']
    password = data['password']

    # TODO 
    # 用户登录函数：检验用户身份
    result = login(username,hash(password))
    
    if(result['state']): 
        token = encodeToken(result['userID'])
        return Response(json.dumps({'usrID': result['userID'], 'token': str(token)}), status=200, content_type='application/json')
    else:
        return Response(status=401)

# 关注/取关用户
@user.route('/follow', methods=['POST','DELETE'])
def change_follow_api():
    # 获取对象
    data = json.loads(request.get_data())
    targetID = data['userID']
    # 获取当前用户？
    identity = identify(request)
    if identity['state']:
        userID = identity['msg']
    else:
        return Response(status=401)

    # 关注
    if request.method=='POST':
        # TODO
        # 关注另一位用户，若成功返回state=True，否则在msg中写明用户不存在'Inexist'，或者已关注'AlreadyFollow'
        result = follow(userID,targetID)
        if result['state']:
            return Response(status=200)
        elif result['msg']=='Inexist':
            return Response(status=404)
        else:
            return Response(status=405)

    # 取关
    elif request.method=='DELETE':
        # TODO
        # 取关另一位用户，若成功返回state=True，否则在msg中写明用户不存在'Inexist'，或者未关注'AlreadyUnfollow'
        result = unfollow(userID,targetID)
        if result['state']:
            return Response(status=200)
        elif result['msg']=='Inexist':
            return Response(status=404)
        else:
            return Response(status=405)

# 获取粉丝
@user.route('/followers', methods=['GET'])
def get_followers_api():
    data = json.loads(request.get_data())
    userID = data['userID']

    # TODO
    # 获取当前用户所有粉丝
    result = getFollowers(userID)

    if result['state']:
        result.pop('state')
        return Response(json.dumps(result), status=200, content_type='application/json')
    else:
        return Response(status=404)

# 获取关注者
@user.route('/followings', methods=['GET'])
def getFollowings():
    data = json.loads(request.get_data())
    userID = data['userID']

    # TODO
    # 获取当前用户所有关注者
    result = getFollowings(userID)

    if result['state']:
        result.pop('state')
        return Response(json.dumps(result), status=200, content_type='application/json')
    else:
        return Response(status=404)

# 查找用户
@user.route('/search', methods=['GET'])
def search_api():
    #获取当前用户
    identity = identify(request)
    if identity['state']:
        userID = identity['msg']
    else:
        userID = ''
    #获取查询字符串
    data = json.loads(request.get_data())

    if 'userID' in data.keys():
        queryID = data['userID']
        result = searchUserByID(queryID,userID)
    else:
        querystr = data['query']
        result = searchUserByQuery(querystr,userID)

    if result['state']:
        result.pop('state')
        return Response(json.dumps(result), status=200, content_type='application/json')
    else:
        return Response(status=404)


# 查找两用户之间的关系
@user.route('/connection', methods=['GET'])
def connection_api():
    #获取查询用户
    data = json.loads(request.get_data())
    fromUser = data['fromUserId']
    toUser = data['toUserId']

    result = getUserConnection(fromUser,toUser)

    if result['state']:
        result.pop('state')
        return Response(json.dumps(result), status=200, content_type='application/json')
    else:
        result.pop('state')
        return Response(json.dumps(result),status=404)