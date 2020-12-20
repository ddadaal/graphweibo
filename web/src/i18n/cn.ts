/* eslint-disable max-len */
export default {
  id: "cn",
  langStrings: ["cn", "zh-CN", "zh"],
  detailedId: "zh-CN",
  name: "简体中文",
  definitions: {
    components: {
      weiboInput: {
        placeholder: "有什么新鲜事想告诉大家？" ,
        submit: "发送",
        submitting: "发送中……",
        submitSuccess: "发送成功！",
        textAreaLoginPrompt: "想告诉大家新鲜事？请先登录！",
        buttonLoginPrompt: "去登录",
      },
      userListItem: {
        weiboCount: "微博数",
        fans: "粉丝",
        follows: "关注数",
        follow: "关注",
        following: "已关注",
        followInProgress: "关注中……",
        unfollowInProgress: "取消关注中……",
        followComplete: "关注成功！",
        unfollowComplete: "取消关注成功！",
      },
      tagInput: {
        placeholder: "按下回车以增加一项。",
        commaToSplit: "逗号分割的每一项将会单独添加为一项。",
      },
      httpHandler: {
        tokenInvalid:
           "您的登录状态已经过期。请重新登录后继续。",
        serverError:
           "抱歉，服务器出错了，请重试或者联系支持。",
        networkError:
           "请检查本地网络是否已经连通，或服务器开了小差……",
      },
      errors: {
        notAuthorized: {
          title: "请登录",
          description: "访问此页面需要登录，请先登录后再重试。",
        },
        forbidden: {
          title: "无权限",
          description: "您没有权限访问本页面。请以要求的权限的用户登录后再尝试。",
        },
        notFound: {
          title: "404",
          description: "您所查找的资源不存在。",
        },
        serverError: {
          title: "服务器出错",
          description: "非常抱歉，服务器出现错误，请等待我们将问题解决后再继续，或将问题报告至支持。",
        },
        localNetworkError: {
          title: "网络连接出错",
          description: "本地网络出错，请检查本地网络是否已经连通，或者服务器暂时开了小差……",
        },
      },
      form: {
        validationError: {
          email: "请输入有效的电子邮箱",
          invalid: "输入无效",
          required: "必填项",
          codeLink: "请输入以下网站的仓库的链接：{}",
        },
      },
    },
    header: {
      home: "主页",
      search: "搜索用户",
      login: "登录",
      about: "关于",
      welcome: "欢迎您，{}",
      logout: "登出",
      dashboard: "个人中心",
      upload: "论文上传",
      admin: {
        articles: "文章管理",
        users: "用户管理",
      },
    },
    footer: {
      description: "为高校设计的云平台",
      contact: {
        title: "联系方式",
        github: "GitHub - ddadaal",
        website: "个人网站 - ddadaal.me",
        linkedin: "LinkedIn - Chen Junda",
      },
      moreProducts: {
        title: "更多产品",
        chainstore: "ChainStore - 基于区块链的分布式存储解决方案",
        chainpaper: "ChainPaper - 基于区块链的论文社交平台",
        aplusquant: "A+Quant - 基于机器学习的大类资产管理系统",
        tagx00: "Tag x00 - 基于机器学习的众包标注平台",
        lightx00: "Light x00 - 灯具进销存管理系统",
      },
      copyright: { madeWithLove: "用 ❤ 制作" },
    },
    validateMessages: {
      email: "请输入有效的电子邮箱地址。",
      required: "这是必需字段。",
      number: "请输入数字。",
      integer: "请输入整数。",
    },
    pages: {
      dashboard: {
        accountProfile: {
          username: "用户名",
          userId: "用户ID",
          registerTime: "注册时间",
        },
        contentSelector: {
          weibo: "微博",
          following: "我关注的用户",
          followers: "关注我的用户",
        },
      },
      home: {
        title: "GraphWeibo",
        description: "推送",
        pageIndicator: {
          login: "登录",
          register: "注册",
        },
        login: {
          title: "登录",
          username: "用户名",
          password: "密码",
          login: "登录",
          inProgress: "登录中……",
          remember: "记住我",
          forget: "忘记密码",
          error: {
            title: "登录失败",
            badCredentials: "请检查您的用户名和密码",
          },
          toRegister: "去注册",
        },
        register: {
          title: "注册",
          username: "用户名",
          password: "密码",
          register: "注册",
          inProgress: "注册中……",
          remember: "记住我",
          error: {
            title: "注册失败",
            conflict: "用户名已经被占用，请重新换一个！",
          },
          success: "注册成功！已经自动登录您的账户。",
          toLogin: "去登录",
        },
      },
    },
  },
};
