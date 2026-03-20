## Getting Started - Running via Docker Compose

> **Note:** This setup is intended for demo purposes only and is not suitable for production.

### 1. Set up environment variables

In the project root directory, create a `.env` file so Docker Compose can pick up your environment variables:

```shell
# Create .env from the template:
cp .env.example .env

# Edit the file:
vi .env
# or:
nano .env
```

Configure the following environment variables:

```
FRONTEND_URL=http://localhost
FRONTEND_DOMAIN_NAME=localhost

BACKEND_URL=http://localhost:8000
BACKEND_DOMAIN_NAME=localhost

PI_API_KEY=<your_api_key>
```

You can find your `PI_API_KEY` in the Pi Developer Portal. If you haven't created one yet, go to your registered app in the Pi Developer Portal and generate an API key before proceeding.

### 2. Run the Docker containers

In the project root directory, run:

```
docker-compose build
docker-compose up -d
```

To verify the containers are running:

```
docker-compose ps
```

To view container logs:

```
docker-compose logs -f <service-name>

# Example:
docker-compose logs -f reverse-proxy
```

### 3. Run your app in the Pi Sandbox

Once your app is running, return to [Step 4 of the development guide](./development.md#4-open-the-app-in-the-sandbox) to test it in the Pi Sandbox.
