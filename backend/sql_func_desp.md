## def register(uname string, pwd string, time string)
注册：创建新用户，找到一个现有数据中没有的ID号并返回，以后基本上以ID作为查询的主要标识
```python
return: {//不用直接返回json，返回字典即可
        state:True/False
        userID(string)
        }

```

## def login(uname string, pwd string)
登录：查看系统中是否有该用户，密码是否正确
```python
return: {
        state:True/False
        userID(string)
        }

```

## def getProfile(uid string)
获取我的个人中心信息
```python
return: {
        state:True/False
        profile:{
                userId:
                username: 
                registerTime: ISO8601字符串
                weiboCount: 微博数
                followingsCount: 关注者数
                followersCount: 粉丝数
                }
        }
```

## def follow(uid1 string, uid2 string)
user1关注user2
```python
return: {
        state:True/False
        msg:'Inexist'/'AlreadyFollowed'/..
        }
```

## def unfollow(uid1 string, uid2 string)
user1取关user2
```python
return: {
        state:True/False
        msg:'Inexist'/'AlreadyUnfollowed'/..
        }
```

## def getFollowers(uid string)
我的粉丝
```python
return:{
        state:True/False
        followers:list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followerCount (int): 关注ta的人,
                followCount (int): ta关注的人,
                following(bool):我是否关注他 true/false,
                followed(bool):他是否关注我 true/false
        }]
        }  
```

## def getFollowings(uid:string)
我关注的用户
```python
return:{
        state:True/False
        followings:list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followerCount (int): 关注ta的人,
                followCount (int): ta关注的人,
                following(bool):我是否关注他 true/false,
                followed(bool):他是否关注我 true/false,
        }]
        }  
```

## def searchUser(query:string, uid:string)
搜索用户
```python
return: {
        state:True/False
        userResult:list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followerCount (int): 关注ta的人,
                followCount (int): ta关注的人,
                following(bool):我是否关注他 true/false,
                followed(bool):他是否关注我 true/false,
        }]
}
        
```

## def postWeibo(uid:string, contents:string)
发微博
```python
return:{
        state:true/false
        msg:string 错误原因
        }
```

## def getFollowingsWeibo(uid:string)
获取所有已关注人的微博
```python
return:{
        state:true/false
        results:list[
                {
                        weiboId: string;微博ID
                        senderId: string;发送的用户ID
                        senderUsername: string;发送的用户的用户名
                        sendTime: string;发送时间
                        content: string;内容
                }  
        ]
        }
```

## def getUserWeibo(uid:string)
获取某个特定用户的微博
```python
return:{
        state:true/false
        results:list[
                {
                        weiboId: string;微博ID
                        senderId: string;发送的用户ID
                        senderUsername: string;发送的用户的用户名
                        sendTime: string;发送时间
                        content: string;内容
                }  
        ]
        }
```


