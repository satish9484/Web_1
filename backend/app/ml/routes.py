from flask import Blueprint, request, jsonify , render_template_string
import os
from app.auth.token import token_required , admin_required
from app.models import UserActivity
from .feature_details import URLDetailExtraction 
from .predict import prediction

ml_blueprint = Blueprint('ml', __name__)


@ml_blueprint.route('/health', methods=['GET'])
@token_required
def health():
    return jsonify({'message': 'Aye Aye Captain'}), 200


@ml_blueprint.route('/feature-detail', methods=['Post'])
@token_required
def feature_extraction(user_id):
    data = request.get_json()
    url = data.get('url')
    obj = URLDetailExtraction(url)

    feature_details_dict = obj.get_detailed_info()

    predict_details = UserActivity.get_latest_by_url(url)
    print(predict_details.__dict__)
    if predict_details:
        feature_details_dict["ml_details"] = predict_details.details['probabilities']
        feature_details_dict["ml_feature"] = predict_details.details['feature_importances']

    else:
        feature_details_dict["ml_details"] = None
        feature_details_dict["ml_feature"] = None

    if feature_details_dict:
        return jsonify({"success":True , "detail" : [feature_details_dict]}), 200
    
    
    return jsonify({'message': f'Details for this url : {url} Not found ',"success":False}), 404


@ml_blueprint.route('/predict', methods=['Post'])
@token_required
def url_prediction(user_id):
    data = request.get_json()
    url = data.get('url')
    model = "stacking"
    result  = prediction(url,model,user_id)

    if result:
        return jsonify({"success":True ,"result" : result}), 200
    
    return jsonify({'message': f'Prediction for this url : {url} Not found ',"success":False}), 404

@ml_blueprint.route('/get-report', methods=['GET'])
@admin_required
def get_report():
    report_path = os.path.join("app", "Templates", "EDA.html" ) 
    with open(report_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    return render_template_string(html_content)