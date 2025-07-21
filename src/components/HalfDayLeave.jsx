import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const periodOptions = [
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
  { value: "P3", label: "P3" },
  { value: "P4", label: "P4" },
  { value: "P5", label: "P5" },
  { value: "P6", label: "P6" },
  { value: "P7", label: "P7" },
];

const HalfDayLeave = () => {
  const [teachers, setTeachers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    periods: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/teachers`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers", err));

    fetchLeaves();
  }, []);

  const fetchLeaves = () => {
    axios
      .get(`${API_BASE_URL}/api/absences/halfday`)
      .then((res) => setLeaves(res.data))
      .catch((err) => console.error("Error fetching half-day leaves", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePeriodChange = (selectedOptions) => {
    const selectedPeriods = selectedOptions.map((opt) => opt.value);
    setFormData({ ...formData, periods: selectedPeriods });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.periods || formData.periods.length === 0) {
      setMessage("❌ Please select at least one period.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/absences/halfday`, formData);
      setMessage("✅ " + res.data);
      setFormData({ name: "", date: "", periods: [] });
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
    <div className="container my-5">
      <div className="p-4 border rounded shadow-sm bg-light">
        <h2 className="text-danger mb-4 fw-bold">Partial Day Leave Form</h2>

        <form onSubmit={handleSubmit} className="row g-3 align-items-end mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Teacher</label>
            <select
              className="form-select"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Teacher --</option>
              {teachers.map((teacher, idx) => (
                <option key={idx} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Select Periods</label>
            <Select
              isMulti
              name="periods"
              options={periodOptions}
              value={periodOptions.filter((p) => formData.periods.includes(p.value))}
              onChange={handlePeriodChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div className="col-md-auto mt-md-4">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {message && (
          <div className={`alert mt-3 ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
      </div>

      <div className="mt-5">
        <h4 className="fw-bold mb-3">Partial Day Leave Records</h4>
        {sortedLeaves.length === 0 ? (
          <div className="alert alert-secondary">No Partial leaves recorded.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Teacher</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Periods</th>
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
                      <td>{leave.periods?.join(", ") || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HalfDayLeave;
