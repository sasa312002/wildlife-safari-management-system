import React, { useState } from 'react';

const AddReviewModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 5);
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ rating, comment, files });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl shadow-2xl max-w-lg w-full border border-green-700">
        <div className="p-6 border-b border-green-700 flex items-center justify-between">
          <h3 className="text-xl font-abeze font-bold text-white">Add Your Review</h3>
          <button onClick={onClose} className="text-green-200 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-green-200 font-abeze mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 font-abeze"
            >
              {[5,4,3,2,1].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-green-200 font-abeze mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 font-abeze"
              placeholder="Share your experience"
            />
          </div>
          <div>
            <label className="block text-green-200 font-abeze mb-2">Photos (up to 5)</label>
            <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="text-green-100" />
            {files.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {files.map((f, idx) => (
                  <span key={idx} className="text-xs text-green-200 bg-white/10 px-2 py-1 rounded">{f.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-abeze">Cancel</button>
            <button disabled={submitting} type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-abeze">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;


