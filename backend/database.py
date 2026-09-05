import sqlite3
from datetime import datetime

DATABASE_NAME = "smartserve.db"


def get_connection():
    """
    Create and return a connection to the SQLite database.
    """
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    """
    Create required database tables if they do not exist.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_quantity INTEGER NOT NULL,
            available_staff INTEGER NOT NULL,
            kitchen_capacity INTEGER NOT NULL,
            preparation_time REAL NOT NULL,
            peak_hour TEXT NOT NULL,
            estimated_time REAL NOT NULL,
            workload TEXT NOT NULL,
            recommendation TEXT,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def save_prediction(
    order_quantity,
    available_staff,
    kitchen_capacity,
    preparation_time,
    peak_hour,
    estimated_time,
    workload,
    recommendation
):
    """
    Save a prediction into the database.
    """
    connection = get_connection()
    cursor = connection.cursor()

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO predictions (
            order_quantity,
            available_staff,
            kitchen_capacity,
            preparation_time,
            peak_hour,
            estimated_time,
            workload,
            recommendation,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_quantity,
        available_staff,
        kitchen_capacity,
        preparation_time,
        peak_hour,
        estimated_time,
        workload,
        recommendation,
        created_at
    ))

    connection.commit()

    prediction_id = cursor.lastrowid

    connection.close()

    return prediction_id


def get_all_predictions():
    """
    Get all saved predictions from the database.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM predictions
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    predictions = []

    for row in rows:
        predictions.append(dict(row))

    return predictions


def get_prediction_by_id(prediction_id):
    """
    Get one prediction using its ID.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM predictions
        WHERE id = ?
    """, (prediction_id,))

    row = cursor.fetchone()

    connection.close()

    if row:
        return dict(row)

    return None


def delete_prediction(prediction_id):
    """
    Delete one prediction from the database.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM predictions
        WHERE id = ?
    """, (prediction_id,))

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    return deleted > 0


def clear_predictions():
    """
    Delete all predictions from the database.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM predictions
    """)

    connection.commit()
    connection.close()


def get_dashboard_summary():
    """
    Return summary data for the dashboard.
    """
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM predictions
    """)

    total = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT AVG(estimated_time) AS average_time
        FROM predictions
    """)

    average_time = cursor.fetchone()["average_time"]

    cursor.execute("""
        SELECT COUNT(*) AS high_workload
        FROM predictions
        WHERE workload = 'High'
    """)

    high_workload = cursor.fetchone()["high_workload"]

    connection.close()

    return {
        "totalPredictions": total,
        "averagePreparationTime": round(
            average_time if average_time else 0,
            2
        ),
        "highWorkloadPredictions": high_workload
    }


# Run this file directly to create the database
if __name__ == "__main__":
    create_tables()

    print("SmartServe AI database created successfully.")
    print("Database file:", DATABASE_NAME)