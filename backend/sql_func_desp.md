## def register(uname string, pwd string, time string)
注册：创建新用户，找到一个现有数据中没有的ID号并返回，以后基本上以ID作为查询的主要标识
如果uname已经存在，state返回False
```python
return: {//不用直接返回json，返回字典即可
        state:True/False
        userId(string)
        }

```

## def login(uname string, pwd string)
登录：查看系统中是否有该用户，密码是否正确
```python
return: {
        state:True/False
        userId(string)
        }

```

## def getProfile(uid string)
获取我的个人中心信息。如果uid不存在，state给False。
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

## def getFollowers(uid string, myid: string | None, page int)
uid的粉丝。分页。每页10个。
```python
return:{
        state:True/False
        result:tuple(list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followersCount (int): 关注ta的人,
                followingsCount (int): ta关注的人,
                following(bool):我是否关注他 true/false,
                followed(bool):他是否关注我 true/false
        }], int)
        } 
```

## def getFollowings(uid:string, myid: string | None, page int)
uid关注的用户。分页。每页10个。
```python
return:{
        state:True/False
        result:tuple(
                list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followersCount (int): 关注ta的人,
                followingsCount (int): ta关注的人,
                following(bool):我是否关注他 true/false,
                followed(bool):他是否关注我 true/false,
        }], int)
        }  
```

## def searchUserByQuery(querystr:string, uid:string, page int)
搜索用户，查找和字符串最匹配的多个用户，返回他们的信息。每页10个。
```python
return: {
        results: list[
                {username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followersCount (int): 关注ta的人,
                followingsCount (int): ta关注的人,
                following(bool):我是否关注他,如果第二个参数为空字符串''，则为false true/false,
                followed(bool):他是否关注我，如果第二个参数为空字符串，则为false true/false,
                }]
        totalCount: int
}
```

## def searchUserByID(queryid:string, uid:string)
搜索用户，查找用户名对应的单个用户
```python
return: {
                username(string),
                userId(string),
                weiboCount(int): 微博数目,
                followersCount (int): 关注ta的人,
                followingsCount (int): ta关注的人,
                following(bool):我是否关注他,如果第二个参数为空字符串''，则为false true/false,
                followed(bool):他是否关注我，如果第二个参数为空字符串，则为false true/false,
        } | None
        
```

## def postWeibo(uid:string, contents:string)
发微博
```python
return:{
        state:true/false
        msg:string 错误原因
        }
```

## def getFollowingsWeibo(uid:string, page int)
获取所有已关注人的微博。分页。不需要返回总数。
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

## def getUserWeibo(uid:string, page int)
获取某个特定用户的微博。分页。
```python
return:{
        state:true/false
        results:tuple([
                {
                        weiboId: string;微博ID
                        senderId: string;发送的用户ID
                        senderUsername: string;发送的用户的用户名
                        sendTime: string;发送时间
                        content: string;内容
                }  
        ], total_count)
        }
```

## def getUserConnection(fromuid:string,touid:string)
获得两个用户之间的关注关系。从from关注到to，4跳之内。
```python
return:{
        state:true
        /** 源用户的ID和用户名 */
        fromUser: {
                    userId: string
                    username: string
                  }
        /** 目标用户的ID和用户名 */
        toUser: {
                    userId: string
                    username: string
                }
        /** 中间用户的ID和用户名，不包含源用户和目标用户*/
        intermediateUsers:list[{
                    userId: string
                    username: string
                }]
        /**
         * 所有源用户和目标用户之间的路径。
         * 每个节点用ID表示，每个小数组为一条路径。
         * 路径中需要包含源节点和目标节点
         **/
        paths: string[][];
        }
如果失败返回：
return:{
        state:False
        fromUserNotExists: boolean; 来源用户不存在
        toUserNotExists: boolean; 目标用户不存在
        
```


## def getNewWeibos(page: int)
获得系统中最新的微博。分页。不需要返回总数。
```python
return: list[
                {
                        weiboId: string;微博ID
                        senderId: string;发送的用户ID
                        senderUsername: string;发送的用户的用户名
                        sendTime: string;发送时间
                        content: string;内容
                }  
        ]
```


