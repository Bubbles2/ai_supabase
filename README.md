# AI Supabase Document Chat

This project is a full-stack application that allows users to upload PDF documents and chat with them using AI. It utilizes **React (Vite)** for the frontend and **Node.js (Express)** for the backend, integrated with **Supabase** for vector storage and database management, and **LangChain/OpenAI** for RAG capabilities.

## Functions Documentation

### Server-Side Codebase (`/server`)

#### API Endpoints (`index.js`)
- **`GET /`**: Health check endpoint. Returns "Document Chat API is running".
- **`POST /api/upload`**: Handles file uploads.
  - Receives a PDF file.
  - Parses text using `pdf-parse`.
  - Initializes the Vector Store with document content.
  - Saves file metadata to Supabase.
- **`POST /api/chat`**: Processes chat messages.
  - Receives a user question.
  - Uses RAG to retrieve relevant context.
  - Generates a response using OpenAI.
- **`GET /api/history`**: Retrieves the history of uploaded files from the database.

#### RAG Logic (`rag.js`)
- **`splitText(text, chunkSize, overlap)`**: Splits a long text string into smaller chunks for embedding, with configurable chunk size and overlap.
- **`initializeVectorStore(text)`**: 
  - Splits the input text.
  - Generates embeddings using `OpenAIEmbeddings`.
  - Stores the documents and embeddings in the Supabase Vector Store.
- **`chat(question)`**:
  - Checks if the vector store is initialized.
  - Retrieves relevant documents based on the question.
  - Constructs a prompt with the retrieved context.
  - Queries the OpenAI model to generate an answer.

#### Database Interactions (`db.js`)
- **`saveUpload(filename, description)`**: Inserts a record for a new file upload into the `uploads` table in Supabase.
- **`getUploads()`**: Selects all records from the `uploads` table, ordered by upload date.

### Client-Side Codebase (`/client`)

#### Main Application (`App.jsx`)
- **`App`**: Main component managing application state (`currentView`, `fileName`, `isUploading`).
- **`handleFileUpload(file)`**: 
  - Sends the selected file to the `/api/upload` endpoint.
  - Updates state upon success or failure.
  - Navigates to the chat view on success.

#### Chat Interface (`components/ChatWindow.jsx`)
- **`handleSendMessage(e)`**: 
  - Prevents default form submission.
  - Updates UI with the user's message.
  - Sends the question to `/api/chat`.
  - Displays the AI's response or an error message.
- **`scrollToBottom()`**: Automatically scrolls the chat window to the most recent message.

#### File Upload (`components/FileUpload.jsx`)
- **`handleDragOver(e)`**: Sets the drag state to true when a file is dragged over the zone.
- **`handleDragLeave(e)`**: Resets the drag state when a file leaves the zone.
- **`handleDrop(e)`**: Handles the file drop event and triggers the upload callback.
- **`handleChange(e)`**: Handles file selection via the system dialog.

#### History View (`components/HistoryComponent.jsx`)
- **`fetchHistory()`**: Internal async function (inside `useEffect`) that calls `/api/history` to load past uploads.
- **`formatDate(dateString)`**: Formats an ISO date string into a readable format (e.g., "Jan 1, 2024, 10:00 AM").

#### Navigation (`components/DropdownMenu.jsx`)
- **`toggleMenu()`**: Toggles the visibility of the dropdown menu.
- **`handleNavigate(view)`**: Changes the current view (`upload`, `chat`, `history`) and closes the menu.
