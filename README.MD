# GraphQL API with Apollo Server, Prisma, and BullMQ

## Project Overview

The project implements a simple GraphQL API using Apollo Server, integrated with Prisma for database interactions and BullMQ for jobs queuing, specifically for email notifications.

## Choices and Implementation Details

The following outlines my approach to the project, and the decisions i made along the way.

- **SQLite Database**: I chose SQLite as the database for the project, as it's lightweight, and simple to set up. I have included a dev.db file preloaded with some sample data I used for testing.
- **Singleton Clients**: I initialized both the Prisma client and the BullMQ client as singletons, ensuring they are only initialized once and shared across the application, avoiding initialization on every request.
- **Resolvers**: I used `graphql-parse-resolve-info` to parse the GraphQL query and extract the fields requested by the user. This was to avoid over-fetching data, which required expensive database joins.
- **Idempotent Notifications**: I created a unique index `email_purchaseId_type` on the `EmailNotification` table to ensure that only one notification of a given type is sent per purchase. That plus using a database transaction ensures that if a job is retried due to a network issue, the notification is not sent again.
- **Job Retry Strategy**: I configured the BullMQ job retry strategy to use an exponential backoff with a maximum of 3 retries in case of failure.
- **Server**: I have setup the project to run two servers concurrently, one for the main application and one for the email notifications worker. This emulates a production environment where they would be deployed as separate instances.

## Potential Improvements

- **Authentication**: I would implement authentication such as JWT where the user would pass an authorization token. That would replace the current setup where the user sends their userID in the query.
- **Contianerization**: I would containerize the application using Docker, and create multiple services for the graphQL server, email notifications worker, and the Redis Instance.

## How to run

To run this project locally:

### 1. Clone the repository

```shell
git clone https://github.com/kibzrael/fusion-labs
cd rem
```

### 2. Setup environment variables

```shell
cp .env.example .env
```

Make sure to update the environment variables with your own values.

### 3. Install Dependencies

```shell
npm install -g concurrently
npm install -g pnpm@latest-10
pnpm install
```

### 4. Build and run the application

```shell
pnpm run start
```

The apollo server link will be displayed in the console http://localhost:4000
