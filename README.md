# GitHub Repository Search

Full-stack application for searching GitHub repositories and saving bookmarks.

## Tech Stack

* Angular 21
* .NET 10 Web API
* C#
* JWT Authentication
* ASP.NET Core Session
* GitHub REST API

## Run the Project

### 1. Backend

From the project root:
dotnet run --project Backend/Backend.csproj

### 2. Frontend

cd Frontend
npm install
npm start

Open:
http://localhost:4200

### 3. Configure Backend URL

Before running the Frontend, update:
Frontend/src/app/environments/environment.ts
Set `apiUrl` to the Backend URL.

Example:
export const environment = {
  apiUrl: 'http://localhost:5126'
};


## Demo User
Use the following credentials on the Login screen:
Username: demo
Password: 1234

After login you can:
* Search GitHub repositories
* Bookmark repositories
* View them under **My Bookmarks**
* Remove bookmarks

## Project Structure
GitHubRepositorySearch/
├── Backend/
├── Frontend/
└── README.md

The Frontend communicates with the .NET Backend, which handles the GitHub API integration and bookmark session.
