from flask import Blueprint, request, jsonify
from app import db
from app.models import User, UserActivity , FAQ , FAQComment
from app.auth.token import  admin_required , token_required
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import SQLAlchemyError

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/admin/create-super-admin', methods=['POST'])
@admin_required
def create_super_admin():
    """
    Route to create a super admin user.
    Only accessible by existing admin users.
    """
    try:
        # Get data from the request
        data = request.get_json()
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')

        # Validate the provided data
        if not full_name or not email or not password:
            return jsonify({'message': 'Full name, email, and password are required.',"success":False}), 400

        # Check if a user with the given email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'User with this email already exists.',"success":False}), 409

        # Create the super admin user
        super_admin = User(
            full_name=full_name,
            email=email,
            role='admin'  # Setting the role to super admin
        )
        # Hash the password before saving
        super_admin.password_hash = generate_password_hash(password)

        # Add and commit the new super admin to the database
        db.session.add(super_admin)
        db.session.commit()

        return jsonify({'message': 'Super admin created successfully.',"success":True}), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of any errors
        return jsonify({'message': f'Error creating super admin: {str(e)}',"success":False}), 500

@admin_blueprint.route('/users', methods=['GET'])
@admin_required
def get_users_and_activities():
    try:
        # Get all users
        users = User.query.all()

        # Prepare the list with users and their respective activities
        users_list = []
        for u in users:
            # Fetch all activities for the current user
            activities = UserActivity.query.filter_by(user_id=u.id).all()

            # Prepare activity data for the current user
            activities_data = [
                {
                    'id': activity.id,
                    'user_id': activity.user_id,
                    'url': activity.url,
                    'result': activity.result,
                    'details': activity.details,  # Assuming details is a JSON column
                    'created_at': activity.timestamp.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
                }
                for activity in activities
            ]

            # Append the user data along with their activities to the users_list
            users_list.append({
                'id': u.id,
                'full_name': u.full_name,
                'email': u.email,
                'role': u.role,
                'useractivity_data': activities_data
            })

        # Return the users with their activities in JSON format
        return jsonify({"success": True, "users_data": users_list}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@admin_blueprint.route('/user/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Invalid or missing JSON data"}), 400

        user = User.query.get_or_404(user_id)

        # Updating user details
        user.full_name = data.get('full_name', user.full_name)
        user.email = data.get('email', user.email)

        role = data.get('role', user.role)
        if role not in ['user', 'admin']:
            return jsonify({"success": False, "error": "Invalid role"}), 400
        user.role = role

        db.session.commit()
        return jsonify({'message': 'User updated successfully', "success": True}), 200

    except SQLAlchemyError as e:
        db.session.rollback()  # Rollback in case of a database error
        return jsonify({"success": False, "error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"success": False, "error": "An unexpected error occurred", "details": str(e)}), 500


@admin_blueprint.route('/user/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully', "success": True}), 200

    except SQLAlchemyError as e:
        db.session.rollback()  # Rollback in case of a database error
        return jsonify({"success": False, "error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"success": False, "error": "An unexpected error occurred", "details": str(e)}), 500



@admin_blueprint.route('/users/activity', methods=['GET'])
@admin_required
def get_users_activity():
    """
    Get all user activity logs.
    Only accessible to admin users.
    """
    try:
        # Query all user activity records from the UserActivity table
        activities = UserActivity.query.all()

        # Prepare the data to be returned as a list of dictionaries
        activities_data = []
        for activity in activities:
            activities_data.append({
                'id': activity.id,
                'user_id': activity.user_id,
                'url': activity.url,
                'result': activity.result,
                'details': activity.details,  # Assuming details is a JSON column
                'created_at': activity.timestamp.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
            })

        # Return the activities in JSON format
        return jsonify(activities_data), 200

    except Exception as e:
        return jsonify({'message': f'Error retrieving user activities: {str(e)}',"success":False}), 500
    
@admin_blueprint.route('/faqs', methods=['POST'])
@admin_required
def create_faq():
    try:
        data = request.json
        new_faq = FAQ(question=data['question'], answer=data['answer'])
        db.session.add(new_faq)
        db.session.commit()

        return jsonify({'message': 'FAQ created successfully', 'success': True}), 201

    except Exception as e:
        return jsonify({'message': f'Error creating FAQ: {str(e)}', 'success': False}), 500

@admin_blueprint.route('/faqs/<int:id>', methods=['PUT'])
@admin_required
def update_faq(id):
    try:
        faq = FAQ.query.get_or_404(id)
        data = request.json
        faq.question = data.get('question', faq.question)
        faq.answer = data.get('answer', faq.answer)
        db.session.commit()

        return jsonify({'message': 'FAQ updated successfully', 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error updating FAQ: {str(e)}', 'success': False}), 500

@admin_blueprint.route('/faqs/<int:id>', methods=['DELETE'])
@admin_required
def delete_faq(id):
    try:
        faq = FAQ.query.get_or_404(id)
        db.session.delete(faq)
        db.session.commit()

        return jsonify({'message': 'FAQ deleted successfully', 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error deleting FAQ: {str(e)}', 'success': False}), 500

@admin_blueprint.route('/faqs', methods=['GET'])
def get_faqs():
    try:
        faqs = FAQ.query.all()
        faqs_data = []
        for faq in faqs:
            faqs_data.append({
                'id': faq.id,
                'question': faq.question,
                'answer': faq.answer,
                'created_at': faq.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'updated_at': faq.updated_at.strftime('%Y-%m-%d %H:%M:%S') if faq.updated_at else None
            })

        return jsonify({'faqs': faqs_data, 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error retrieving FAQs: {str(e)}', 'success': False}), 500
    

@admin_blueprint.route('/faqs/<int:faq_id>/comment', methods=['POST'])
@token_required
def add_faq_comment(user_id, faq_id):
    try:
        # Fetch the user email using user_id
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found', 'success': False}), 404

        faq = FAQ.query.get_or_404(faq_id)
        data = request.json
        new_comment = FAQComment(faq_id=faq.id, user_email=user.email, comment=data['comment'])  # Save user email
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({'message': 'Comment added successfully', 'success': True}), 201

    except Exception as e:
        return jsonify({'message': f'Error adding comment: {str(e)}', 'success': False}), 500


@admin_blueprint.route('/faqs/<int:faq_id>/comments', methods=['GET'])
def get_faq_comments(faq_id):
    try:
        # Fetch the FAQ to ensure it exists
        faq = FAQ.query.get_or_404(faq_id)

        # Query the comments associated with the FAQ
        comments = FAQComment.query.filter_by(faq_id=faq.id).all()

        # Prepare a response list
        comments_list = [
            {
                'id': comment.id,
                'user_email': comment.user_email,  # Return user email
                'comment': comment.comment,
                'created_at': comment.created_at  # Assuming you have this field in your model
            } for comment in comments
        ]

        return jsonify({'comments': comments_list, 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error fetching comments: {str(e)}', 'success': False}), 500

