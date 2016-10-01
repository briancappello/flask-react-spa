# Flask API

### Development server:
```bash
export FLASK_APP=app.py
FLASK_DEBUG=1 flask run
```

### Production server:
FIXME: docker / nginx / wsgi / postgresql
```bash
export FLASK_API_SECRET='something-secret'
export FLASK_APP=app.py
export FLASK_DEBUG=0
```
