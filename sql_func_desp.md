## def get_personal_center(uid string)
获取我的个人中心信息
```python
return: json{
        screen_name
        gender：f/m
        followersnum (int): 关注ta的人
        friendsnum(int): ta关注的人
        statusesnum(int): 微博数目
        favouritesnum(int)://似乎不用这个数据,
        }

```

## def search_user(screen_name:string)
搜索用户
```python
return: json
        {screen_name(string),
        followersnum (int): 关注ta的人,
        friendsnum(int): ta关注的人,
        statusesnum(int): 微博数目,
        follow_status(bool):是否关注 true/false,
        }
```

## def post_weibo(uid:string, text:string)
发微博
```python
return:json{
        status_success:true/false
        text:string,
        }
```

## def my_fans(uid:string)
我的粉丝
```python
return:
        list[
            {screen_name(string),
            followersnum (int): 关注ta的人,
            friendsnum(int): ta关注的人,
            statusesnum(int): 微博数目,
            follow_status(bool):是否关注 true/false,
        },]
            
```

## def my_follow(uid:string)
我关注的用户
```python
return:
    list[
            {screen_name(string),
            followersnum (int): 关注ta的人,
            friendsnum(int): ta关注的人,
            statusesnum(int): 微博数目,
            follow_status(bool):是否关注 true/false,
        },]
```
