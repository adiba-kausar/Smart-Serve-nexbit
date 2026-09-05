document.addEventListener("DOMContentLoaded", function () {
    const form =
        document.querySelector("#predictionForm") ||
        document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fields = form.querySelectorAll("input, select");

        const orderQuantity = Number(fields[0]?.value) || 0;
        const availableStaff = Number(fields[1]?.value) || 1;
        const kitchenCapacity = Number(fields[2]?.value) || 1;
        const preparationTime = Number(fields[3]?.value) || 10;
        const peakHour = fields[4]?.value?.toLowerCase() || "no";

        if (orderQuantity <= 0) {
            alert("Please enter a valid order quantity.");
            return;
        }

        let estimatedTime =
            (orderQuantity * preparationTime) /
            (availableStaff * kitchenCapacity);

        if (
            peakHour === "yes" ||
            peakHour === "true" ||
            peakHour.includes("peak")
        ) {
            estimatedTime += 10;
        }

        estimatedTime = Math.ceil(estimatedTime);

        let workload;
        let recommendation;

        if (orderQuantity <= 20) {
            workload = "Low";
            recommendation =
                "The kitchen can manage the orders comfortably.";
        } else if (orderQuantity <= 50) {
            workload = "Medium";
            recommendation =
                "Prepare ingredients in advance to avoid delays.";
        } else {
            workload = "High";
            recommendation =
                "Assign additional staff and increase preparation capacity.";
        }

        const resultHTML = `
            <div class="prediction-success">
                <h3>AI Prediction Result</h3>

                <p>
                    <strong>Estimated Preparation Time:</strong>
                    ${estimatedTime} minutes
                </p>

                <p>
                    <strong>Kitchen Workload:</strong>
                    ${workload}
                </p>

                <p>
                    <strong>Recommendation:</strong>
                    ${recommendation}
                </p>
            </div>
        `;

        let resultBox =
            document.querySelector("#predictionResult") ||
            document.querySelector(".prediction-result");

        if (!resultBox) {
            resultBox = document.createElement("div");
            resultBox.className = "prediction-result";
            form.insertAdjacentElement("afterend", resultBox);
        }

        resultBox.innerHTML = resultHTML;

        const history =
            JSON.parse(localStorage.getItem("smartServeHistory")) || [];

        history.push({
            date: new Date().toLocaleString(),
            orderQuantity,
            availableStaff,
            kitchenCapacity,
            preparationTime,
            peakHour,
            estimatedTime,
            workload
        });

        localStorage.setItem(
            "smartServeHistory",
            JSON.stringify(history)
        );

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});