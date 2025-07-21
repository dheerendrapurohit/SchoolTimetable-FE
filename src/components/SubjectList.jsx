import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: formData.name };

    try {
      if (formData.id === null) {
        await axios.post(`${API_BASE_URL}/api/subjects`, payload);
      } else {
        await axios.put(`${API_BASE_URL}/api/subjects/${formData.id}`, payload);
      }
      setFormData({ id: null, name: "" });
      fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  const handleEdit = (subject) => {
    setFormData(subject);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/subjects/${id}`);
        fetchSubjects();
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold mb-4">Manage Subjects</h2>

      <form onSubmit={handleSubmit} className="row gy-2 gx-3 align-items-center mb-4">
        <div className="col-sm-6 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success px-4">
            {formData.id === null ? "Add" : "Update"}
          </button>
        </div>
        {formData.id !== null && (
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({ id: null, name: "" })}
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {subjects.length === 0 ? (
            <p className="text-muted text-center py-3">No subjects available.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {subjects.map((s) => (
                <li
                  key={s.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-semibold">{s.name}</span>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
