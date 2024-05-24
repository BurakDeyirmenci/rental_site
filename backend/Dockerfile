# Base image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client

# Copy project
COPY . /code/

# Set entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Run the Django application
CMD ["gunicorn", "--chdir", "rental", "--bind", ":8000", "rental.wsgi:application"]
