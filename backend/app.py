from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction import predict_preparation_time
from database import (
    create_tables,
    save_prediction,
    get_all_predictions,
    get_prediction_by_id,
    delete_prediction,
    clear_predictions,
    get_dashboard_summary
)

app = Flask(__name__)
CORS(app)

# Create database table when backend starts
create_tables()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SmartServe AI backend is running successfully!"
    })


# =========================
# PREDICTION API
# =========================

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No input data provided."
            }), 400

        order_quantity = float(data.get("orderQuantity", 0))
        available_staff = float(data.get("availableStaff", 1))
        kitchen_capacity = float(data.get("kitchenCapacity", 1))
        preparation_time = float(data.get("preparationTime", 10))
        peak_hour = str(data.get("peakHour", "no")).lower()

        # Validation
        if order_quantity <= 0:
            return jsonify({
                "success": False,
                "message": "Order quantity must be greater than zero."
            }), 400

        if available_staff <= 0:
            return jsonify({
                "success": False,
                "message": "Available staff must be greater than zero."
            }), 400

        if kitchen_capacity <= 0:
            return jsonify({
                "success": False,
                "message": "Kitchen capacity must be greater than zero."
            }), 400

        if preparation_time <= 0:
            return jsonify({
                "success": False,
                "message": "Preparation time must be greater than zero."
            }), 400

        # AI prediction
        result = predict_preparation_time(
            order_quantity=order_quantity,
            available_staff=available_staff,
            kitchen_capacity=kitchen_capacity,
            preparation_time=preparation_time,
            peak_hour=peak_hour
        )

        # Save prediction in SQLite
        prediction_id = save_prediction(
            order_quantity=order_quantity,
            available_staff=available_staff,
            kitchen_capacity=kitchen_capacity,
            preparation_time=preparation_time,
            peak_hour=peak_hour,
            estimated_time=result["estimatedTime"],
            workload=result["workload"],
            recommendation=result["recommendation"]
        )

        return jsonify({
            "success": True,
            "predictionId": prediction_id,
            "prediction": result
        })

    except ValueError:
        return jsonify({
            "success": False,
            "message": "Please provide valid numeric values."
        }), 400

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Unable to process prediction.",
            "error": str(error)
        }), 500


# =========================
# HISTORY API
# =========================

@app.route("/api/history", methods=["GET"])
def history():
    try:
        predictions = get_all_predictions()

        return jsonify({
            "success": True,
            "history": predictions
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Unable to fetch history.",
            "error": str(error)
        }), 500


@app.route("/api/history/<int:prediction_id>", methods=["GET"])
def single_history(prediction_id):
    prediction = get_prediction_by_id(prediction_id)

    if prediction:
        return jsonify({
            "success": True,
            "prediction": prediction
        })

    return jsonify({
        "success": False,
        "message": "Prediction not found."
    }), 404


@app.route("/api/history/<int:prediction_id>", methods=["DELETE"])
def delete_history(prediction_id):
    deleted = delete_prediction(prediction_id)

    if deleted:
        return jsonify({
            "success": True,
            "message": "Prediction deleted successfully."
        })

    return jsonify({
        "success": False,
        "message": "Prediction not found."
    }), 404


@app.route("/api/history", methods=["DELETE"])
def delete_all_history():
    clear_predictions()

    return jsonify({
        "success": True,
        "message": "Prediction history cleared successfully."
    })


# =========================
# DASHBOARD API
# =========================

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    try:
        summary = get_dashboard_summary()

        return jsonify({
            "success": True,
            "dashboard": summary
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Unable to fetch dashboard data.",
            "error": str(error)
        }), 500


# =========================
# HEALTH CHECK
# =========================

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "SmartServe AI Backend"
    })


# =========================
# START SERVER
# =========================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )