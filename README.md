# Stackmente

Stackmente is a community-driven web platform designed to facilitate the exchange of knowledge and open discussion. Inspired by the best features of platforms like **Stack Overflow** and **Reddit**, Stackmente allows users to ask questions, write articles, comment, vote, and participate in intellectual conversations across a variety of topics.

## 🔍 Project Overview

This project was created as part of a final-year academic requirement. The goal was to design and build a functional, interactive, and scalable platform that encourages learning, sharing experiences, and collective thinking.

The name **Stackmente** is a combination of:

- **Stack**: symbolizing the accumulation of knowledge and interactions.
- **Mente**: meaning "mind" in Italian, emphasizing the platform’s focus on thoughtful exchange and collective intelligence.

The visual identity of the project was also carefully designed to reflect seriousness, determination, and its academic context.

---

## 🚀 How to Access the Platform

Before diving into the technical construction, it's important to view the platform in action. You can access it in two main ways:

### 1. Access via Public URL (Recommended for Quick Testing)

The platform is hosted online via **Hostinger** and is publicly accessible. While a custom domain name is still pending, you can currently access the app using the following link:

🔗 [https://stackmente.duckdns.org](https://stackmente.duckdns.org)

> _No installation needed – just open and explore._

---

### 2. Local Installation (For Developers)

If you'd like to run the platform locally for development or testing purposes, follow the steps below:

#### ✅ Requirements:

- Git
- PHP (>=8.4.0)
- Composer (>=2.8.0)
- Node.js (>=22.0.0)
- NPM (>=10.0.0)

#### 🛠 Steps:

##### 1. Clone the repository

```bash
git clone https://www.github.com/ImraneAabbou/StackMente
cd StackMente
```

##### 2. Install backend and frontend dependencies

```bash
composer install
npm install
```

##### 3. Copy the .env file and configure the following services

**Note:** OAuth keys are not provided for security reasons, it should be configured.

```bash
cp .env.example .env
```

##### 4. Confirgure the following services

```env
DB_HOST=<database-host>
DB_PORT=<database-port>
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
GITHUB_CLIENT_ID=<github-client-service-id>
GITHUB_CLIENT_SECRET=<github-client-service-secret>
FACEBOOK_CLIENT_ID=<facebook-client-service-id>
FACEBOOK_CLIENT_SECRET=<facebook-client-service-secret>
GOOGLE_CLIENT_ID=<google-client-service-id>
GOOGLE_CLIENT_SECRET=<google-client-service-secret>
```

##### 5. Run database migrations

```bash
php artisan migrate
```

##### 6. Start the local backend server

```bash
php artisan serve
```

##### 7. Start the local frontend server

```bash
npm run dev
```

---

#### Run via Docker & Laravel Sail (development)

```bash
composer install && ./vendor/bin/sail up
```

#### Or via Docker Stack (production)

```bash
docker stack deploy -c docker-stack.yml stackmente
```

### ⚠️ Notes

OAuth services (Google, GitHub, Facebook) and mailing won’t work unless valid credentials are provided.
To test the full experience, you can use the hosted version mentioned above.

### 📄 License

This project is built for educational purposes and does not currently include a specific license. Please contact the author if you'd like to contribute or reuse parts of the code.

### 👨‍💻 Author

Created by Imrane Aabbou
Feel free to explore, learn from, or contribute to Stackmente!
