#coding:utf-8 
#user 
from main.utils import get_page
from data.utils import getFollowingsWeibo, getNewWeibos, getUserWeibo, postWeibo
from flask import Blueprint #, render_template, redirect 
from flask import request, json, jsonify, Response
# from app import app

from main.auths import *
from datetime import datetime

weibo = Blueprint('weibo',__name__) 


# 发微博
@weibo.route('', methods=['GET','POST'])
def getWeibo():
    if request.method=='POST':
        # 获取微博内容
        data = json.loads(request.get_data())
        contents = data['content']
        # 获取当前用户？
        identity = identify(request)
        if identity['state']:
            userID = identity['msg']
        else:
            return Response(status=401)
        # TODO
        # 发微博
        result = postWeibo(userID,contents)
        if result['state']:
            return Response(status=200)
        else:
            return Response(status=404)

    if request.method=='GET':
        # 获取查询ID
        data = request.args
        querystr = data['userId']
        page = get_page(data)

        # 获取该用户的所有微博
        result = getUserWeibo(querystr, page)
        if result['state']:
            ans, count = result['result']
            print(ans)
            return Response(json.dumps({'results': ans, 'totalCount': count }), status=200, content_type='application/json')
        else:
            return Response(status=404)


# 刷微博
@weibo.route('/followings', methods=['GET'])
def getAllFollowingsWeibo():
    # 获取当前用户？
    identity = identify(request)
    if identity['state']:
        userID = identity['msg']
    else:
        return Response(status=401)
    # TODO
    # 找所有已关注人的微博
    result = getFollowingsWeibo(userID)

    if result['state']:
        return Response(json.dumps({'results': result['results']}), status=200, content_type='application/json')
    else:
        return Response(status=404)

# 获得系统中最新的10条微博
@weibo.route("/new", methods=['GET'])
def getNewWeibos_api():
    page = get_page(request.args)
    result = getNewWeibos(page)

    if result['state']:
        r = result['result']
        return Response(json.dumps({'results': r}), status=200, content_type='application/json')
    else:
        return Response(status=500)


