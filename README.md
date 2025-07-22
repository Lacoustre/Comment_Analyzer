# Comment Analyzer

A web application that analyzes text for toxicity and sentiment using Hugging Face's Inference API.

## Setup

### Backend

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your port configuration:
   ```
   PORT=4000
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Enter text in the input field
3. Click "Analyze Text" to get the analysis results

## Technologies Used

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- API: Hugging Face Inference API