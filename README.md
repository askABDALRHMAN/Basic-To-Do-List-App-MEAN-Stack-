# To-Do List

A minimal MEAN-stack application to add and view to-do items stored in MongoDB.

## Requirements

- Node.js 20.19+ (or 22.12+/24+) and npm
- A MongoDB instance, such as MongoDB Atlas

## Install

From the project root, install each application's dependencies:

```powershell
Set-Location backend
npm ci
Set-Location ..\frontend
npm ci
Set-Location ..
```

Create the backend environment file:

```powershell
Copy-Item .env.example backend\.env
```

Edit `backend\.env` and set `MONGODB_URI` to your MongoDB connection string.
For Atlas, use the driver URI shown for your cluster, with the database name
`todo_list`, for example:

```dotenv
MONGODB_URI=mongodb+srv://<db_username>:<url_encoded_password>@<cluster-host>/todo_list?retryWrites=true&w=majority
PORT=3000
```

In MongoDB Atlas, create a database user and add the backend machine's IP address
under **Network Access**. URL-encode special characters in the database user's
password before placing it in the URI. Keep `backend\.env` private; it is
excluded from Git.

The backend reads `MONGODB_URI` from `backend\.env` regardless of the current
working directory. It connects to the `todo_list` database and uses the
`todos` collection.

## Run

Start the backend in one terminal:

```powershell
Set-Location backend
npm start
```

Start the Angular development server in a second terminal:

```powershell
Set-Location frontend
npm start
```

Open <http://localhost:4200>. The Angular development server proxies `/api`
requests to the backend on port 3000.

## API

- `GET /api/todos` returns the MongoDB to-do documents as a JSON array.
- `POST /api/todos` accepts a JSON body containing non-empty `text`, saves it,
  and returns the created document with HTTP 201. Missing, empty, or
  whitespace-only text returns HTTP 400.

Example request:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/todos `
  -Method Post -ContentType 'application/json' -Body '{"text":"Buy milk"}'
Invoke-RestMethod -Uri http://localhost:3000/api/todos
```

## Checks

Run backend JavaScript syntax checks:

```powershell
Set-Location backend
node --check src\server.js
node --check src\routes\todos.js
node --check src\models\todo.js
```

Build the Angular application:

```powershell
Set-Location frontend
npm run build
```

There is no automated test suite in this project. Verify API behavior and
MongoDB persistence against the configured database using the example requests:
POST an item, confirm it appears in GET, restart the backend, then GET again.
