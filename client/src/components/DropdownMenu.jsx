import React, { useState, useRef, useEffect } from 'react';
import { Menu, Upload, MessageSquare, History, X } from 'lucide-react';
import './DropdownMenu.css';

const DropdownMenu = ({ currentView, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigate = (view) => {
        onNavigate(view);
        setIsOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-menu-container" ref={menuRef}>
            <button className="menu-toggle-btn" onClick={toggleMenu}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div className="dropdown-menu-list">
                    <div
                        className={`menu-item ${currentView === 'upload' ? 'active' : ''}`}
                        onClick={() => handleNavigate('upload')}
                    >
                        <Upload size={18} />
                        <span>Upload</span>
                    </div>
                    <div
                        className={`menu-item ${currentView === 'chat' ? 'active' : ''}`}
                        onClick={() => handleNavigate('chat')}
                    >
                        <MessageSquare size={18} />
                        <span>Chat</span>
                    </div>
                    <div
                        className={`menu-item ${currentView === 'history' ? 'active' : ''}`}
                        onClick={() => handleNavigate('history')}
                    >
                        <History size={18} />
                        <span>History</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
