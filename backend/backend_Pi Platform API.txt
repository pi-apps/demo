# Pi Demo App Backend

The only variable you need to provide is `PI_API_KEY`, which is required to authorize payments. You receive it
upon app registration. For more guidelines on registering your app refer to
the [Pi Developer Guide](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/).

`FRONTEND_URL` specifies the URL of the frontend app, which by default is `http://localhost:3314`.
Depending on sandbox settings you're using to preview demo app, you may need to change this value accordingly.

The demo app's backend uses a local MongoDB server to store user data and session details.

## Setup

### 1. Install dependencies:

You will need a working NodeJS installation, and `yarn`. **The demo app frontend isn't meant to support npm**.
In most cases, `yarn` will come along with your NodeJS installation.

Install dependencies by running `yarn install`.


### 2. Set up environment variables

The demo app's backend use several environment variables, from which most have default values. In order to specify
these, create `.env` file in the root backend directory.

Create your `.env` file from the template:

```shell
cp .env.example .env


# Edit the resulting file:
vi .env
# or:
nano .env
```

Obtain the following values from the developer portal:

**Session secret**: Generate a random string (e.g 64 alphanumeric characters).

**API key**: obtained by tapping the "Get API Key" button

![](./img/api_key.png)

Then, copy-paste those values in the following two keys of your .env file:

```
# Add your API key here:
PI_API_KEY=

# Add your session secret here:
SESSION_SECRET=
```


### 2. Set up MongoDB

The default port for MongoDB is `27017`. If you have decided to change either default port or username and password,
make sure to update environment variables in the backend `.env` file accordingly.
Additionally, you can specify MongoDB name env variable, which if not specified will be named `demo-app` by default.

**Option 1: using Docker:**

Start a MongoDB server using the following command:

```
docker run --name demoapp-mongo -d \
  -e MONGO_INITDB_ROOT_USERNAME=demoapp -e MONGO_INITDB_ROOT_PASSWORD=dev_password \
  -p 27017:27017 mongo:5.0
```

Down the road, you can use the following commands to stop and start your mongo container:

```
docker stop demoapp-mongo
docker start demoapp-mongo
```

To reinitialize everything (and **drop all the data**) you can run the following command:

```
docker kill demoapp-mongo; docker rm demoapp-mongo
```

Then, recreate the container using the `docker run` command above.


**Options 2: directly install MongoDB on your machine:**

Install MongoDB Community following the
[official documentation](https://www.mongodb.com/docs/manual/administration/install-community/).

Run the server and create a database and a user:

Open a Mongo shell by running `mongosh`, then paste the following JS code into it:

```javascript
var MONGODB_DATABASE_NAME = "demoapp-development"
var MONGODB_USERNAME = "demoapp"
var MONGODB_PASSWORD = "dev_password"

db.getSiblingDB("admin").createUser(
  {
    user: MONGODB_USERNAME,
    pwd: MONGODB_PASSWORD,
    roles: [
      {
        role: "dbOwner",
        db: MONGODB_DATABASE_NAME,
      }
    ]
  }
);
```

To preview the database, you can use Robo3T or MongoDB Compass.

### 3. Run the server

Start the server with the following command (inside of the `backend` directory): `yarn start`.

If everything is set up correctly you should see the following output in your terminal:

```
NODE_ENV: development
Connected to MongoDB on:  mongodb://localhost:27017/demoapp-development
App platform demo app - Backend listening on port 8000!
CORS config: configured to respond to a frontend hosted on http://localhost:3314
```

---
You've completed the backend setup, return to [`doc/development.md`](../doc/deployment.md) to finish setting up the demo app
