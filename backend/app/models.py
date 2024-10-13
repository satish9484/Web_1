from app import db
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import JSON  # Use this if you're using PostgreSQL; otherwise, use db.JSON

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), default='user')  # 'user' or 'admin'
    otp = db.Column(db.String(6), nullable=True)  # Stores the OTP code
    otp_expires = db.Column(db.DateTime, nullable=True)  # OTP expiry time

    # Relationships
    activities = db.relationship('UserActivity', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_otp(self):
        from random import randint
        self.otp = str(randint(100000, 999999))  # Generates a 6-digit OTP
        self.otp_expires = datetime.utcnow() + timedelta(minutes=5)  # OTP valid for 5 minutes

    def clear_otp(self):
        self.otp = None
        self.otp_expires = None


class UserActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    model = db.Column(db.String(255), nullable=False)
    result = db.Column(db.String(255), nullable=False)
    details = db.Column(db.JSON, nullable=True)  # Column to store JSON data
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, user_id, url, result, model, details=None):
        self.user_id = user_id
        self.url = url
        self.result = result
        self.model = model
        self.details = details

    @classmethod
    def get_latest_by_url(cls, url):
        return cls.query.filter_by(url=url).order_by(desc(cls.timestamp)).first()

class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def __init__(self, question, answer):
        self.question = question
        self.answer = answer


class FAQComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    faq_id = db.Column(db.Integer, nullable=False)
    user_email = db.Column(db.String(120), nullable=False)  # Store user email instead of user ID
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, faq_id, user_email, comment):
        self.faq_id = faq_id
        self.user_email = user_email  # Use user email
        self.comment = comment


class UserQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, user_email, subject, body):
        self.user_email = user_email
        self.subject = subject
        self.body = body