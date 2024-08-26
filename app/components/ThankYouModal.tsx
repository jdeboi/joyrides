// components/ThankYouModal.tsx

import React from "react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-6">Your submission has been received.</p>
        <button
          onClick={onClose}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
