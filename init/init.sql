DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rental_db') THEN
        CREATE DATABASE rental_db;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'rental_user') THEN
        CREATE USER rental_user WITH PASSWORD 'rental_password';
    END IF;

    GRANT ALL PRIVILEGES ON DATABASE rental_db TO rental_user;
    ALTER ROLE rental_user WITH SUPERUSER;
    ALTER ROLE rental_user WITH CREATEROLE;
END
$$;