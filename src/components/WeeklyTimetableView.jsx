import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];

const WeeklyTimetableView = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/classrooms`);
      setClassrooms(res.data.map(c => c.name));
    } catch (err) {
      console.error("Error loading classrooms", err);
    }
  };

  const fetchTimetable = async (className) => {
    setLoading(true);
    try {
      const [entriesRes, countRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/timetable/week/class/${className}`),
        axios.get(`${API_BASE_URL}/api/timetable/subject-count?className=${className}`)
      ]);
      setTimetable(entriesRes.data);
      setSubjectCounts(countRes.data);
    } catch (err) {
      console.error("Failed to fetch timetable or subject count:", err);
    } finally {
      setLoading(false);
    }
  };

  const buildTableCell = (day, periodName) => {
    const entry = timetable.find((e) => {
      const entryDay = new Date(e.date).toLocaleDateString("en-US", { weekday: "long" });
      return entryDay === day && e.period?.name === periodName;
    });
    return entry ? `${entry.subject?.name || ""} (${entry.teacher?.name || ""})` : "-";
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass);
    }
  }, [selectedClass]);

  return (
    <div className="container my-5">
      <h2 className="text-primary mb-4">Weekly Timetable</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="classSelect" className="form-label fw-semibold">Select Class:</label>
          <select
            id="classSelect"
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Choose Class --</option>
            {classrooms.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading timetable...</div>
      ) : selectedClass && timetable.length > 0 ? (
        <div className="row">
          {/* Timetable */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th className="bg-white">Period / Day</th>
                    {daysOfWeek.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map(period => (
                    <tr key={period}>
                      <th className="bg-white">{period}</th>
                      {daysOfWeek.map(day => (
                        <td key={`${period}-${day}`}>
                          {buildTableCell(day, period)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Count */}
          <div className="col-lg-4 col-md-12">
            {subjectCounts && Object.keys(subjectCounts).length > 0 && (
              <div className="card shadow-sm sticky-top" style={{ top: "80px" }}>
                <div className="card-header bg-success text-white fw-bold">
                  Subject Count (This Week)
                </div>
                <div className="card-body p-0">
                  <table className="table table-sm table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(subjectCounts)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([subject, count]) => (
                          <tr key={subject}>
                            <td>{subject}</td>
                            <td>{count}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : selectedClass ? (
        <div className="alert alert-warning">No timetable entries found for selected class.</div>
      ) : null}
    </div>
  );
};

export default WeeklyTimetableView;
