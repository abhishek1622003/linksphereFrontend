# LinkSphere Client

This is the client-side React application for LinkSphere, a professional networking platform.

## Deployment

### Vercel Deployment

1. **Fork/Clone this repository**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import this project
   - Set the root directory to `client`

3. **Environment Variables**
   Set these environment variables in Vercel dashboard:
   
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_API_URL=https://your-server-url.vercel.app
   ```

4. **Deploy**
   - Click "Deploy" in Vercel
   - Your app will be available at `https://your-app.vercel.app`

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase and API configuration.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Get your Firebase config from Project Settings
4. Add the config values to your environment variables

## Features

- User authentication with Firebase
- Create and view posts
- Like posts
- User profiles
- Responsive design with Tailwind CSS
- Modern React with TypeScript

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Tanstack Query
- Radix UI Components
