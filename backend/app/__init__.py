import os
import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail  # Import Flask-Mail
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load SECRET_KEY from environment variable
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'Vct6GGjJ8LKcBwjSNAzY')

# Use the DATABASE_URL environment variable for PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://satish:1234@db:5432/ml_website1'

# Enable CORS for the entire app
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Initialize the database
db = SQLAlchemy(app)

# Flask-Mail Configuration
app.config['MAIL_SERVER']=os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_DEFAULT_SENDER'] ='pansara52@gmail.com'
# Initialize Flask-Mail
mail = Mail(app)



# Import blueprints
from app.models import User
from app.auth.routes import auth_blueprint
from app.ml.routes import ml_blueprint
from app.admin.routes import admin_blueprint
from app.query.routes import user_query_blueprint
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(ml_blueprint, url_prefix='/ml')
app.register_blueprint(admin_blueprint, url_prefix='/admin')
app.register_blueprint(user_query_blueprint, url_prefix='/user_query')

# Import the User model


def create_default_admin():
    """Create an admin user if no admin exists in the database."""
    try:
        # Check if any admin user exists
        admin_exists = User.query.filter_by(role='admin').first()
        
        if not admin_exists:
            # Create the admin user
            admin_user = User(
                full_name='satish',
                email='pansara52@gmail.com',
                role='admin'
            )
            # Hash the password before saving
            admin_user.password_hash = generate_password_hash('1234@')
            
            # Add and commit the admin user to the database
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")

# Retry connecting to the database with a delay
attempts = 5
for attempt in range(attempts):
    try:
        with app.app_context():
            db.create_all()  # Create all tables
            create_default_admin()  # Check and create the admin user if needed
        print("Connected to the database and created tables successfully.")
        break
    except OperationalError as e:
        print(f"Attempt {attempt + 1} of {attempts}: Database connection failed. Retrying in 5 seconds...")
        time.sleep(5)
else:
    print("Failed to connect to the database after multiple attempts.")
