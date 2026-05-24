FROM postgres:16

# Install PostGIS and pgvector extensions
# postgresql-16-postgis-3: enables spatial/geographic data support (maps, GPS, distance queries)
# postgresql-16-postgis-3-scripts: PostGIS SQL scripts and functions
# postgresql-16-pgvector: enables vector similarity search for AI/ML workloads
RUN apt-get update && apt-get install -y \
    postgresql-16-postgis-3 \
    postgresql-16-postgis-3-scripts \
    postgresql-16-pgvector \
    && rm -rf /var/lib/apt/lists/*
