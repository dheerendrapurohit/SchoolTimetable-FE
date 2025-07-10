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
    await axios.delete(`${API_BASE_URL}/api/classrooms/${id}`);
    fetchClassrooms();
  };

return (
  <div className="container mt-5">
    <h2 className="mb-4 text-primary">Classroom List</h2>

    <form onSubmit={handleSubmit} className="mb-4 row g-2">
      <div className="col-sm-6 col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Classroom name"
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
      {classrooms.map((c) => (
        <li
          key={c.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>{c.name}</span>
          <div>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => handleEdit(c)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(c.id)}
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

export default ClassroomList;
