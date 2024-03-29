from main import weibo
from typing import List, Optional, Tuple
import data.GstoreConnector as GstoreConnector
import os
import sys
import random
import json
import datetime
import functools

IP = "127.0.0.1"
Port = 9000
username = "root"
password = "123456"

database_name = "weibo5"

dump_file_path = "file:///home/fxb/d2rq/graph_dump3.nt"

prefix = f"""
            prefix vocab:   <file:///home/fxb/d2rq/vocab/>
            prefix user:      <{dump_file_path}#user/>
            prefix weibo:     <{dump_file_path}#weibo/>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            """

page_size = 10

gc = GstoreConnector.GstoreConnector(IP, Port, username, password)

def query(sparql: str):
    # print(sparql)
    resp = gc.query(database_name, "json", sparql)
    # print("Response: %s" % resp)
    return json.loads(resp)

def ask_query(sparql: str) -> bool:
    resp = query(sparql)
    return resp["results"]["bindings"][0]["askResult"]["value"]

def check_uid_existence(uid: str) -> bool:
    return ask_query(prefix + f"""
      ask where {{ 
        ?x vocab:user_uid '{uid}' .
      }}
    """)

user_id_length = 10
weibo_id_length = 16


def random_id(length: int) -> str:
  return ''.join(str(random.choice(range(10))) for _ in range(length))

def register(uname, pwd, register_time: datetime.datetime):

    # 判断uname是否存在
    if ask_query(prefix + f"ask where {{ ?uid vocab:user_name '{uname}' }}"):
        return { 'state': False }

    uid = random_id(user_id_length)

    # insert 语句必须写成这种，user:%s不能出现多次，注意前面的最后是;不是.
    # 注意整数类型字面量需要写成"0"^^xsd:integer
    sparql = prefix + f"""
        insert data {{
            user:{uid} vocab:user_pwd "{pwd}".
            user:{uid} vocab:user_uid "{uid}" .
            user:{uid} vocab:user_name "{uname}" .
            user:{uid} vocab:user_created_at "{register_time.replace(microsecond=0).isoformat()}"^^xsd:dateTime .
            user:{uid} vocab:user_statusesnum "0"^^xsd:integer .
            user:{uid} vocab:user_followersnum "0"^^xsd:integer .
            user:{uid} vocab:user_friendsnum "0"^^xsd:integer .
        }}"""


    print(sparql)
    resp = query(sparql)
    print(resp)
    resp = gc.checkpoint(database_name)
    print(resp)
    
    return {
        "state": True,
        "userId": uid,
    }

def login(uname, pwd):
    sparql = prefix + f"""
        select ?uid where{{
            ?x vocab:user_pwd '{pwd}'.
            ?x vocab:user_uid ?uid.
            ?x vocab:user_name '{uname}'.
        }}"""
    resp = query(sparql)["results"]["bindings"]

    ans = {}
    if len(resp)==0:
        ans["state"] = False
        ans["uid"] = ""
    else:
        ans["state"] = True
        ans["uid"] = resp[0]["uid"]["value"]
    
    return ans
    

# TODO If user not exists, return None
def getProfile(uid):

    sparql = prefix + f"""
        select ?username ?registerTime ?weiboCount ?followersCount ?followingsCount where {{
            ?x vocab:user_uid '{uid}' .
            ?x vocab:user_name ?username .
            ?x vocab:user_created_at ?registerTime .
            ?x vocab:user_statusesnum ?weiboCount .
            ?x vocab:user_followersnum ?followersCount .
            ?x vocab:user_friendsnum ?followingsCount .
        }}
    """


    def get_value(resp, key: str):
        return resp["results"]["bindings"][0][key]["value"]

    resp = query(sparql)
    ans = { 
        "userId": uid,
        "username": get_value(resp, "username"),
        # "registerTime": get_value(resp, "registerTime"),
        "weiboCount": int(get_value(resp, "weiboCount")),
        "followersCount": int(get_value(resp, "followersCount")),
        "followingsCount": int(get_value(resp, "followingsCount")),
    }
    return ans

@functools.lru_cache(maxsize=None)
def _get_username(uid: str) -> str:
    return getProfile(uid)['username']

def follow(uid1, uid2):
    # Cannot follow oneself
    if uid1 == uid2:
        return {
            'state': False,
            'msg': "Circular"
        }

    # query uid2 exist or not

    if not check_uid_existence(uid2):
        return {
            'state': False,
            "msg": 'uid2 inexist',
        }

    if isFollow(uid1, uid2):
        return {
            'state': False,
            "msg": 'AlreadyFollowed',
        }

    # insert rdf 
    sparql = prefix + f"""
        insert data {{
            <{dump_file_path}#userrelation/{uid1}/{uid2}> vocab:userrelation_tuid '{uid2}';
                                                          vocab:userrelation_suid '{uid1}'.
        }}
    """
    resp = query(sparql)
    resp = gc.checkpoint(database_name)

    # update profile

    # get current numbers
    followingsnum1 = getProfile(uid1)["followingsCount"]
    followersnum2 = getProfile(uid2)["followersCount"]

    # DELETE INSERT WHERE in one query doesn't work
    # separate
    sparql = prefix + f"""
        DELETE {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2}"^^xsd:integer .
        }}
        INSERT {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1 + 1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2 + 1}"^^xsd:integer .
        }}
        WHERE {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2}"^^xsd:integer .
        }}
    """ 
    resp = query(sparql)
    resp = gc.checkpoint(database_name)

    return {
        'state': True,
        'msg': "success"
    }

def unfollow(uid1, uid2):
    # Circular
    if uid1 == uid2:
        return {
            'state': False,
            'msg': "Circular"
        }

    # delete rdf 
    
    sparql = prefix + f"""
        DELETE DATA {{
            <{dump_file_path}#userrelation/{uid1}/{uid2}> vocab:userrelation_tuid '{uid2}';
                                                          vocab:userrelation_suid '{uid1}'.
        }}
    """
    resp = query(sparql)
    resp = gc.checkpoint(database_name)

    
    # update profile
    followingsnum1 = getProfile(uid1)["followingsCount"]
    followersnum2 = getProfile(uid2)["followersCount"]

    sparql = prefix + f"""
        DELETE {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2}"^^xsd:integer .
        }}
        INSERT {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1 - 1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2 - 1}"^^xsd:integer .
        }}
        WHERE {{
            user:{uid1} vocab:user_friendsnum "{followingsnum1}"^^xsd:integer .
            user:{uid2} vocab:user_followersnum "{followersnum2}"^^xsd:integer .
        }}
    """ 
    resp = query(sparql)
    resp = gc.checkpoint(database_name)
    
    return {
        'state': True,
        'msg': "success"
    }

def isFollow(uid1, uid2):
    # return true if uid1 follow uid2
    sparql_q_follow = prefix+ f"""
      ask where {{
                ?x vocab:userrelation_suid '{uid1}' .
                ?x vocab:userrelation_tuid '{uid2}' .
            }}
    """
    return ask_query(sparql_q_follow)


def getFollowers(uid, myid, page):

    resp, count = paginated_query(
        [
            f"?x vocab:userrelation_tuid '{uid}'",
            "?x vocab:userrelation_suid ?sid",     
        ],
        "?sid",
        "?sid",
        "?sid",
        page
    )

    ans = []
    for data in resp:
        elem = {}
        # get the first id
        uid = data['sid']['value']
        elem["userId"] = uid
        tmp = getProfile(uid)
        elem["username"] = tmp["username"]
        elem["weiboCount"] = tmp["weiboCount"]
        elem["followersCount"] = tmp["followersCount"]
        elem["followingsCount"] = tmp["followingsCount"]
        elem["following"] = myid and isFollow(myid, uid)
        elem["followed"] = myid and isFollow(uid, myid)
        ans.append(elem)
    
    return {
        'state': True,
        'result': (ans, count),
    }

def _get_following_user_ids(uid):
    sparql = prefix+f" select ?x where{{ ?x vocab:userrelation_suid '{uid}'.}}"
    resp = query(sparql)
    return [data['x']['value'][-user_id_length:] for data in resp['results']['bindings']]


def getFollowings(uid, myid, page):
    resp, count = paginated_query(
        ["?x vocab:userrelation_suid '%s'" % uid],
        "?x",
        "?x",
        "?x",
        page
    )

    ans = []
    for data in resp:
        elem = {}
        uid = data['x']['value'][-user_id_length:]
        elem["userId"] = uid
        tmp = getProfile(uid)
        elem["username"] = tmp["username"]
        elem["weiboCount"] = tmp["weiboCount"]
        elem["followersCount"] = tmp["followersCount"]
        elem["followingsCount"] = tmp["followingsCount"]
        elem["following"] = myid and isFollow(myid, uid)
        elem["followed"] = myid and isFollow(uid, myid)
        ans.append(elem)
    
    return {
        'state': True,
        'result': (ans, count),
    }


def paginated_query(clauses: List[str], select: str, count_select: str, orderby: str, page: int, query_count = True) -> Tuple[List, int]:

    clause = ".\n".join(clauses)
    count = 0

    # 1. query the count
    if query_count:
        sparql = prefix + " select (count(%s) as ?c) where {\
            %s\
        }" % (count_select, clause)

        # if the request is too frequent, the query function returns ""
        resp = query(sparql)
        bindings = resp["results"]["bindings"]
        if len(bindings) == 0:
            return [], 0
        count = int(bindings[0]["c"]["value"])
    
    # 2. get the paginated result
    sparql = prefix + " select %s where {\
        %s\
        }\
        ORDER BY %s\
        LIMIT %d \
        OFFSET %d \
        " % (select, clause, orderby, page_size, (page - 1) * page_size)
    
    resp = query(sparql)

    return resp["results"]["bindings"], count

def searchUserById(uid, myid):

    d = getProfile(uid)
    if not d:
        return None
    d["followed"] = isFollow(uid, myid)
    d["following"] = isFollow(myid, uid)
    return d

def searchUserByQuery(q, uid, page):
    clause = [
        "?x vocab:user_name ?username",
        "?x vocab:user_uid ?uid",
        "FILTER regex(?username, '.*%s.*')" % q,
    ]
    resp, count = paginated_query(clause, "?uid", "?uid", "?uid", page)

    # NOTE 没有搜索到结果，在这个需求里不是错误，是预期情况，搜索本来就可以没有搜索结果，所以直接返回一个空数组就可以了。
    # 有的API（比如关注用户）默认传入的ID是有效的，只有这种默认存在、但是实际上不存在的意外情况才应该报错
    if count == 0:
        return {
            'results': [],
            'totalCount': 0
        }

    candidate_user = [None if "uid" not in data.keys() else data["uid"]["value"] for data in resp]
    
    user_list = []
    for id in candidate_user:
        if id == None: 
            continue
        d = {}
        d["userId"] = id
        sparql = prefix + f""" select ?username ?weiboCount ?followersCount ?followingsCount where{{
                ?x vocab:user_name ?username.
                ?x vocab:user_uid '{id}' .
                ?x vocab:user_statusesnum ?weiboCount.
                ?x vocab:user_followersnum ?followersCount.
                ?x vocab:user_friendsnum ?followingsCount.
                }}"""
        
        resp = query(sparql)["results"]["bindings"][0]
        d["username"] = resp["username"]["value"]
        d["weiboCount"] = resp["weiboCount"]["value"]
        d["followersCount"] = resp["followersCount"]["value"]
        d["followingsCount"] = resp["followingsCount"]["value"]
        d["followed"] = uid and isFollow(d["userId"], uid)
        d["following"] = uid and isFollow(uid, d["userId"])
        user_list.append(d)
    return {
        'totalCount': count,
        'results': user_list,
    }


def postWeibo(uid, content):
    # generate 16bit mid for weibotext
    mid = random_id(weibo_id_length)
    isotime = datetime.datetime.now().replace(microsecond=0).isoformat()

    # insert the weibo
    sparql = prefix + f"""
            insert data {{
                weibo:{mid} vocab:weibo_date '{isotime}';
                            vocab:weibo_text '{content}';
                            vocab:weibo_source '';
                            vocab:weibo_repostsnum '0'^^xsd:integer;
                            vocab:weibo_commentsnum '0'^^xsd:integer;
                            vocab:weibo_attitudesnum '0'^^xsd:integer;
                            vocab:weibo_uid '{uid}'.
            }}"""
    
    resp = query(sparql)

    # update the profile
    weibonum = getProfile(uid)["weiboCount"]

    sparql = prefix + f"""
        DELETE {{
            user:{uid} vocab:user_statusesnum "{weibonum}"^^xsd:integer .
        }}
        INSERT {{
            user:{uid} vocab:user_statusesnum "{weibonum + 1}"^^xsd:integer .
        }}
        WHERE {{
            user:{uid} vocab:user_statusesnum "{weibonum}"^^xsd:integer .
        }}
    """ 
    resp = query(sparql)
    resp = gc.checkpoint(database_name)
    
    return {
        'state': True,
        'msg': "success"
    }

def getUserWeibo(uid, page):

    # TODO check user existence
    if not check_uid_existence(uid):
        return { 'state': False, 'results': [] }

    clauses =[
        f"?wbid vocab:weibo_uid '{uid}'",
        "?wbid vocab:weibo_date ?sendTime",
        "?wbid vocab:weibo_text ?content",
    ]
       
    resp, count = paginated_query(
        clauses,
        "?wbid ?sendTime ?content",
        "?wbid",
        "DESC(?sendTime)",
        page,
    )

    ans = []
    for data in resp:
        ans_elem = {}
        ans_elem["weiboId"] = data["wbid"]["value"][-weibo_id_length:]
        ans_elem["senderId"] = uid
        ans_elem["sendTime"] = data["sendTime"]["value"]
        ans_elem["content"] = data["content"]["value"]
        ans_elem["senderUsername"] = _get_username(uid)
        ans.append(ans_elem)

    return {
        'state': True,
        'result': (ans, count),
    }

def getFollowingsWeibo(uid, page):

    if not check_uid_existence(uid):
      return { 'state': False, 'results': [] }

    # Two queries. maybe able to merge into one query
    following_list = _get_following_user_ids(uid)
    # append the user itself into the list
    following_list.append(uid)

    resp, count = paginated_query(
        [
            "?wbid vocab:weibo_uid ?uid",
            "?wbid vocab:weibo_date ?sendTime",
            "?wbid vocab:weibo_text ?content",
            f"""FILTER (?uid in ({', '.join((f"'{i}'" for i in following_list))})"""
        ],
        "?wbid ?sendTime ?content ?uid",
        "?wbid",
        "DESC(?sendTime)",
        page,
        query_count=False
    )

    ans = []
    for data in resp:
        ans_elem = {}
        ans_elem["weiboId"] = data["wbid"]["value"][-weibo_id_length:]
        sender_id = data["uid"]["value"]
        ans_elem["senderId"] = sender_id
        ans_elem["sendTime"] = data["sendTime"]["value"]
        ans_elem["content"] = data["content"]["value"]
        ans_elem["senderUsername"] = _get_username(sender_id)
        ans.append(ans_elem)
        # print(ans)

    return {
        'state': True,
        'results': ans,
    }

    
def getNewWeibos(page):

    clauses =[
        "?wbid vocab:weibo_uid ?senderId",
        "?wbid vocab:weibo_date ?sendTime",
        "?wbid vocab:weibo_text ?content",
    ]
       
    resp, _ = paginated_query(
        clauses,
        "?wbid ?sendTime ?senderId ?content",
        "?wbid",
        "DESC(?sendTime)",
        page,
        query_count=False,
    )

    ans = []
    for data in resp:
        ans_elem = {}
        ans_elem["weiboId"] = data["wbid"]["value"][-weibo_id_length:]
        ans_elem["senderId"] = data["senderId"]["value"]
        ans_elem["sendTime"] = data["sendTime"]["value"]
        ans_elem["content"] = data["content"]["value"]
        ans_elem["senderUsername"] = _get_username(ans_elem["senderId"])
        ans.append(ans_elem)

    return {
        'state': True,
        'result': ans,
    }

def query_paths(uid1: str, uid2: str, depth: int) -> List[List[str]]:
    results = []

    if depth == 1:
        q = prefix + f"""
        ask where {{
            ?x vocab:userrelation_suid '{uid1}' .
            ?x vocab:userrelation_tuid '{uid2}' .
        }}
        """

        direct_connect = ask_query(q)
        if direct_connect:
            results.append([uid1, uid2])
        return results
    
    q = prefix + f"""
    select * where {{
        {os.linesep.join((f'''
            ?r{i} vocab:userrelation_suid ?mid_{i} .
            ?r{i} vocab:userrelation_tuid ?mid_{i+1} .
            ''' for i in range(depth)))
            .replace("?mid_0", f"'{uid1}'")
            .replace(f"?mid_{depth}", f"'{uid2}'")
        }
    }}
    """

    resp = query(q)

    for binding in resp["results"]["bindings"]:
        # each binding is a path
        result = depth * [None]

        for key, value in binding.items():
            splitted = key.split("_")
            if len(splitted) == 2:
                index = int(splitted[-1])
                if splitted[0] == "mid":
                    result[index] = value["value"]

        result[0] = uid1       
        result.append(uid2)
        results.append(result)


    return results

connection_depth_limit = 4



def getUserConnection(uid1, uid2):
    uid1_existence, uid2_existence = check_uid_existence(uid1), check_uid_existence(uid2)

    if not (uid1_existence and uid2_existence):
        return { 
            'state': False, 
            'msg': { 
                'fromUserNotExists': not uid1_existence,
                'toUserNotExists': not uid2_existence,
            }}
    
    usernames = { k: _get_username(k) for k in (uid1, uid2) }

    paths = []
    for d in range(1, connection_depth_limit + 1):
        paths += query_paths(uid1, uid2, d)
        for path in paths:
            for id in path:
                usernames[id] = _get_username(id)

    return {
        'state': True,
        'msg': {
            'usernames': usernames,
            'paths': paths
        }
    }

    
    

if __name__ == "__main__":
    # getProfile("2452144190")
    # follow('1000080335','1940992571')
    # getFollowers("1000080335")
    # getFollowings('1000080335')
    # postWeibo("2452144190","this is a test")
    # getUserWeibo('2452144190')
    # searchUserByQuery("Mini", "2452144190")
    # register("q3erf", "145115")
    # login("q3erf", "145115")
    pass
