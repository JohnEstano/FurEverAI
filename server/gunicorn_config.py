# Gunicorn configuration for Render deployment

# Server socket
bind = "0.0.0.0:10000"  # Render uses port 10000 by default
backlog = 2048

# Worker processes
workers = 2  # Adjust based on your plan (2 for free tier)
worker_class = 'sync'
worker_connections = 1000
timeout = 120
keepalive = 5

# Process naming
proc_name = 'fureverai-backend'

# Logging
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
loglevel = 'info'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (Render handles SSL, so we don't need it here)
keyfile = None
certfile = None
