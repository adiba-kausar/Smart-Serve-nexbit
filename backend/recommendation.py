def generate_recommendation(
    order_quantity,
    available_staff,
    kitchen_capacity,
    preparation_time,
    peak_hour="no",
    estimated_time=None,
    workload=None
):
    """
    Generate kitchen recommendations based on prediction details.
    """

    recommendations = []

    # Staff recommendation
    if available_staff <= 2 and order_quantity > 30:
        recommendations.append(
            "Assign additional staff to manage the order volume."
        )
    elif available_staff >= 5:
        recommendations.append(
            "Staff availability is sufficient for the current orders."
        )
    else:
        recommendations.append(
            "Maintain the current staff allocation."
        )

    # Kitchen capacity recommendation
    if kitchen_capacity <= 1 and order_quantity > 30:
        recommendations.append(
            "Increase kitchen capacity or divide the orders into batches."
        )
    else:
        recommendations.append(
            "Kitchen capacity is suitable for the current workload."
        )

    # Peak-hour recommendation
    if str(peak_hour).lower() in ["yes", "true", "peak"]:
        recommendations.append(
            "Prepare ingredients before peak hours to reduce delays."
        )

    # Workload recommendation
    if workload == "High":
        recommendations.append(
            "Prioritize urgent orders and monitor preparation progress."
        )
    elif workload == "Medium":
        recommendations.append(
            "Keep ingredients ready and monitor order preparation time."
        )
    else:
        recommendations.append(
            "The kitchen workload is manageable."
        )

    # Preparation-time recommendation
    if estimated_time is not None and estimated_time > 30:
        recommendations.append(
            "Use an adaptive cooking timeline for better time management."
        )

    return {
        "recommendations": recommendations,
        "priority": (
            "High"
            if workload == "High"
            else "Medium"
            if workload == "Medium"
            else "Low"
        )
    }


if __name__ == "__main__":
    result = generate_recommendation(
        order_quantity=40,
        available_staff=3,
        kitchen_capacity=1,
        preparation_time=5,
        peak_hour="yes",
        estimated_time=43,
        workload="High"
    )

    print("SmartServe AI Recommendations")
    print("-----------------------------")

    print("Priority:", result["priority"])

    for number, recommendation in enumerate(
        result["recommendations"], start=1
    ):
        print(f"{number}. {recommendation}")