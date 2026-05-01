/**
 * AutoValue AI – Express Server Entry Point
 */
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AutoValue AI Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Predict: POST http://localhost:${PORT}/api/predict`);
});
