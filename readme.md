# SpaceX Launches Scheduler

This project is a web application that allows users to view upcoming SpaceX launches, launch history, and schedule new launches (simulation). It utilizes the [**SpaceX public API**](https://github.com/r-spacex/SpaceX-API/tree/master/docs/launches/v4) to retrieve launch data and stores it in a MongoDB Atlas database.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (local MongoDB could also work)
- **Frontend**: React.js
- **UI Framework**: Arwes UI
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Cloud Deployment**: Amazon EC2

## Features

- View upcoming SpaceX launches retrieved from the SpaceX public API.
- View historical launch data stored in MongoDB Atlas.
- Simulate scheduling new launches
- Arwes UI provides a clean and user-friendly interface.

## Architecture

The application follows a separation of concerns with a clear distinction between the frontend (React.js) and backend (Node.js, Express.js). The backend interacts with the SpaceX API and MongoDB Atlas, while the frontend displays the retrieved data and provides an interface for simulated launch scheduling.

## Running the application (locally)

### 1. Prerequisites

- Node.js and npm/yarn/pnpm installed on your system
- Docker installed and running
- A MongoDB Atlas account with a database created

### 2. Clone the repository

```bash
git clone https://github.com/Relin404/NASA-Space-App.git
```

### 3. Install dependencies

```bash
cd nasa-space-app
pnpm install # npm or yarn could also be used
```

- This will install both server and client dependencies

### 4. Configure .env

- Create a file named .env in the project root directory.
- Add the following environment variables to the .env file, replacing the placeholders with your actual values:

`
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<cluster-name>.mongodb.net/<database-name>
`

### 5. Build Docker image and run the application

```bash
docker build -t spacex-launches-scheduler .
docker run -it -p 8000:8000 spacex-launches-scheduler
```

- This command will build the Docker image for the application and start the containers for both the frontend and backend.

### 6. Run the app

```bash
pnpm run deploy 
```

## Deployment

The project is designed to be deployed on **Amazon EC2** after building a Docker image. The specific deployment steps will involve creating an EC2 instance, configuring security groups, and utilizing tools like GitHub Actions to automate the CI/CD pipeline.
