from flask import Flask
#from flask_cors import CORS
from flask import Flask,request,render_template 

from main.dashboard.dashboard import dashboard 
from main.weibo.weibo import weibo
from main.user.user import user

app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="")
app.register_blueprint(user, url_prefix='/user') 
app.register_blueprint(dashboard,url_prefix='/dashboard') 
app.register_blueprint(weibo,url_prefix='/weibo') 

#CORS(app,supports_credentials=True)
app.config['SECRET_KEY'] = '...selfgenerated'
app.debug = True

