from flask_mail import Message
from app import mail  # Ensure mail is imported from the app configuration

def send_otp_email(email, otp):
    """
    Sends an OTP email using Flask-Mail.
    """
    subject = "Your OTP Code"
    message_body = f"Your OTP code is: {otp}. It is valid for 5 minutes."

    try:
        # Create the email message
        msg = Message(
            subject=subject,
            recipients=[email],  # Receiver's email address
            body=message_body
        )

        # Send the email using Flask-Mail
        mail.send(msg)
        print(f"OTP email sent successfully to {email}.")

    except Exception as e:
        print(f"Error sending email: {e}")

def send_reply_email(email, reply_subject,reply_body):
    """
    Sends an Reply email using Flask-Mail.
    """

    try:
        # Create the email message
        msg = Message(
            subject=reply_subject,
            recipients=[email],  # Receiver's email address
            body=reply_body
        )

        # Send the email using Flask-Mail
        mail.send(msg)
        print(f"reply email sent successfully to {email}.")

    except Exception as e:
        print(f"Error sending email: {e}")