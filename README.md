# 📝 BlogApp

A modern, full-stack blogging platform built with **Spring Boot** and **React**. Features JWT authentication, CRUD operations for posts, comments, likes, user profiles, and a sleek dark-themed UI.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwindcss)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register/login with token-based auth |
| 📄 **Post Management** | Create, read, update, and delete blog posts |
| 💬 **Comments** | Nested comment system on each post |
| ❤️ **Likes** | Like/unlike posts with real-time count |
| 👤 **User Profiles** | View and manage user profiles |
| 🔍 **Pagination & Sorting** | Server-side pagination with configurable sort |
| 🛡️ **Role-Based Access** | `ROLE_USER` and `ROLE_ADMIN` authorization |
| 📱 **Responsive Design** | Mobile-first dark-themed UI |
| 🔗 **SEO-Friendly Slugs** | Posts accessible via URL slugs |

---

## 🏗️ Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.3.4**
- **Spring Security** — JWT authentication & authorization
- **Spring Data JPA** — ORM with Hibernate
- **MySQL** — Relational database
- **Lombok** — Boilerplate reduction
- **JJWT 0.12.6** — JSON Web Token library
- **Bean Validation** — Request DTO validation

### Frontend
- **React 19** + **Vite 8**
- **React Router 7** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS 4** — Utility-first styling
- **Lucide React** — Icon library

---

## 📁 Project Structure

```
Blogapp/
├── Blogapp/                          # Spring Boot Backend
│   ├── src/main/java/com/euphoria/code/
│   │   ├── config/                   # Security & CORS configuration
│   │   ├── controller/               # REST API controllers
│   │   │   ├── AuthController.java   #   POST /api/auth/*
│   │   │   ├── PostController.java   #   CRUD /api/posts/*
│   │   │   ├── CommentController.java#   CRUD /api/comments/*
│   │   │   ├── LikeController.java   #   POST /api/likes/*
│   │   │   └── UserController.java   #   GET  /api/users/*
│   │   ├── dto/                      # Request & Response DTOs
│   │   ├── entity/                   # JPA Entities
│   │   ├── exception/                # Global exception handling
│   │   ├── repository/               # Spring Data repositories
│   │   ├── security/                 # JWT filter & token provider
│   │   └── service/                  # Business logic layer
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration
│   └── pom.xml
│
├── Frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/                      # Axios client & API services
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── LikeButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                  # Auth context (React Context API)
│   │   ├── pages/                    # Route-level pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PostDetailPage.jsx
│   │   │   ├── CreatePostPage.jsx
│   │   │   ├── EditPostPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── App.jsx                   # Root component with routing
│   │   └── main.jsx                  # Entry point
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/posts?page=0&size=10&sortBy=createdAt&sortDir=desc` | List all posts (paginated) | ❌ |
| `GET` | `/api/posts/{id}` | Get post by ID | ❌ |
| `GET` | `/api/posts/slug/{slug}` | Get post by slug | ❌ |
| `POST` | `/api/posts` | Create a new post | ✅ |
| `PUT` | `/api/posts/{id}` | Update a post (author/admin only) | ✅ |
| `DELETE` | `/api/posts/{id}` | Delete a post (author/admin only) | ✅ |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/comments/post/{postId}` | Get comments for a post | ❌ |
| `POST` | `/api/comments` | Add a comment | ✅ |
| `DELETE` | `/api/comments/{id}` | Delete a comment | ✅ |

### Likes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/likes/toggle/{postId}` | Toggle like on a post | ✅ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users/me` | Get current user profile | ✅ |
| `GET` | `/api/users/{id}` | Get user by ID | ❌ |

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js 18+** and **npm**
- **MySQL 8+**
- **Maven** (or use the included `mvnw` wrapper)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Blogapp.git
cd Blogapp
```

### 2. Set Up the Database

```sql
CREATE DATABASE blogapp;
```

### 3. Configure the Backend

Edit `Blogapp/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blogapp?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_base64_encoded_256bit_secret
jwt.expiration-ms=86400000
```

> [!IMPORTANT]
> Replace the `jwt.secret` with your own 256-bit Base64-encoded secret key for production use.

### 4. Run the Backend

```bash
cd Blogapp
./mvnw spring-boot:run
```

The API will start on **http://localhost:8185**.

### 5. Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The app will start on **http://localhost:5173**.

---

## 🔒 Authentication Flow

```
┌──────────┐     POST /api/auth/login      ┌──────────┐
│  Client   │ ─────────────────────────────▶│  Server  │
│ (React)   │                               │ (Spring) │
│           │◀───────────── JWT ────────────│          │
└──────────┘                                └──────────┘
      │                                          ▲
      │   Authorization: Bearer <token>          │
      └──────────────────────────────────────────┘
              All subsequent requests
```

1. User registers or logs in → receives a **JWT token**
2. Token is stored in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. Spring Security's `JwtAuthenticationFilter` validates the token on each request

---

## 🛠️ Development

### Backend Hot Reload

For automatic restart on code changes, add `spring-boot-devtools` to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Frontend Hot Reload

Vite provides HMR out of the box — changes are reflected instantly in the browser.

### Linting

```bash
cd Frontend
npm run lint    # Runs oxlint
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) — Backend framework
- [React](https://react.dev) — Frontend library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Lucide](https://lucide.dev) — Beautiful icons
- [JJWT](https://github.com/jwtk/jjwt) — JWT implementation for Java

---

<p align="center">
  Made with ❤️ by <strong>Euphoria Code</strong>
</p>
