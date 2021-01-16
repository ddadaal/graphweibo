#coding:utf-8 
#user 
from data.utils import getProfile
from flask import Blueprint #, render_template, redirect 
from flask import request, json, jsonify, Response
# from app import app

from main.auths import identify
from datetime import datetime

profile = Blueprint('profile',__name__) 

# 获取用户信息
@profile.route('/', methods=['GET'])
def getAccountProfile():
    data = request.args

    if (not 'userId' in data.keys()) or (not data['userId']):
        return Response(status=400)
    
    # TODO
    # 通过用户ID获取用户的所有信息，返回用户数据
    result = getProfile(data['userId'])

    if result:
        return Response(json.dumps({
            'profile': result
        }), status=200, content_type='application/json')
    else:
        return Response(status=404)
