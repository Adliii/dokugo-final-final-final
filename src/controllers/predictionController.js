const {
  TransactionsExpenses,
  FinancialForecasts,
} = require("../models/financialForecastsModel");
const axios = require("axios"); // Jika menggunakan Flask API

const handlePrediction = async (request, h) => {
  try {
    const {
      lag_1_expenses,
      lag_2_expenses,
      amount,
      category_encoded,
      day_of_week,
      is_weekend,
    } = request.payload;

    // Kirim data ke Flask API
    const response = await axios.post(
      "https://deploy-model-715591776189.asia-southeast2.run.app/predict",
      {
        lag_1_expenses,
        lag_2_expenses,
        amount,
        category_encoded,
        day_of_week,
        is_weekend,
      }
    );

    // Ambil hasil prediksi
    const predictedExpenses = response.data;
    console.log(predictedExpenses);

    return h.response({ predicted_expenses: predictedExpenses }).code(200);
  } catch (error) {
    console.error("Prediction Error:", error);
    return h.response({ error: "Failed to get prediction" }).code(500);
  }
};

module.exports = { handlePrediction };
