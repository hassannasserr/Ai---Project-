# 🚗 AutoValue AI – Used Car Price Prediction System

> AI-powered used car price prediction with confidence intervals, feature importance, and similar car comparisons.

## 🏗️ Architecture

```
Frontend (React + Vite + TailwindCSS)  →  Port 5173
    ↓
Node.js API Gateway (Express)          →  Port 5000
    ↓
Python ML Service (FastAPI)            →  Port 8000
    ↓
Trained Model (RandomForest .pkl)
```

## ⚡ Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **pip**

### 1. Train the ML Model
```bash
cd ml-service
pip install -r requirements.txt

# Generate synthetic training data (or use your own dataset)
python training/generate_data.py

# Train the model
python training/train_model.py

# To use a real dataset instead:
# python training/train_model.py --data path/to/your_dataset.csv
```

### 2. Start the Python ML Service (Port 8000)
```bash
cd ml-service
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 3. Start the Node.js Backend (Port 5000)
```bash
cd server
npm install
node server.js
```

### 4. Start the React Frontend (Port 5173)
```bash
cd client
npm install
npm run dev
```

### 5. Open the App
Visit **http://localhost:5173** in your browser.

## 📁 Project Structure

```
├── client/                    # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/        # UI Components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client
│   │   ├── App.jsx            # Main layout
│   │   └── index.css          # Design system
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Node.js Express (MVC)
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   ├── middleware/             # Input validation
│   ├── services/              # ML service client
│   └── server.js              # Entry point
│
└── ml-service/                # Python FastAPI
    ├── app/                   # FastAPI application
    ├── training/              # Model training scripts
    └── artifacts/             # Trained model files
```

## 🤖 Model Performance

| Metric | Value |
|--------|-------|
| R² Score | **0.9687 (96.87%)** |
| MAE | £1,082 |
| RMSE | £1,358 |
| Algorithm | RandomForestRegressor (100 trees) |

## 🔌 API Endpoints

### Node.js Gateway (Port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Predict car price |
| GET | `/api/brands` | List supported brands |
| GET | `/api/feature-importance` | Global feature importance |
| GET | `/api/health` | Health check |

### Python ML Service (Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | ML prediction |
| GET | `/brands` | Supported brands |
| GET | `/feature-importance` | Feature importance data |

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy dist/ to Vercel
```

### Backend → Railway / Render
```bash
cd server
# Set ML_SERVICE_URL environment variable to your Python service URL
```

### Python API → Railway / Render
```bash
cd ml-service
# Use: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 🎨 Design System

- **Primary**: Deep Blue (#1A237E)
- **Success**: Green (#4CAF50)
- **Style**: Glassmorphism with backdrop blur
- **Font**: Inter (Google Fonts)
- **Cards**: 20px border radius, glass backgrounds
