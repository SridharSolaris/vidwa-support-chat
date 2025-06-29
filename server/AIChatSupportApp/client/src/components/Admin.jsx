import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/api/upload/faq', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">Admin - Upload FAQ/Document</h2>
            <div className="flex items-center">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    onClick={handleFileUpload}
                    className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Upload
                </button>
            </div>
        </div>
    );
};

export default Admin;
