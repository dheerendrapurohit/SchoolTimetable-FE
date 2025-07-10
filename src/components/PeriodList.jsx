import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PeriodList = () => {
  const [periods, setPeriods] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    duration: "",
    session: "",
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/periods`);
    setPeriods(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      duration: Number(formData.duration),
      session: formData.session,
    };

    if (formData.id === null) {
      await axios.post(`${API_BASE_URL}/api/periods`, payload);
    } else {
      await axios.put(`${API_BASE_URL}/api/periods/${formData.id}`, payload);
    }

    setFormData({ id: null, name: "", duration: "", session: "" });
    fetchPeriods();
  };

  const handleEdit = (period) => {
    setFormData(period);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/periods/${id}`);
    fetchPeriods();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Period List</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Period name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Duration (mins)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={formData.session}
            onChange={(e) => setFormData({ ...formData, session: e.target.value })}
            required
          >
            <option value="">Select Session</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
          </select>
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
              onClick={() =>
                setFormData({ id: null, name: "", duration: "", session: "" })
              }
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <ul className="list-group">
        {periods.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{p.name}</strong> - {p.duration} mins ({p.session})
            </span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p.id)}
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

export default PeriodList;
