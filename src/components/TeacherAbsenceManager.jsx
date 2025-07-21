import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TeacherAbsenceManager = () => {
  const [teacherName, setTeacherName] = useState("");
  const [date, setDate] = useState("");
  const [absences, setAbsences] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/absences`);
      setAbsences(response.data);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  };

  const handleMarkAbsent = async (e) => {
    e.preventDefault();

    if (!teacherName.trim() || !date.trim()) {
      setStatusMsg("Please provide both teacher name and date.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/absences/mark`, {
        name: teacherName,
        date: date,
      });

      setStatusMsg(response.data);
      setTeacherName("");
      setDate("");
      fetchAbsences();
    } catch (error) {
      console.error("Error marking teacher absent:", error);
      setStatusMsg(error.response?.data || "Failed to mark absence. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="p-4 border rounded shadow-sm bg-light">
        <h2 className="text-danger mb-4 fw-bold">Teacher Leave Manager</h2>

        <form onSubmit={handleMarkAbsent} className="row g-3 align-items-end mb-3">
          <div className="col-md-5">
            <label className="form-label fw-semibold">Teacher Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Teacher Name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-auto mt-md-4">
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? "Marking..." : "Mark Absent"}
            </button>
          </div>
        </form>

        {statusMsg && (
          <div className="alert alert-info mt-3" role="alert">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="mt-5">
        <h4 className="fw-bold mb-3">Leave History</h4>
        {absences.length === 0 ? (
          <div className="alert alert-secondary">No absences recorded.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Teacher</th>
                  <th>Date</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {absences.map((a, index) => {
                  const dateObj = new Date(a.date);
                  const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
                  const dateStr = dateObj.toLocaleDateString("en-GB");

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{a.name}</td>
                      <td>{dateStr}</td>
                      <td>{day}</td>
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

export default TeacherAbsenceManager;
