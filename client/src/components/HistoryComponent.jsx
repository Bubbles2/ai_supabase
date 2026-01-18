import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, Clock, AlertCircle, Loader } from 'lucide-react';
import './HistoryComponent.css';

const HistoryComponent = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/history');
                setHistory(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="history-container">
                <div className="loading-state">
                    <Loader className="animate-spin" size={32} />
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-container">
                <div className="error-state">
                    <AlertCircle size={32} />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>Upload History</h2>
                <p>View your previously uploaded documents</p>
            </div>

            {history.length === 0 ? (
                <div className="empty-history">
                    <p>No files uploaded yet.</p>
                </div>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Description</th>
                            <th>Date Uploaded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="file-name">
                                        <FileText size={18} />
                                        {item.filename}
                                    </div>
                                </td>
                                <td>{item.description || '-'}</td>
                                <td>
                                    <div className="file-name" style={{ color: '#666', fontWeight: 'normal' }}>
                                        <Calendar size={14} />
                                        {formatDate(item.date_uploaded)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HistoryComponent;
