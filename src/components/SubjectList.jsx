import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
  });

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

    const payload = {
      name: formData.name,
    };

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
    try {
      await axios.delete(`${API_BASE_URL}/api/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Subject List</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Subject Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success">
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

      <ul className="list-group">
        {subjects.map((s) => (
          <li
            key={s.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span><strong>{s.name}</strong></span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(s)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
