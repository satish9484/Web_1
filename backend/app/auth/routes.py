from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from werkzeug.security import check_password_hash
from app.auth.token import encode_token, admin_required
from datetime import datetime
from .otputils import send_otp_email

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')  # Default role is 'user'

    # Ensure only an admin can register another admin
    if role == 'admin' and not request.headers.get('Authorization'):
        return jsonify({'message': 'Unauthorized to create an admin account',"success":False}), 403

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists',"success":False}), 400

    user = User(full_name=full_name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': f'{role.capitalize()} registered successfully',"success":True}), 201


@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        token = encode_token(user.id, user.role, user.email ,user.full_name)
        return jsonify({'token': token, 'role': user.role,"success":True}), 200

    return jsonify({'message': 'Invalid credentials',"success":False}), 401


@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    # Invalidate the token by removing it from the client-side
    return jsonify({'message': 'Logged out successfully',"success":True}), 200


@auth_blueprint.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'No account found with this email',"success":False}), 404

    # Set OTP and expiry time
    user.set_otp()
    db.session.commit()

    # Send the OTP via email (or SMS if set up)
    send_otp_email(user.email, user.otp)

    return jsonify({'message': 'OTP sent to your email.',"success":True}), 200

@auth_blueprint.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'Invalid email',"success":False}), 404

    # Check if OTP is correct and not expired
    if user.otp != otp or user.otp_expires < datetime.utcnow():
        return jsonify({'message': 'Invalid or expired OTP',"success":False}), 400

    # Set the new password
    user.set_password(new_password)
    user.clear_otp()  # Clear OTP fields
    db.session.commit()

    return jsonify({'message': 'Password reset successfully',"success":True}), 200


@auth_blueprint.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    user_data = [{'id': u.id, 'full_name': u.full_name, 'email': u.email, 'role': u.role} for u in users]
    return jsonify({"user_data":user_data,"success":True}), 200

@auth_blueprint.route('/user/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)

    user.full_name = data.get('full_name', user.full_name)
    user.email = data.get('email', user.email)
    role = data.get('role', user.role)
    if role in ['user', 'admin']:  # Ensuring only valid roles
        user.role = role

    db.session.commit()
    return jsonify({'message': 'User updated successfully',"success":True}), 200

@auth_blueprint.route('/user/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully',"success":True}), 200