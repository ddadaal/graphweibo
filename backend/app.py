from flask import Flask
from flask_cors import CORS
from flask import Flask

from main.profile.profile import profile 
from main.weibo.weibo import weibo
from main.user.user import user

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.register_blueprint(user, url_prefix='/user') 
app.register_blueprint(profile,url_prefix='/profile') 
app.register_blueprint(weibo,url_prefix='/weibo') 

app.config['SECRET_KEY'] = '...selfgenerated'
app.debug = True

