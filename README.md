<h1 align="center">Hotel Room and Booking Management System</h1>

# 🏨 Introduction

A comprehensive Vue.js-based solution for hotel operations, providing seamless booking management, guest services, transaction processing, and reporting capabilities.

## 🚀 Key Features

- 🛏️ Room inventory management and availability tracking
- 🧳 Guest-facing booking portal with self-service options
- 👨‍💼 Staff dashboard for booking administration
- 💳 Integrated payment processing system
- 📊 Comprehensive reporting and analytics
- 📱 Responsive design for all devices

## 🛠️ Technologies Used

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📦 Prerequisites

### 1. Required Software

- [NPM](https://nodejs.org/en/download)

### 2. 🔧 Configuration and Connectivity Setup

#### ✅ Critical Configuration Checklist

| Configuration            | File / Location | Action Required                                                  |
| ------------------------ | --------------- | ---------------------------------------------------------------- |
| **API Endpoint**         | `urls.js`       | ✅ Set the correct backend API endpoint                          |
| **Backend URL**          | `main.js`       | 🌐 Set the correct backend hosting: **deployed, local, network** |
| **Backend Connectivity** | `hrbms-backend` | 🔗 Ensure complete integration and successful communication      |

#### ⚠️ Common Pitfalls

Misconfiguration can lead to:

- API connection failures
- Image loading issues
- Data synchronization issues

#### 💡 Best Practices

- Double-check all endpoint URLs
- Test all connections in a staging environment before production
- Avoid hardcoding sensitive data; use the designated configuration files

## 🏗️ Project Architecture

```
hrbms-frontend/
├── src/
│   ├── assets/                 # Static assets like images, svgs
│   ├── components/             # Reusable Vue components
│   ├── mixins/                 # Vue Mixins
│   ├── plugins/                # Vue plugins configuration
│   ├── router/                 # Application routing
│   ├── store/                  # Vuex state management
│   ├── utils/                  # Helper functions and utilities
│   ├── views/                  # Page components
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
└── public/                     # Public static assets
```

The application follows a modular architecture with clear separation of concerns:

- **Presentation Layer**: Vue.js components and Vuetify UI framework
- **State Management**: Centralized Vuex store for application data
- **Service Layer**: API integration and third-party services
- **Utility Layer**: Helper functions and shared logic

## 🚀 Project Setup

### Install Dependencies

```bash
npm install  # 📦 Installs all required node modules
```

### Available Commands

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run serve` | 🔧 Start in development mode with hot-reload     |
| `npm run build` | 📦 Build for production (minified and optimized) |
| `npm run lint`  | 🧹 Lint and fix code issues                      |

## 🔍 Troubleshooting Guide

### API Connection Issues

| Issue                       | Solution                                                     |
| --------------------------- | ------------------------------------------------------------ |
| API timeout errors          | Check network connectivity and backend server status         |
| Authentication failures     | Verify correct API credentials in `urls.js`                  |
| CORS errors                 | Ensure backend has proper CORS configuration for your domain |
| Data synchronization issues | Check local storage quota and clear cache if necessary       |
| Image loading issues        | Verify correct API endpoint in url `urls.js`                 |

## 📋 Commit Message Guidelines

Use the following emojis to indicate the nature of your commits:

| Emoji | Code                          | Description                       |
| ----- | ----------------------------- | --------------------------------- |
| 💯    | `:100:`                       | Full functionality implementation |
| 🔧    | `:wrench:`                    | Code improvement / refactor       |
| 🐛    | `:bug:`                       | Bug fix                           |
| 📑    | `:bookmark_tabs:`             | Documentation and comments        |
| ☕    | `:coffee:`                    | Minor or initial changes          |
| 🚧    | `:construction:`              | Work in progress                  |
| 🗑️    | `:wastebasket:`               | Code or file deletion             |
| 📓    | `:notebook:`                  | README updates                    |
| ✏️    | `:pencil2:`                   | Typo or naming corrections        |
| ♻️    | `:recycle:`                   | Code refactoring                  |
| 🔀    | `:twisted_rightwards_arrows:` | Branch merge                      |
| ⏪    | `:rewind:`                    | Reverting changes                 |
| 📱    | `:iphone:`                    | Responsive design changes         |
| 📌    | `:pushpin:`                   | Hotfixes                          |

## 🤝 Contributing Guidelines

### Branch Naming

- `developer`: For main development
- `feature/feature-name`: For new features
- `hotfix/issue-name`: For critical fixes
- `release/version`: For release preparation

### Code Style

- Follow Vue.js style guide
- Use ESLint configuration
- Write meaningful comments

## 🔒 Security Considerations

- All API requests must use HTTPS
- Sensitive data must be encrypted at rest and in transit
- User authentication tokens should be stored securely
- Implement proper input validation to prevent injection attacks
- Regular security audits are conducted on the codebase

> For security issues, please contact the security team at `spcf.ictdu@spcf.edu.ph`.

## 👥 Development Team

- 👨‍💻 **Gabriel Alfonso M. Gatbonton** - Senior Frontend Developer
- 👨‍💻 **Prince Charles M. Clemente** - Senior Frontend Developer
- 👨‍💻 **Rhymeses E. Cortez** - Junior Frontend Developer
