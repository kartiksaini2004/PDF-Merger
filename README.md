## PDF Merger Web Application

This is a Node.js web application that allows users to upload multiple PDF files and merge them into a single PDF document.

### Features

- Upload multiple PDF files (up to 12)
- Merge uploaded PDFs into a single document
- Download the merged PDF
- Simple web interface

### Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- Multer (for handling file uploads)
- pdf-merge (for merging PDF files)
- dotenv (for environment variable management)

### Setup and Installation

1. Clone the repository
2. Install dependencies:
3. Create a `.env` file in the root directory and add your environment variables:
4. Create an `uploads` folder in the root directory

### API Endpoints

- `GET /`: Renders the upload page
- `POST /upload`: Handles PDF file uploads and merging
- `GET /loadDownload`: Renders the download page
- `GET /download`: Initiates the download of the merged PDF
- `GET /reset`: Resets the application state
