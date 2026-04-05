# Virasat - Heritage Platform

A modern web platform for preserving and exploring cultural heritage, built with React, Node.js, and powered by AI.

## 🚀 Features

- **AI-Powered Heritage Chat**: Interactive chat interface for exploring cultural heritage
- **Document Processing**: Advanced document analysis and indexing
- **E-commerce Integration**: Razorpay payment integration for heritage items
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Search & Discovery**: Intelligent search capabilities for heritage content

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Router** - Client-side routing
- **Zustand** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Cloudinary** - Image and file storage
- **Razorpay** - Payment processing
- **Puppeteer** - Web scraping and automation
- **Google Generative AI** - AI integration

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend .env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev
   ```

## 🌐 Deployment

This project is configured for deployment on Render:

- **Backend**: Node.js service
- **Frontend**: Static site

### Environment Variables for Render
Set these in your Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_AI_API_KEY`
- `NODE_ENV=production`

## 📁 Project Structure

```
Virasat-main/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── server.js # Main server file
│   │   └── ...       # API routes and middleware
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Powered by AI for heritage preservation
- Designed for cultural heritage exploration