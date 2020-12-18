/* eslint-disable max-len */
export default {
  id: "en",
  langStrings: ["en", "en-US"],
  detailedId: "en-US",
  name: "English",
  definitions: {
    components: {
      fileUploader: {
        zoneLabel: "Drag and drop your file(s) here, or click to select the file(s).",
        "file-too-large" : "File is too large.",
        "file-too-small": "File is too small.",
        "too-many-files": "Too many files.",
        "file-invalid-type": "Invalid file type.",
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
        tokenInvalid: {
          title: "Login expired",
          description: "Your login session is expired or invalid. Please re-login.",
        },
        serverError: {
          title: "Server error",
          description: "We are sorry that a server error occurred. Please retry or contact support.",
        },
        networkError: {
          title: "Network error",
          description:"Please check your local network, or our network is down.",
        },
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
      publicitySelect: {
        title: "Public",
        public: "Public",
        private: "Private",
      },
    },
    header: {
      home: "Home",
      search: "Search",
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
          remember: "Remember me",
          forget: "Forget password",
          error: {
            title: "Login failed",
            badCredentials: "Please check your username and password.",
          },
        },
        register: {
          title: "Register",
          username: "Username",
          password: "Password",
          register: "Reigster",
          remember: "Remember",
          error: {
            title: "Register failed",
            badCredentials: "This username has been token. Please choose another one.",
          },
          success: "Register succeed! You have been logged in.",
        },
      },
    },
  },
};
