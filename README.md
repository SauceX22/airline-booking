# React Flight Booking ✈️

## Overview

React Flight Booking is a dynamic web application designed to streamline the process of booking flight tickets. Constructed with the T3 Stack, this project harnesses modern technologies to deliver a seamless and user-friendly experience. The application caters to two primary user roles: **Admin** and **User**, each equipped with distinct functionalities tailored to their requirements.

Flight searching functionality is managed within the system's backend, enabling users to search for flights based on parameters like dates, destination, and source city. Additionally, passengers can book available seats directly or be placed on a waitlist according to the specified limits of the ticket class, with all processes handled seamlessly in the backend. 

Ticket reuse after a missed flight is determined by backend calculations, considering 90 days from the flight date to ascertain passenger eligibility. Fines for missed flights or cancellations are imposed, with specific amounts added to a passenger's fine attribute in the system. Notifications, including alerts for booked seats or successful ticket purchases, are implemented in the backend without requiring direct database storage. 

## Features

### General

- React-based (using Next.js) frontend/backend for a responsive and intuitive interface.
- Comprehensive user authentication system.
- Next.js hosted on Vercel and PostgreSQL database hosted on Railway.

### For Administrators

- CRUD operations on flights and user profiles.
- Oversight on booked tickets and seats, including details such as username, email, and payment status.
- Management of user roles and permissions.

### For Users

- Browse available flights for specific dates.
- Search for flights from source to destination.
- Book tickets with various payment plans.
- Select specific seats and classes for multiple passengers at once.
- Flexibility to cancel tickets.
- Group booking for multiple passengers.
- Flexible payment options.

## Online Demo 💻

Access our live demo with the following credentials:

- **Admin Account**

  - Email: `admin@gmail.com`
  - Password: `123456`

- **User Account**
  - Email: `user@gmail.com`
  - Password: `123456`

You can also register new users with fake emails as per the requirements, these are simply starter accounts.
Demo available at [**This Link**](https://airlines.saucex.cc/) / [**Or This Link**](https://airline-booking-mu.vercel.app/home)

**Note: The credentials above are only for demo purposes, and are not real emails that you can contact.**

## Getting Started 🌟

To get this project up and running on your local machine, follow these steps:

1. **Clone the repository**: `git clone https://github.com/SauceX22/airline-booking.git`
2. **Install dependencies**: Navigate to the project directory and run `npm install`.
3. **Set up environment variables**: Before starting the development server, you need to configure the environment variables defined in `env.mjs`. Create a `.env.local` file in the root of your project and define the following variables:

   - `DATABASE_URL`: The URL to your database. Ensure it's a valid URL and not the placeholder `YOUR_MYSQL_URL_HERE`.
   - `NODE_ENV`: Set to `development`, `test`, or `production` depending on your environment.
   - `AUTH_SECRET`: A secret key for NextAuth.js, required in production. Refer to [Next-Auth Docs](https://next-auth.js.org/configuration/options#secret) for aquirement.
   - `AUTH`: The base URL of your site for NextAuth.js callbacks. If deploying on Vercel, this can be left as is to automatically use `VERCEL_URL`.
   - `NEXT_PUBLIC_APP_URL`: The public-facing URL of your application.

   For more details on each environment variable and instructions on how to set them up, please refer to the [Environment Variables Setup Guide](https://github.com/SauceX22/airline-booking/wiki/Environment-Variables-Setup) on our GitHub wiki.

4. **Start the development server**: Execute `npm run dev` and visit `http://localhost:3000` in your web browser.

## Technologies Used

- **[Next.js](https://nextjs.org)**: Main framework providing routing and server-side rendering capabilities.
- **[NextAuth.js](https://next-auth.js.org)**: Secure and flexible user authentication.
- **[Railway](https://railway.app)**: Production Database Hosting.
- **[Prisma](https://prisma.io)**: ORM for database interactions.
- **[Tailwind CSS](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com/)**: Styling and customizable UI components.
- **[tRPC](https://trpc.io)**: End-to-end typesafe API operations.
- **[Zod](https://zod.dev/)**: Input validation to ensure robustness.
- **[React Hook Form](https://react-hook-form.com/)**: Efficient and easy handling of form states.
- **[Sonner](https://sonner.emilkowal.ski/)**: Engaging notification system for user feedback.

## Contributing

We welcome contributions and feedback on our project. Please visit our [GitHub repository](https://github.com/SauceX22/airline-booking) to report issues, suggest improvements, or view the contribution guidelines.

## Deployment

This project is preconfigured for deployment on [Vercel](https://vercel.com) with PostgreSQL database hosting on [Railway](https://railway.app). Follow the deployment instructions specific to your chosen platform to get React Flight Booking live.

## Learn More

For project-specific details, including setup instructions, API references, and development guidelines, please refer to the [project's GitHub wiki](https://github.com/SauceX22/airline-booking/wiki)

For a more detailed understanding of the [T3 Stack](https://create.t3.gg/) and the technologies used in this project, please refer to the following:

- [T3 Stack Documentation](https://create.t3.gg/) — General T3 Stack Documentation of the main tools used in this project.
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials
- [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — They welcome feedback and contributions!
