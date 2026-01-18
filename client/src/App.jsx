import React, { useState } from 'react';
import axios from 'axios';
import { Upload, MessageSquare, FileText, Sparkles, ZoomIn, ZoomOut, Highlighter, Cloud } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';
import DropdownMenu from './components/DropdownMenu';
import robo from './assets/robo3.png';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('upload'); // 'upload', 'chat', 'history'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileName(file.name);
      setCurrentView('chat');
    } catch (error) {
      console.error("Upload error", error);
      setUploadError('Failed to upload file. Please ensure the server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <DropdownMenu currentView={currentView} onNavigate={setCurrentView} />
          <div className="logo">
            <MessageSquare className="logo-icon" size={28} />
            <h1>Document Chat</h1>
          </div>
        </div>
        {fileName && (
          <div className="file-badge">
            <FileText size={16} />
            <span>{fileName}</span>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentView === 'upload' && (
          <div className="upload-view">
            <div className="hero-text">
              <h2>Chat with your PDF</h2>
              <p>Upload a document and ask questions instantly.</p>
            </div>
            <FileUpload onUpload={handleFileUpload} isUploading={isUploading} />
            {uploadError && <p className="error-message">{uploadError}</p>}
          </div>
        )}

        {currentView === 'chat' && (
          <div className="chat-view">
            <ChatWindow fileName={fileName} />
          </div>
        )}

        {currentView === 'history' && (
          <div className="history-view">
            <h2>History</h2>
            <p>Chat history coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
