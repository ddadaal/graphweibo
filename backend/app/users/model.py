from datetime import datetime

class User():
    def __init__(self, uname, pwd, uid = '', t = datetime.utcnow(), p = '', c = '', l = '', 
        u = '', g = '', following = 0, follower = 0, friends = 0, status = 0, favourites = 0):

        self.username = uname
        self.passwordhash = pwd  
        self.userid = uid 
        self.createtime = t
        self.province = p
        self.city = c
        self.location = l
        self.url = u
        self.gender = g
        self.followingsnum = following
        self.followersnum = follower
        self.friendsnum = friends
        self.statusesnum = status
        self.favouritesnum = favourites


    def checkPassword(self,hash,password):
        if hash(password) == self.passwordhash:
            return True
        else:
            return False
