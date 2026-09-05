const SmartServeAPI = {
    // Get all saved predictions
    getPredictions: function () {
        return JSON.parse(
            localStorage.getItem("smartServeHistory")
        ) || [];
    },

    // Save a new prediction
    savePrediction: function (prediction) {
        const predictions = this.getPredictions();

        predictions.push({
            id: Date.now(),
            date: new Date().toLocaleString(),
            ...prediction
        });

        localStorage.setItem(
            "smartServeHistory",
            JSON.stringify(predictions)
        );

        return predictions;
    },

    // Delete all prediction history
    clearPredictions: function () {
        localStorage.removeItem("smartServeHistory");
    },

    // Calculate average preparation time
    getAveragePreparationTime: function () {
        const predictions = this.getPredictions();

        if (predictions.length === 0) {
            return 0;
        }

        const totalTime = predictions.reduce(function (total, item) {
            return total + Number(item.estimatedTime || 0);
        }, 0);

        return Math.round(totalTime / predictions.length);
    },

    // Count high-workload predictions
    getHighWorkloadCount: function () {
        const predictions = this.getPredictions();

        return predictions.filter(function (item) {
            return (
                item.workload === "High" ||
                item.workloadStatus === "High"
            );
        }).length;
    },

    // Get dashboard summary
    getSummary: function () {
        const predictions = this.getPredictions();

        return {
            totalPredictions: predictions.length,
            averagePreparationTime:
                this.getAveragePreparationTime(),
            highWorkloadPredictions:
                this.getHighWorkloadCount(),
            latestPrediction:
                predictions.length > 0
                    ? predictions[predictions.length - 1]
                    : null
        };
    }
};

// Make API available throughout the website
window.SmartServeAPI = SmartServeAPI;