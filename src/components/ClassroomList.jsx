import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/classrooms`);
    setClassrooms(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id === null) {
      await axios.post(`${API_BASE_URL}/api/classrooms`, { name: formData.name });
    } else {
      await axios.put(`${API_BASE_URL}/api/classrooms/${formData.id}`, { name: formData.name });
    }
    setFormData({ id: null, name: "" });
    fetchClassrooms();
  };

  const handleEdit = (classroom) => {
    setFormData(classroom);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      await axios.delete(`${API_BASE_URL}/api/classrooms/${id}`);
      fetchClassrooms();
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary fw-bold">Manage Classrooms</h2>

      <form onSubmit={handleSubmit} className="row gy-2 gx-3 align-items-center mb-4">
        <div className="col-sm-6 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter classroom name"
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
          {classrooms.length === 0 ? (
            <p className="text-muted text-center py-3">No classrooms available.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {classrooms.map((c) => (
                <li
                  key={c.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-semibold">{c.name}</span>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c.id)}
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

export default ClassroomList;
