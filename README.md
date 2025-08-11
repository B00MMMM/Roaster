# Roaster App

AI-powered roast generator with MongoDB Atlas and Groq API integration.

## 🚀 Deployment

This app is configured for deployment on Render.

### Environment Variables Required:
- `MONGO_URI`: MongoDB Atlas connection string
- `GROQ_API_KEY`: Primary Groq API key
- `GROQ_API_KEY_BACKUP`: Backup Groq API key
- `AI_MODEL`: llama3-8b-8192
- `AI_TIMEOUT`: 15000
- `PORT`: Auto-set by Render

### Features:
- AI roast generation with fallback system
- 112+ database roasts
- Contact form with feedback storage
- Category-based roast filtering
- Auto-scroll to results
- Responsive design

## 🛠️ Tech Stack:
- **Backend**: Node.js, Express, MongoDB Atlas
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Groq API with dual key fallback
- **Deployment**: Render (free tier)
