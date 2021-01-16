from typing import List, Tuple
import data.GstoreConnector as GstoreConnector
import sys
import random
import json
import datetime

IP = "127.0.0.1"
Port = 9000
username = "root"
password = "123456"

prefix = "prefix vocab:   <file:///home/fxb/d2rq/vocab/> \
            prefix user:      <file:///home/fxb/d2rq/graph_dump.nt#user/> \
            prefix weibo:     <file:///home/fxb/d2rq/graph_dump.nt#weibo/>"

page_size = 10

gc = GstoreConnector.GstoreConnector(IP, Port, username, password)

# res = gc.load("weibo", "POST")

def register(uname, pwd, register_time):

    # NOTE 判断uname是否存在
    uid = ''.join(str(random.choice(range(10))) for _ in range(10))
    ans ={}
    sparql = prefix+" insert DATA{\
            user:%s vocab:user_pwd %s.\
            user:%s vocab:user_created_at %s.\
            user:%s vocab:user_statusesnum 0.\
            user:%s vocab:user_followersnum 0.\
            user:%s vocab:user_friendsnum 0.\
            }"%(uid, pwd, uid, register_time, uid, uid, uid)
    resp = gc.query("weibo", "json", sparql)
    resp = gc.checkpoint("weibo")
    ans["state"] = True
    ans["userId"] = uid
    
    print(ans)
    return ans

def login(uname, pwd):
    sparql = prefix+" select ?uid where{\
            ?uid vocab:user_pwd '%s'.\
            ?uid vocab:user_name '%s'.\
            }"%(pwd, uname)
    resp = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"]
    print(resp)
    ans = {}
    if len(resp)==0:
        ans["state"] = False
        ans["uid"] = ""
    else:
        ans["state"] = True
        ans["uid"] = resp[0]["uid"]
        print(ans)
    
    return ans
    
    

def getProfile(uid):
    ans = {}
    sparql = prefix+" select ?x where{ user:%s vocab:user_name ?x.}"%(uid)
    ans["username"] = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]["x"]["value"]
    
    sparql = prefix+" select ?x where{ user:%s vocab:user_created_at ?x }"%(uid)
    ans["registerTime"] = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]["x"]["value"]
    
    sparql = prefix+" select ?x where{ user:%s vocab:user_statusesnum ?x }"%(uid)
    ans["weiboCount"] = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]["x"]["value"]
    
    sparql = prefix+" select ?x where{ user:%s vocab:user_followersnum ?x }"%(uid)
    ans["followersCount"] = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]["x"]["value"]
    
    sparql = prefix+" select ?x where{ user:%s vocab:user_friendsnum ?x }"%(uid)
    ans["followingsCount"] = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]["x"]["value"]
    
    return ans


def follow(uid1, uid2):
    ans = {}
    # query uid2 exist or not
    sparql_q_uid2 = "select ?x where\
            {<file:///home/fxb/d2rq/graph_dump.nt#user/%s> ?o ?x}"%uid2
    resp = json.loads(gc.query("weibo", "json", sparql_q_uid2))["results"]["bindings"]
    if len(resp)==0:
        ans["state"] = False
        ans["msg"] = 'uid2 inexist'
        print(ans)
        return ans
    # query if uid1 have relation with uid2
    sparql_q_follow = "select ?x where\
            {<file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> <file:///home/fxb/d2rq/vocab/userrelation_tuid> ?x}"%(uid1, uid2)
    resp = json.loads(gc.query("weibo", "json", sparql_q_follow))["results"]["bindings"]
    if len(resp)!=0:
        ans["state"] = False
        ans["msg"] = "AlreadyFollowed"
        print(ans)
        return ans
    # insert rdf 
    sparql_q_insert1 = prefix+" insert DATA{\
            <file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> vocab:userrelation_tuid %s}"%(uid1, uid2,uid2)
    sparql_q_insert2 = prefix+" insert DATA{\
            <file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> vocab:userrelation_suid %s}"%(uid1, uid2,uid1)
    resp = json.loads(gc.query("weibo","json", sparql_q_insert1))
    
    resp = json.loads(gc.query("weibo","json", sparql_q_insert2))

    resp = gc.checkpoint("weibo")
    
    ans["state"] = True
    ans["msg"] = "success"
    return ans

def unfollow(uid1, uid2):
    # delete rdf 
    ans = {}
    
    sparql_q_delete1 = prefix+" delete DATA{\
            <file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> vocab:userrelation_tuid %s}"%(uid1, uid2,uid2)
    sparql_q_delete2 = prefix+"delete DATA{\
            <file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> vocab:userrelation_suid %s}"%(uid1, uid2,uid1)
    resp = json.loads(gc.query("weibo","json", sparql_q_delete1))
    
    resp = json.loads(gc.query("weibo","json", sparql_q_delete2))

    resp = gc.checkpoint("weibo")
    
    ans["state"] = True
    ans["msg"] = "success"
    return ans

def isFollow(uid1, uid2):
    # return true if uid1 follow uid2
    sparql_q_follow = prefix+ "select ?x where\
            {<file:///home/fxb/d2rq/graph_dump.nt#userrelation/%s/%s> vocab:userrelation_tuid ?x}"%(uid1, uid2)
    resp = json.loads(gc.query("weibo", "json", sparql_q_follow))["results"]["bindings"]
    if len(resp)!=0:
        return True
    return False


def getFollowers(uid, page):
    ans = []
    sparql = prefix+" select ?x where{?x vocab:userrelation_suid '%s'.}"%uid
    resp = json.loads(gc.query("weibo", "json", sparql))

    for data in resp['results']['bindings']:
        elem = {}
        elem["uid"] = data['x']['value'][-10:]
        tmp = getProfile(elem["uid"])
        elem["username"] = tmp["username"]
        elem["weiboCount"] = tmp["weiboCount"]
        elem["followersCount"] = tmp["followersCount"]
        elem["followingsCount"] = tmp["followingsCount"]
        if isFollow(uid, elem["uid"]):
            elem["followings"] = True
        else:
            elem["followings"] = False
        ans.append(elem)
        print(elem)
    
    return ans

def getFollowings(uid, page):
    ans = []
    sparql = prefix+" select ?y ?x where{?y vocab:userrelation_tuid ?x.}"
    resp = json.loads(gc.query("weibo", "json", sparql))
    
    for data in resp['results']['bindings']:
        elem = {}
        elem["uid"] = data['y']['value'][-10:]
        tmp = getProfile(elem["uid"])
        elem["username"] = tmp["username"]
        elem["weiboCount"] = tmp["weiboCount"]
        elem["followersCount"] = tmp["followersCount"]
        elem["followingsCount"] = tmp["followingsCount"]
        if isFollow(uid, elem["uid"]):
            elem["followings"] = True
        else:
            elem["followings"] = False
        ans.append(elem)
        print(elem)
    return {
        'state': True,
        'results': ans
    }

# TODO
def getNewWeibos():
    return {
        'state': True,
        'results': []
    }

def paginated_query(clause: str,  select: str, count_select: str, orderby: str, page: int) -> Tuple[List, int]:

    sparql = prefix + " select (count(%s) as ?c) where {\
        %s\
    }" % (count_select, clause)

    # 1. query the count
    resp = json.loads(gc.query("weibo", "json", sparql))
    count = int(resp["results"]["bindings"][0]["c"]["value"])

    if count == 0:
        return [], 0
    
    # 2. get the paginated result
    sparql = prefix + " select %s where {\
        %s\
        }\
        ORDER BY %s\
        LIMIT %d \
        OFFSET %d \
        " % (select, clause, orderby, page_size, (page - 1) * page_size)
    
    return json.loads(gc.query("weibo", "json", sparql))["results"]["bindings"], count


def searchUserByQuery(query, uid, page):

    clause ="\
            ?uid vocab:user_name ?username \
            FILTER regex(?username, '.*%s.*').\
            "
    resp, count = paginated_query(clause, "?uid", "?uid", "?uid", page)

    # NOTE 没有搜索到结果，在这个需求里不是错误，是预期情况，搜索本来就可以没有搜索结果，所以直接返回一个空数组就可以了。
    # 有的API（比如关注用户）默认传入的ID是有效的，只有这种默认存在、但是实际上不存在的意外情况才应该报错
    if count == 0:
        return {
            'results': [],
            'totalCount': 0
        }

    candidate_user = [data["uid"]["value"] for data in resp]
    
    user_list = []
    for item in candidate_user:
        d = {}
        d["userId"] = item[-10:]
        sparql = prefix+" select ?username ?weiboCount ?followerCount ?followCount where{\
                <%s> vocab:user_name ?username.\
                <%s> vocab:user_statusesnum ?weiboCount.\
                <%s> vocab:user_followersnum ?followerCount.\
                <%s> vocab:user_friendsnum ?followCount.\
                }"%(item, item, item, item)
        
        resp = json.loads(gc.query("weibo","json", sparql))["results"]["bindings"][0]
        d["username"] = resp["username"]["value"]
        d["weiboCount"] = resp["weiboCount"]["value"]
        d["followerCount"] = resp["followerCount"]["value"]
        d["followCount"] = resp["followCount"]["value"]
        d["followed"] = isFollow(d["userId"], uid)
        d["following"] = isFollow(uid, d["userId"])
        user_list.append(d)
    return {
        'totalCount': count,
        'results': user_list,
    }


def postWeibo(uid, content):
    # generate 16bit mid for weibotext
    mid = ''.join(str(random.choice(range(10))) for _ in range(16))
    isotime = datetime.datetime.now().replace(microsecond=0).isoformat()
    sparql = prefix+" insert DATA{\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_date %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_text %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_source %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_repostsnum %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_commentsnum %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_attitudesnum %s.\
            <file:///home/fxb/d2rq/graph_dump.nt#weibo/%s> vocab:weibo_uid '%s'.\
            }"%(mid, isotime, mid, content,mid," ",mid,"0",mid,"0",mid,"0",mid, uid)
    
    resp = json.loads(gc.query("weibo","json", sparql))
    
    resp = gc.checkpoint("weibo")
    
    ans = {}    
    ans["state"] = True
    ans["msg"] = "success"
    return ans

def getFollowingsWeibo(uid):
    ans = {}
    following_list = getFollowings(uid)
    for elem in following_list:
        ans.append(getUserWeibo(elem["uid"]))
    return ans

def getUserWeibo(uid, page):
    sparql = prefix+" select ?wbid ?username ?sendTime ?content where {\
            ?wbid vocab:weibo_uid '%s'.\
            ?wbid vocab:weibo_date ?sendTime.\
            ?wbid vocab:weibo_text ?content.\
            }"%(uid)
    resp = json.loads(gc.query("weibo", "json", sparql))["results"]["bindings"]
    if len(resp)==0:
        ans = {}
        ans["state"] = False
        return ans
    ans = []    
    for data in resp:
        ans_elem = {}
        ans_elem["weiboId"] = data["wbid"]["value"][-16:]
        ans_elem["senderId"] = uid
        ans_elem["sendTime"] = data["sendTime"]["value"]
        ans_elem["content"] = data["content"]["value"]
        ans_elem["senderUsername"] = getProfile(uid)["username"]
        ans.append(ans_elem)
        print(ans)

    return ans

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
