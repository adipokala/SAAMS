# SAAMS
Smart Attendance and Access Management System.

Desktop application developed using Electron - https://www.electronjs.org/

UI renderer is React - https://react.dev/

Language is Typescript - https://www.typescriptlang.org/

UI Library is Material UI - https://mui.com/material-ui/getting-started/

## Folder Structure

- saams-ui: Contains main electron app
    - src: Contains source code (entry point of electron - index.ts)
        - view: Contains react components

- Saams.Net: Contains .NET Core API
    - Saams.Api: Contains ASP.NET Core Web API project
    - Saams.EF: Contains Entity Framework project (database communication)

## Build API
Install Visual Studio 2022 with ASP.NET Core selected during installation

Initializing DB (create all tables)
- Make sure you have a database and user created in Postgres (find credentials in the code)
- Open terminal and run `dotnet tool install --global dotnet-ef`
- In Saams.EF directory, run `dotnet ef database update`

Execute the API server by clicking on the green play button in the Visual Studio

## Build UI
`cd saams-ui`

`npm install`

`npm start`