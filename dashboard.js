document.addEventListener("DOMContentLoaded", function () {
    const history =
        JSON.parse(localStorage.getItem("smartServeHistory")) || [];

    // Get dashboard elements
    const totalPredictions = document.querySelector("#totalPredictions");
    const averageTime = document.querySelector("#averageTime");
    const highWorkload = document.querySelector("#highWorkload");
    const lastPrediction = document.querySelector("#lastPrediction");

    // Calculate dashboard data
    const total = history.length;

    const average =
        total > 0
            ? Math.round(
                  history.reduce(
                      (sum, item) =>
                          sum + Number(item.estimatedTime || 0),
                      0
                  ) / total
              )
            : 0;

    const highWorkloadCount = history.filter(function (item) {
        return (
            item.workload === "High" ||
            item.workloadStatus === "High"
        );
    }).length;

    const latest =
        total > 0 ? history[history.length - 1] : null;

    // Update dashboard cards if the IDs exist
    if (totalPredictions) {
        totalPredictions.textContent = total;
    }

    if (averageTime) {
        averageTime.textContent = average + " min";
    }

    if (highWorkload) {
        highWorkload.textContent = highWorkloadCount;
    }

    if (lastPrediction) {
        lastPrediction.textContent = latest
            ? latest.estimatedTime + " min"
            : "No data";
    }

    // Update elements using common class names
    const statValues = document.querySelectorAll(
        ".stat-value, .card-value, .dashboard-number"
    );

    if (statValues.length >= 1) {
        statValues[0].textContent = total;
    }

    if (statValues.length >= 2) {
        statValues[1].textContent = average + " min";
    }

    if (statValues.length >= 3) {
        statValues[2].textContent = highWorkloadCount;
    }

    // Update prediction table
    const tableBody = document.querySelector(
        "#predictionTableBody, #historyTableBody, tbody"
    );

    if (tableBody && history.length > 0) {
        tableBody.innerHTML = "";

        history
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(function (item, index) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.date || "Recent"}</td>
                    <td>${item.orderQuantity || 0}</td>
                    <td>${item.estimatedTime || 0} minutes</td>
                    <td>
                        <span class="status-badge">
                            ${
                                item.workload ||
                                item.workloadStatus ||
                                "Normal"
                            }
                        </span>
                    </td>
                `;

                tableBody.appendChild(row);
            });
    }

    // Update chart bars if present
    const chartBars = document.querySelectorAll(
        ".chart-bar, .bar, .progress-bar"
    );

    if (chartBars.length > 0 && history.length > 0) {
        const recentHistory = history.slice(-chartBars.length);

        const maximumTime = Math.max(
            ...recentHistory.map(function (item) {
                return Number(item.estimatedTime || 0);
            }),
            1
        );

        chartBars.forEach(function (bar, index) {
            const item = recentHistory[index];

            if (item) {
                const percentage =
                    (Number(item.estimatedTime || 0) /
                        maximumTime) *
                    100;

                bar.style.height = percentage + "%";
                bar.style.width = percentage + "%";
            }
        });
    }

    // Update AI insight
    const insightBox = document.querySelector(
        "#aiInsight, .ai-insight, .insight-box"
    );

    if (insightBox) {
        if (highWorkloadCount > 0) {
            insightBox.innerHTML = `
                <strong>AI Insight:</strong>
                ${highWorkloadCount} prediction(s) show high kitchen
                workload. Consider increasing staff or preparation capacity.
            `;
        } else if (total > 0) {
            insightBox.innerHTML = `
                <strong>AI Insight:</strong>
                Your kitchen workload is currently manageable.
                Continue monitoring order volume and preparation time.
            `;
        } else {
            insightBox.innerHTML = `
                <strong>AI Insight:</strong>
                Make your first prediction to see useful kitchen insights.
            `;
        }
    }

    // Refresh dashboard when storage changes
    window.addEventListener("storage", function () {
        location.reload();
    });
});