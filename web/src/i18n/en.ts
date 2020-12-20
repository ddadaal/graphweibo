/* eslint-disable max-len */
export default {
  id: "en",
  langStrings: ["en", "en-US"],
  detailedId: "en-US",
  name: "English",
  definitions: {
    components: {
      weiboInput: {
        placeholder: "Something interesting to share?" ,
        submit: "Send",
        submitting: "Sending...",
        submitSuccess: "Send Complete!",
        textAreaLoginPrompt: "Would like to share something interesting? Please login.",
        buttonLoginPrompt: "To Login",
      },
      userListItem: {
        weiboCount: "Weibo Count",
        fans: "Fans",
        follows: "Follows",
        follow: "Follow",
        following: "Following",
        followInProgress: "Following...",
        unfollowInProgress: "Unfollowing...",
        followComplete: "Followed!",
        unfollowComplete: "Unfollowed!",
      },
      tagInput: {
        placeholder: "Press Enter to add one item." ,
        commaToSplit: "Items splitted by comma will be added separately.",
      },
      requireAuth: {
        title: "Not Authorized",
        description: "You are not authorized to access this page. Please login as required user and try again.",
      },
      httpHandler: {
        tokenInvalid: "Your login session is expired or invalid. Please re-login.",
        serverError:  "We are sorry that a server error occurred. Please retry or contact support.",
        networkError: "Please check your local network, or our network is down.",
      },
      errors: {
        notAuthorized: {
          title: "Not Authorized",
          description: "Login is required to access this page. Please login and retry.",
        },
        forbidden: {
          title: "Forbiddden",
          description: "You can't access this page. Please login as required user and retry.",
        },
        notFound: {
          title: "404",
          description: "The resource you are trying to access does not exist.",
        },
        serverError: {
          title: "Server Error",
          description: "We are sorry that our server just got a problem. Please continue when it is fixed.",
        },
        localNetworkError: {
          title: "Network Error",
          description: "Please check your local network, or our network is down.",
        },
      },
      form: {
        validationError: {
          email: "Please input a valid email.",
          invalid: "Invalid",
          required: "Required",
          codeLink: "Please input repo link from {}",
        },
      },
    },
    header: {
      home: "Home",
      search: "SearchUser",
      upload: "Upload",
      about: "About",
      login: "Login",
      welcome: "Welcome, {}",
      logout: "Logout",
      dashboard: "Dashboard",
      admin: {
        articles: "Manage Articles",
        users: "Manage Users",
      },
    },
    footer: {
      description: "Cloud for Academy",
      contact: {
        title: "Contact",
        github: "GitHub - ddadaal",
        website: "Personal Website - ddadaal.me",
        linkedin: "LinkedIn - Chen Junda",
      },
      moreProducts: {
        title: "More Products",
        chainpaper: "ChainPaper - Paper Social Platform powered by Blockchain",
        chainstore: "ChainStore - Distributed Storage System based on Blockchain",
        aplusquant: "A+Quant - An Asset Allocation System based on ML",
        tagx00: "Tag x00 - Online Tagging Platform powered by ML",
        lightx00: "Light x00 - Light Product Purchasing-Selling-Stocking System",
      },
      copyright: { madeWithLove: "Made with ❤" },
    },
    validateMessages: {
      required: "Please input this field.",
      email: "Please input a valid email.",
      number: "Please input a valid number.",
      integer: "Please input a valid integer.",
    },
    pages: {
      dashboard: {
        accountProfile: {
          username: "Username",
          userId: "User ID",
          registerTime: "Register Time",
        },
        contentSelector: {
          weibo: "Weibo",
          following: "Following",
          followers: "Followers",
        },
      },
      home: {
        title: "GraphWeibo",
        description: "Weibo powered by graph management service",
        pageIndicator: {
          login: "Login",
          register: "Register",
        },
        login: {
          title: "Login",
          username: "Username",
          password: "Password",
          login: "Login",
          inProgress: "Logging in...",
          remember: "Remember me",
          forget: "Forget password",
          error: {
            title: "Login failed",
            badCredentials: "Please check your username and password.",
          },
          toRegister: "To Register",
        },
        register: {
          title: "Register",
          username: "Username",
          password: "Password",
          register: "Reigster",
          inProgress: "Registering...",
          remember: "Remember",
          error: {
            title: "Register failed",
            conflict: "This username has been token. Please choose another one.",
          },
          success: "Register succeed! You have been logged in.",
          toLogin: "To Login",
        },
      },
    },
  },
};
