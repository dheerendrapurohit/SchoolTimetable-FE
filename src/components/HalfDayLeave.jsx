import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HalfDayLeave = () => {
  const [teachers, setTeachers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    session: "AM"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/teachers`)
      .then(res => setTeachers(res.data))
      .catch(err => console.error("Error fetching teachers", err));

    fetchLeaves();
  }, []);

  const fetchLeaves = () => {
    axios.get(`${API_BASE_URL}/api/absences/halfday`)
      .then(res => setLeaves(res.data))
      .catch(err => console.error("Error fetching half-day leaves", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/absences/halfday`, formData);
      setMessage("✅ " + res.data);
      setFormData({ name: "", date: "", session: "AM" });
      fetchLeaves();
    } catch (err) {
      setMessage("❌ Failed to mark half-day leave.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedLeaves = [...leaves].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Mark Half-Day Leave</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Teacher --</option>
            {teachers.map((teacher, idx) => (
              <option key={idx} value={teacher.name}>{teacher.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            name="session"
            value={formData.session}
            onChange={handleChange}
            required
          > 
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <div className="col-auto">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {message && (
        <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <h4 className="mt-4">Half-Day Leave Records</h4>
      {sortedLeaves.length === 0 ? (
        <p>No half-day leaves recorded.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Teacher</th>
              <th>Date</th>
              <th>Day</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaves.map((leave, index) => {
              const dateObj = new Date(leave.date);
              const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
              const dateStr = dateObj.toLocaleDateString("en-GB");

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{leave.name}</td>
                  <td>{dateStr}</td>
                  <td>{day}</td>
                  <td>{leave.session}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HalfDayLeave;
