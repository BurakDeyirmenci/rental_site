
# Rental Site with Django and Docker

This project sets up a rental site using Django for the backend and Docker for containerization. The frontend includes HTML, CSS, and JavaScript.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/BurakDeyirmenci/rental_site.git
   cd rental_site
   ```

2. **Build and Start the Containers:**

   ```bash
   docker-compose up --build
   ```

3. **Create a Superuser:**

   After the containers are up, create a superuser to access the Django admin interface.

   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

## Frontend

The frontend is located in the `frontend` directory and includes the following pages:

- **Home:** `index.html`
- **Admin:** `admin.html`
- **Login:** `login.html`
- **Rentals:** `rentals.html`
- **UAVs:** `uavs.html`

## Backend

The backend is built with Django and includes the following features:

- **User Authentication:** Manage user registration and login.
- **Rental Management:** CRUD operations for rentals.
- **API Endpoints:** RESTful API for interacting with the frontend and other services.

## Configuration

- **Docker Compose:** The `docker-compose.yml` file configures the services.
- **Nginx:** The `frontend/nginx.conf` file contains the Nginx configuration for serving the frontend.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
