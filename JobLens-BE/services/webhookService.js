const axios = require("axios");

const sendWebhook = async (data) => {
    await axios.post(process.env.WEBHOOK_URL, {
        cv_data: data,
        metadata: {
            applicant_name: data.name,
            email: data.email,
            status: "prod",
            cv_processed: true,
            processed_timestamp: new Date().toISOString(),
        },
    }, {
        headers: { "X-Candidate-Email": process.env.EMAIL }
    });
};

module.exports = { sendWebhook };
