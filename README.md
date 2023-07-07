# RootSeeker REST API

## About:

-   This repo implements the backend REST API (built in Express + MongoDB).
-   A repository for with the frontend (React App) can be found here: [https://github.com/RootSeeker-fullstack-app/rootseeker-client](https://github.com/RootSeeker-fullstack-app/rootseeker-client) 

## Instructions:

To run in your computer, follow these steps:

-   Clone
-   Install dependencies: `npm install`
-   Create a `.env` file with the following enviroment variables
    -   PORT: with the port to run it locally (example, `PORT=5005`)
    -   ORIGIN: with the location of the frontend app, `ORIGIN=https://rootseeker.netlify.app`
    -   TOKEN_SECRET: used to sign auth tokens (example, `TOKEN_SECRET=RootSeeker`)
    -   Create a Cloudinary account, set the following variables with the values from your account:
    -   CLOUDINARY_NAME
    -   CLOUDINARY_KEY
    -   CLOUDINARY_SECRET
-   Run the application: `npm run dev`

## DEMO:

<br>

[Check it out!](https://rootseeker.netlify.app)
