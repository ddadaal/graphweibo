import jwt
from datetime import datetime, timedelta

screct_key = "secret"

def encodeToken(userID):
    """
    生成认证Token
    :param user_id: int
    :return: string
    """
    try:
        payload = {
            'user_id': userID,
            'exp': datetime.utcnow() + timedelta(seconds=600)
        }
        return jwt.encode(payload, key=screct_key, algorithm='HS256')
    except Exception as e:
        return e

def decodeToken(token):
    """
    验证Token
    :param token:
    :return: integer|string
    """
    try:
        # 此处取消了过期时间验证
        payload = jwt.decode(token, screct_key, algorithm='HS256', options={'verify_exp': False})
        if 'user_id' in payload:
            return payload
        else:
            raise jwt.InvalidTokenError
    except jwt.ExpiredSignatureError:
        return 'Token过期'
    except jwt.InvalidTokenError:
        return '无效Token'


def identify(request):
    """
    用户鉴权
    :return: list
    """
    auth_header = request.headers.get('Authorization')
    if (auth_header):
        auth_tokenArr = auth_header.split(" ")
        if (not auth_tokenArr or auth_tokenArr[0] != 'JWT' or len(auth_tokenArr) != 2):
            result = {'state': False, 'msg': '请传递正确的验证头信息' }
        else:
            auth_token = auth_tokenArr[1]
            payload = decodeToken(auth_token)
            userID = payload['user_id']
            result = {'state': True, 'msg': userID}
    else:
        result = {'state': False , 'msg': '没有提供认证token' }
    return result