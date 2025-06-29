import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFileAlt, FaCog } from 'react-icons/fa';

const Admin = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadSuccess(false);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/api/upload/faq', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-0 sm:p-2 md:p-4">
            <div className="max-w-4xl w-full bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-none sm:rounded-lg shadow-lg border-0 sm:border border-primary-dark border-opacity-20 p-3 sm:p-4 md:p-6" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02))'
            }}>
                <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-primary/30 dark:border-primary-dark/40 pb-3 sm:pb-4 mb-4 sm:mb-6">
                    <FaCog className="text-xl sm:text-2xl text-primary dark:text-primary-light" />
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary dark:text-primary-light tracking-[0.1em] font-audiowide">
                        ADMIN PANEL
                    </h2>
                </div>

                <div className="bg-surface/60 dark:bg-surface-dark/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200/30 dark:border-gray-600/30">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <FaFileAlt className="text-base sm:text-lg text-primary dark:text-primary-light" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark tracking-[0.05em] font-audiowide">
                            <span className="hidden sm:inline">UPLOAD FAQ/DOCUMENTS</span>
                            <span className="sm:hidden">UPLOAD DOCS</span>
                        </h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".txt,.pdf,.doc,.docx"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full px-3 py-3 sm:px-6 sm:py-4 border-2 border-dashed border-primary/30 dark:border-primary-dark/40 rounded-lg cursor-pointer hover:border-primary/50 dark:hover:border-primary-dark/60 hover:bg-primary/5 dark:hover:bg-primary-dark/10 transition-all duration-200 group"
                            >
                                <div className="text-center">
                                    <FaUpload className="text-xl sm:text-2xl text-primary/60 dark:text-primary-light/60 group-hover:text-primary dark:group-hover:text-primary-light mx-auto mb-2 transition-colors duration-200" />
                                    <p className="text-text-primary dark:text-text-primary-dark font-medium font-ubuntu text-sm sm:text-base">
                                        {file ? (
                                            <span className="truncate max-w-[200px] sm:max-w-none inline-block">
                                                {file.name.length > 20 && window.innerWidth < 640 ? `${file.name.substring(0, 20)}...` : file.name}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Click to select file</span>
                                                <span className="sm:hidden">Select file</span>
                                            </>
                                        )}
                                    </p>
                                    <p className="text-text-secondary dark:text-text-secondary-dark text-xs sm:text-sm mt-1 font-ubuntu">
                                        <span className="hidden sm:inline">Supports: .txt, .pdf, .doc, .docx</span>
                                        <span className="sm:hidden">txt, pdf, doc, docx</span>
                                    </p>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleFileUpload}
                            disabled={!file || uploading}
                            className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold tracking-[0.05em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 font-audiowide ${!file || uploading
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : uploadSuccess
                                    ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 focus:ring-green-500'
                                    : 'bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/50 border border-primary-light/30'
                                }`}
                        >
                            {uploading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                                    <span className="hidden sm:inline">UPLOADING...</span>
                                    <span className="sm:hidden">UPLOADING</span>
                                </div>
                            ) : uploadSuccess ? (
                                <>
                                    <span className="hidden sm:inline">✓ UPLOADED SUCCESSFULLY</span>
                                    <span className="sm:hidden">✓ SUCCESS</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">UPLOAD FILE</span>
                                    <span className="sm:hidden">UPLOAD</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
