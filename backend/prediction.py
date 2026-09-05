def predict_preparation_time(
    order_quantity,
    available_staff,
    kitchen_capacity,
    preparation_time,
    peak_hour
):
    """
    SmartServe AI - preparation time prediction.
    Uses a simple rule-based scoring model suitable for the hackathon demo.
    """

    # Base preparation time
    estimated_time = preparation_time

    # Effect of order quantity
    if order_quantity > kitchen_capacity:
        extra_orders = order_quantity - kitchen_capacity
        estimated_time += extra_orders * 1.5

    # Effect of staff availability
    if available_staff <= 1:
        estimated_time *= 1.30
    elif available_staff == 2:
        estimated_time *= 1.15
    else:
        estimated_time *= 1.00

    # Effect of peak hour
    if peak_hour in ["yes", "true", "1"]:
        estimated_time *= 1.20

    # Workload calculation
    workload_score = order_quantity / (
        available_staff * kitchen_capacity
    )

    if workload_score >= 2:
        workload = "High"
        recommendation = "Increase staff or reduce incoming orders."
    elif workload_score >= 1:
        workload = "Medium"
        recommendation = "Monitor kitchen workload and staff availability."
    else:
        workload = "Low"
        recommendation = "Kitchen capacity is sufficient for current orders."

    estimated_time = round(estimated_time, 2)

    return {
        "estimatedTime": estimated_time,
        "workload": workload,
        "recommendation": recommendation
    }