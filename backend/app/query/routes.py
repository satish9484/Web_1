from flask import Blueprint, request, jsonify
from app import db
from app.models import User, UserQuery
from app.auth.token import  admin_required , token_required
from app.auth.otputils import send_reply_email

user_query_blueprint = Blueprint('user_query', __name__)

@user_query_blueprint.route('/queries', methods=['POST'])
@token_required
def record_user_query(user_id):
    try:
        data = request.json
        subject = data.get('subject')
        body = data.get('body')
        
        # Validate the input data
        if not subject or not body:
            return jsonify({'message': 'Email, subject, and body are required.', 'success': False}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found', 'success': False}), 404
        user_email = user.email
        

        # Create a new UserQuery instance
        new_query = UserQuery(user_email=user_email, subject=subject, body=body)
        db.session.add(new_query)
        db.session.commit()

        return jsonify({'message': 'User query recorded successfully', 'success': True}), 201

    except Exception as e:
        return jsonify({'message': f'Error recording user query: {str(e)}', 'success': False}), 500


@user_query_blueprint.route('/queries', methods=['GET'])
@admin_required
def get_user_queries():
    try:
        queries = UserQuery.query.all()
        result = [{'id': query.id, 'user_email': query.user_email, 'subject': query.subject, 'body': query.body, 'timestamp': query.timestamp} for query in queries]

        return jsonify({'queries': result, 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error retrieving user queries: {str(e)}', 'success': False}), 500

@user_query_blueprint.route('/reply/<int:query_id>', methods=['POST'])
@admin_required
def get_user_query(query_id):
    try:
        # Retrieve the user query by ID
        data = request.json
        reply = data.get("reply")
        print(query_id)
        user_query = UserQuery.query.get_or_404(query_id)

        # Prepare the response data
        reply_subject = f"RE : { user_query.subject}"
        reply_body = f"Answer to your query : {user_query.body}" + "\n" + "-- " + reply

        send_reply_email(user_query.user_email,reply_subject,reply_body)

        return jsonify({'message': f"Reply to this query : {user_query.subject} successfully delivered to {user_query.user_email}", 'success': True}), 200

    except Exception as e:
        return jsonify({'message': f'Error retrieving user query: {str(e)}', 'success': False}), 500
