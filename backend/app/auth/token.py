import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app , request , jsonify
from functools import wraps

def encode_token(user_id, role, email , full_name):
    now = datetime.now(timezone.utc)
    
    payload = {
        'exp': now + timedelta(minutes=30),
        'iat': now,
        'sub': user_id,
        'role': role,
        'email':email,
        'full_name':full_name
    }
    
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token.decode('utf-8')


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        user_id = decode_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired!'}), 401

        # Add user_id to kwargs to pass to the route
        return f(user_id=user_id, *args, **kwargs)

    return decorated_function


def decode_token(token):
    if isinstance(token, bytes):
        token = token.decode('utf-8')  # Decode bytes to string

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            if payload.get('role') != 'admin':
                return jsonify({'message': 'Admin access required!'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 403
        return f(*args, **kwargs)
    return decorated
