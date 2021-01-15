from flask import Flask
from flask_cors import CORS
from flask import Flask

from main.dashboard.dashboard import dashboard 
from main.weibo.weibo import weibo
from main.user.user import user

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.register_blueprint(user, url_prefix='/user') 
app.register_blueprint(dashboard,url_prefix='/dashboard') 
app.register_blueprint(weibo,url_prefix='/weibo') 

app.config['SECRET_KEY'] = '...selfgenerated'
app.debug = True

