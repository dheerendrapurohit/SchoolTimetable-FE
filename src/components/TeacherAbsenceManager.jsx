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
      const response = await axios.post(`${API_BASE_URL}/api/absences/mark, {
        name: teacherName,
        date: date
      }`);

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
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Manage Leaves</h2>

      <form onSubmit={handleMarkAbsent} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Teacher Name"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-danger" disabled={loading}>
            {loading ? "Marking..." : "Mark Absent"}
          </button>
        </div>
      </form>

      {statusMsg && (
        <div className="alert alert-info" role="alert">
          {statusMsg}
        </div>
      )}

      <h4 className="mt-4">Teacher Leaves</h4>
      {absences.length === 0 ? (
        <p>No absences recorded.</p>
      ) : (
        <table className="table table-bordered table-striped">
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
              const dateStr = dateObj.toLocaleDateString("en-GB"); // dd/mm/yyyy

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
      )}
    </div>
  );
};

export default TeacherAbsenceManager;