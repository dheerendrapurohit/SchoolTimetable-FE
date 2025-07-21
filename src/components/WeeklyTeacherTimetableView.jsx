import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];

const WeeklyTeacherTimetableView = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/teachers`);
      setTeachers(res.data); // each teacher should have id and name
    } catch (err) {
      console.error("Error loading teachers", err);
    }
  };

  const fetchTimetable = async (teacherId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/timetable/week/teacher/${teacherId}`);
      console.log("📘 Weekly Teacher Timetable:", res.data);
      setTimetable(res.data);
    } catch (err) {
      console.error("Failed to fetch teacher timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const buildTableCell = (day, periodName) => {
    const entry = timetable.find((e) => {
      const entryDay = new Date(e.date).toLocaleDateString("en-US", { weekday: "long" });
      return entryDay === day && e.period?.name === periodName;
    });
    return entry ? `${entry.subject?.name || ""} (${entry.classroom?.name || ""})` : "-";
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacherId) {
      fetchTimetable(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  return (
    <div className="container my-5">
      <div className="p-4 border rounded shadow-sm bg-light">
        <h2 className="text-success mb-4">Weekly Teacher Timetable</h2>

        <div className="row mb-4">
          <div className="col-md-5 d-flex align-items-center">
            <label htmlFor="teacherSelect" className="form-label me-2 mb-0 fw-semibold">
              Select Teacher:
            </label>
            <select
              id="teacherSelect"
              className="form-select"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="">-- Choose Teacher --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="alert alert-info">Loading timetable...</div>
        ) : selectedTeacherId && timetable.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-secondary">
                <tr>
                  <th className="bg-light">Period / Day</th>
                  {daysOfWeek.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period}>
                    <th className="bg-light">{period}</th>
                    {daysOfWeek.map((day) => (
                      <td key={`${period}-${day}`}>{buildTableCell(day, period)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedTeacherId ? (
          <div className="alert alert-warning">No timetable found for selected teacher.</div>
        ) : null}
      </div>
    </div>
  );
};

export default WeeklyTeacherTimetableView;
