#coding:utf-8 
#user 
from main.utils import get_page
from data.utils import follow, getFollowers, getFollowings, getUserConnection, login, register, searchUserById, searchUserByQuery, unfollow
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
    result = register(username,password,datetime.utcnow())

    if(result['state']): 
        token = encodeToken(result['userId'])
        return Response(json.dumps({'userId': result['userId'], 'token': token}), status=201, content_type='application/json')
        # return jsonify({'usrID': userID, 'token': str(token)})
    else:
        return Response(status=409)

# 用户登录
@user.route('/token', methods=['GET'])
def login_api():
    # data = json.loads(request.get_data())
    data = request.args
    username = data['username']
    password = data['password']

    # TODO 
    # 用户登录函数：检验用户身份
    result = login(username, password)
    
    if(result['state']): 
        uid = result['uid']
        token = encodeToken(uid)
        return Response(json.dumps({'userId': uid, 'token': token}), status=200, content_type='application/json')
    else:
        return Response(status=401)

# 关注/取关用户
@user.route('/follow', methods=['POST','DELETE'])
def change_follow_api():
    # 获取对象
    data = json.loads(request.get_data())

    targetID = data['userId']
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
        elif result['msg'] == "Circular":
            return Response(status=400)
        else:
            return Response(status=409)

    # 取关
    elif request.method=='DELETE':
        # TODO
        # 取关另一位用户，若成功返回state=True，否则在msg中写明用户不存在'Inexist'，或者未关注'AlreadyUnfollow'
        result = unfollow(userID,targetID)
        if result['state']:
            return Response(status=200)
        elif result['msg'] == "Circular":
            return Response(status=400)
        elif result['msg']=='Inexist':
            return Response(status=404)
        else:
            return Response(status=409)

# 获取粉丝
@user.route('/followers', methods=['GET'])
def get_followers_api():
    # data = json.loads(request.get_data())
    data = request.args

    # NOTE 注意大小写，之前是userID
    userID = data['userId']
    page = get_page(data)

    identity = identify(request)
    myid = identity['msg'] if identity['state'] else None

    # TODO
    # 获取当前用户所有粉丝
    result = getFollowers(userID, myid, page)

    if result['state']:
        result, count = result['result']
        return Response(json.dumps({
            'followers': result,
            'totalCount': count,
        }), status=200, content_type='application/json')
    else:
        return Response(status=404)

# 获取关注者
@user.route('/followings', methods=['GET'])
def getFollowings_api():
    data = request.args
    userID = data['userId']
    page = get_page(data)

    identity = identify(request)
    myid = identity['msg'] if identity['state'] else None

    # TODO
    # 获取当前用户所有关注者
    result = getFollowings(userID, myid, page)

    if result['state']:
        result, count = result['result']
        return Response(json.dumps({
            'followings': result,
            'totalCount': count,
        }), status=200, content_type='application/json')
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
        userID = None
    #获取查询字符串
    # NOTE 下述方法不能获得GET请求的querystring。
    # data = json.loads(request.get_data())
    data = request.args
    page = get_page(data)

    if 'userId' in data.keys():
        queryID = data['userId']
        result = searchUserById(queryID, userID)
        result = {
            'totalCount': 1 if result else 0,
            'results': [result]
        }
    else:
        querystr = data['query']
        result = searchUserByQuery(querystr, userID, page)

    # NOTE 没有搜索到结果，在这个需求里不是错误，是预期情况，搜索本来就可以没有搜索结果，所以直接返回一个空数组就可以了。
    # 有的API（比如关注用户）默认传入的ID是有效的，只有这种默认存在、但是实际上不存在的意外情况才应该报错
    # if result['state']:
    # result.pop('state')
    return Response(json.dumps(result), status=200, content_type='application/json')
    # else:
    #     return Response(status=404)


# 查找两用户之间的关系
@user.route('/connection', methods=['GET'])
def connection_api():
    #获取查询用户
    # data = json.loads(request.get_data())
    data = request.args
    fromUser = data['fromUserId']
    toUser = data['toUserId']

    result = getUserConnection(fromUser, toUser)

    if result['state']:
        return Response(json.dumps(result["msg"]), status=200, content_type='application/json')
    else:
        return Response(json.dumps(result["msg"]),status=404)