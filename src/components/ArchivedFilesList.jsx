import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArchivedFilesList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/timetable/archives`);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching archives:", err);
      setError("Failed to load archive list.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filename) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/timetable/download/${filename}`,
        {
          responseType: "blob",
        }
      );

      // Create a blob URL and download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download the file.");
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Archived Timetable Files</h2>

      {loading && <p>Loading archives...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {files.length === 0 && !loading ? (
        <p>No archived files found.</p>
      ) : (
        <ul className="list-group">
          {files.map((file, idx) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={idx}
            >
              {file}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => downloadFile(file)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedFilesList;
