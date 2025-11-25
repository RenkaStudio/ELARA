import React from 'react';
import UploadModule from '../UploadModule';

const UploadPage = () => {
  const handleUpload = (moduleInfo) => {
    // Handle upload success - bisa redirect atau update UI
    console.log('Upload successful:', moduleInfo);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Upload Modul</h2>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <UploadModule onUpload={handleUpload} />
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Format</h3>
              <p className="text-gray-600 text-xs">
                PDF, DOCX, DOC, dan TXT.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Waktu</h3>
              <p className="text-gray-600 text-xs">
                1-3 menit per file.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Proses</h3>
              <p className="text-gray-600 text-xs">
                Membuat kuis adaptif dan ringkasan AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;