# Pi Demo App - Backend

An Express API server with MongoDB for storing user data and session details.

## Getting Started

> For Docker setup, see the [Docker Setup documentation](../doc/docker-setup.md).

### 1. Install dependencies

Requires Node.js (v18 LTS or v20 LTS recommended) and `yarn`.

```sh
yarn install
```

### 2. Set up environment variables

Create a `.env` file from the template:

```shell
cp .env.example .env
```

Configure the following variables:

| Variable         | Description                    | Example                 |
| ---------------- | ------------------------------ | ----------------------- |
| `SESSION_SECRET` | Random string (64+ characters) | `your_random_string`    |
| `PI_API_KEY`     | From Pi Developer Portal       | `your_api_key`          |
| `FRONTEND_URL`   | Frontend URL for CORS          | `http://localhost:3314` |

You can obtain your `PI_API_KEY` from the Pi Developer Portal. See the [Pi Developer Guide](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/) for details.

### 3. Set up MongoDB

The default MongoDB port is `27017`. Update your `.env` file if you use different credentials.

#### Option A: Using Docker (recommended)

```sh
docker run --name demoapp-mongo -d \
  -e MONGO_INITDB_ROOT_USERNAME=demoapp \
  -e MONGO_INITDB_ROOT_PASSWORD=dev_password \
  -p 27017:27017 mongo:7.0
```

Manage the container:

```sh
docker stop demoapp-mongo   # Stop
docker start demoapp-mongo  # Start
docker rm -f demoapp-mongo  # Remove (deletes all data)
```

#### Option B: Install MongoDB locally

Install MongoDB Community from the [official documentation](https://www.mongodb.com/docs/manual/administration/install-community/).

Then create a user via `mongosh`:

```javascript
var MONGODB_DATABASE_NAME = "demoapp-development";
var MONGODB_USERNAME = "demoapp";
var MONGODB_PASSWORD = "dev_password";

db.getSiblingDB("admin").createUser({
  user: MONGODB_USERNAME,
  pwd: MONGODB_PASSWORD,
  roles: [{ role: "dbOwner", db: MONGODB_DATABASE_NAME }],
});
```

### 4. Run the server

```sh
yarn start
```

If configured correctly, you should see:

```
NODE_ENV: development
Connected to MongoDB on: mongodb://localhost:27017/demoapp-development
App platform demo app - Backend listening on port 8000!
CORS config: configured to respond to a frontend hosted on http://localhost:3314
```

---

You've completed the backend setup. Return to the [development guide](../doc/development.md) to continue.
