
---

# Timperio CRM System

This web application provides a **Customer Relationship Management (CRM)** system tailored for Timperio. It enables efficient visualization of customer purchase histories and automates personalized marketing efforts, helping to streamline customer engagement and enhance overall business operations.

## Tech Stack

- **Frontend**: Tailwind CSS, React, Next.js
- **Backend**: Java, Spring Boot, Maven

## Prerequisites

Before starting the application, ensure you have the following installed:
- **Node.js** (for the frontend)
- **Maven** and **Java 11+** (for the backend)
- **WAMP/MAMP** (if required for your local environment)

Login Details: 

(Admin)
Userid: A001
Password: 123456 

(Marketing)
Userid: A003
Password: 123456 

(Sales)
Userid: A004
Password: 123456 

## Getting Started

### 1. Set Up the Frontend

First, navigate to the frontend directory and install the necessary dependencies.

```bash
cd my-next-app
npm install
```

Then, start the development server:

```bash
npm run dev
# Alternatively, if using Yarn, pnpm, or Bun
yarn dev
pnpm dev
bun dev
```

### 2. Set Up the Backend

Navigate to the backend directory and build the project with Maven.

```bash
cd backend/timperio.crm
mvn clean install
```

Then, start the Spring Boot application:

```bash
mvn spring-boot:run
```

### 3. Open the Application

Once both servers are running, you can view the web app by opening [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```plaintext
root/
├── backend/               # Backend (Spring Boot) application
│   └── timperio.crm/      # Contains Java source files and Maven dependencies
└── my-next-app/           # Frontend (Next.js) application
    ├── src/               # Source files for React components
```

## Features

- **Customer Purchase History**: Visualize each customer’s purchase history in an organized, accessible format.
- **Automated Marketing**: Automate personalized marketing efforts based on customer data, enhancing engagement and retention.
- **Responsive Design**: Built with Tailwind CSS for a sleek and responsive user interface.

## Additional Resources

- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about Next.js features and API.
- **[Spring Boot Documentation](https://spring.io/projects/spring-boot)** - Learn more about building RESTful services with Spring Boot.
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Explore utility-first CSS for rapid UI development.

## Deployment

To deploy the frontend on **Vercel**, follow these [Next.js deployment instructions](https://nextjs.org/docs/deployment) for a seamless setup.

---

This README structure provides a clear and concise overview of the project, setup instructions, and additional details that will be helpful for both team members and contributors. Let me know if you’d like any further customization!