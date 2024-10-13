import pickle
import os
import joblib
import numpy as np
from app import db
import logging
from app.models import UserActivity
from .feature_extraction import FeatureExtractionTraining
from sklearn.ensemble import BaggingClassifier , StackingClassifier
from .feature_details import URLDetailExtraction

def load_model(model_name):
    try:
        model_path = os.path.join("app", "ModelArtifacts", f"{model_name}_model.joblib") 
        logging.info(model_path)
        model_obj = joblib.load(model_path)
        return model_obj
    except FileNotFoundError:
        print(f"Error: The model file {model_name}.pkl was not found at {model_path}.")
    except pickle.UnpicklingError:
        print(f"Error: There was an issue loading the model from {model_path}.")
    except Exception as e:
        print(f"An unexpected error occurred while loading the model: {str(e)}")

def prediction(url, model_name, user_id):
    try:
        # Feature extraction from the given URL
        obj = FeatureExtractionTraining(url)
        x = np.array(obj.getFeaturesList()).reshape(1, 30)  # Ensure x has the correct shape
        model_obj = load_model(model_name)  # Updated to use model_name

        if model_obj is None:
            return {'success': False, 'Error': 'Model could not be loaded.'}

        # Perform prediction
        y_pred = model_obj.predict(x)[0]
        y_pro_phishing = model_obj.predict_proba(x)[0, 0]
        y_pro_non_phishing = model_obj.predict_proba(x)[0, 1]

        print('Prediction:', y_pred, 'Probability of Phishing:', y_pro_phishing, 'Probability of Non-Phishing:', y_pro_non_phishing)

        # Initialize a dictionary for feature importances
        mapped_features_dict = {}

        # Check if the model is a BaggingClassifier
        if isinstance(model_obj, BaggingClassifier):
            # Ensure the model has estimators
            if hasattr(model_obj, 'estimators_'):
                # Collect feature importances from each base estimator
                feature_importances = []
                for estimator in model_obj.estimators_:
                    if hasattr(estimator, 'feature_importances_'):
                        feature_importances.append(estimator.feature_importances_)
                
                if feature_importances:
                    # Average the feature importances across all estimators
                    feature_importances_mean = np.mean(feature_importances, axis=0).tolist()
                    featurelist = obj.get_method_list()
                    mapped_features_dict = dict(zip(featurelist, feature_importances_mean))
                else:
                    mapped_features_dict = {"error": "None of the base estimators have feature importance.", "success": False}
            else:
                mapped_features_dict = {"error": "The BaggingClassifier has no estimators.", "success": False}
        # Check if the model is a StackingClassifier
        elif isinstance(model_obj, StackingClassifier):
            meta_model = model_obj.final_estimator_
            
            # Check if the meta-model has feature importances
            if hasattr(meta_model, 'feature_importances_'):
                featurelist = obj.get_method_list()
                feature_importances = meta_model.feature_importances_.tolist()
                mapped_features_dict = dict(zip(featurelist, feature_importances))
                print("mapped_features_dict :",mapped_features_dict)
            else:
                mapped_features_dict = {"error": "The meta-model doesn't have feature importance!!!", "success": False}
        else:
            # Check if the model itself has feature importances
            if hasattr(model_obj, 'feature_importances_'):
                featurelist = obj.get_method_list()
                feature_importances = model_obj.feature_importances_.tolist()
                mapped_features_dict = dict(zip(featurelist, feature_importances))
            else:
                mapped_features_dict = {"error": f"This model {model_name} doesn't have feature importance!!!", "success": False}

        # Save user activity along with feature importance
        save_user_activity(y_pred, y_pro_phishing, y_pro_non_phishing, url, user_id, model_name, mapped_features_dict)

        return "Safe" if y_pred == 1 else "Not Safe"

    except AttributeError as e:
        print(f"Error: {e}. This might be due to a missing or incompatible model.")
    except ValueError as e:
        print(f"Error: {e}. This might be due to incorrect input shape or data type.")
    except Exception as e:
        print(f"An unexpected error occurred during prediction: {str(e)}")


def save_user_activity(y_pred, y_pro_phishing, y_pro_non_phishing, url, user_id,model,feature_importances=None):
    """
    Saves user activity details including the prediction results and probabilities as JSON.

    :param y_pred: The predicted label (e.g., 0 for phishing, 1 for non-phishing).
    :param y_pro_phishing: Probability that the URL is phishing.
    :param y_pro_non_phishing: Probability that the URL is non-phishing.
    :param url: The URL being classified.
    :param user_id: The ID of the user who made the classification.
    """
    try:
        obj = URLDetailExtraction(url)
        feature_details_dict = obj.get_detailed_info()
        # Prepare the details data as JSON
        details_data = {
            "predicted_label": str(y_pred),
            "probabilities": {
                "phishing": str(y_pro_phishing * 100),
                "non_phishing": str(y_pro_non_phishing * 100)
            },
            "url_data" :  feature_details_dict
        }

        if feature_importances is not None:
            details_data["feature_importances"] = feature_importances
        # Determine result message based on probabilities
        result_message= 'Not Safe'
        if y_pred ==1:
            result_message = 'Safe'

        # Create a new UserActivity record
        new_activity = UserActivity(
            user_id=user_id,
            url=url,
            result=result_message,
            model=model,
            details=details_data
        )

        # Save the new activity to the database
        db.session.add(new_activity)
        db.session.commit()

        print(f"Activity saved for user {user_id} with URL: {url}")
    except Exception as e:
        print(f"Error saving user activity: {str(e)}")
