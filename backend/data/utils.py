import GstoreConnector
import sys
import random
import json


IP = "127.0.0.1"
Port = 9000
username = "root"
password = "123456"

prefix = "prefix vocab:   <file:///home/fxb/d2rq/vocab/> \
            prefix user:      <file:///home/fxb/d2rq/graph_dump.nt#user/>"

gc = GstoreConnector.GstoreConnector(IP, Port, username, password)

res = gc.load("weibo", "POST")

def register(uname, pwd, time):
    uid = ''.join(str(random.choice(range(10))) for _ in range(10))
    pass

def login(uname, pwd):
    pass

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


def getFollowers(uid):
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

def getFollowings(uid):
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
    return ans

# getProfile("2452144190")
# follow('1000080335','1940992571')
# getFollowers("1000080335")
getFollowings('1000080335')
