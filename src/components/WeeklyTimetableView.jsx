import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];


const WeeklyTimetableView = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState([]);
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
    const res = await axios.get(`${API_BASE_URL}/api/timetable/week/class/${className}`);
    console.log("🧾 Weekly Timetable Data:", res.data);
    setTimetable(res.data);
  } catch (err) {
    console.error("Failed to fetch weekly class timetable:", err);
  } finally {
    setLoading(false);
  }
};

const buildTableCell = (day, periodName) => {
  const entry = timetable.find((e) => {
    const entryDay = new Date(e.date).toLocaleDateString("en-US", { weekday: "long" });
    const match = entryDay === day && e.period?.name === periodName;
    return match;
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
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Weekly Timetable</h2>

      <div className="mb-4 d-flex gap-3 align-items-center">
        <label htmlFor="classSelect" className="form-label mb-0">Select Class:</label>
        <select
          id="classSelect"
          className="form-select w-auto"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">-- Choose Class --</option>
          {classrooms.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading timetable...</p>
      ) : selectedClass && timetable.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light ">
              <tr>
                <th>Period / Day</th>
                {daysOfWeek.map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period}>
                  <th>{period}</th>
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
      ) : selectedClass ? (
        <p>No timetable entries found for selected class.</p>
      ) : null}
    </div>
  );
};

export default WeeklyTimetableView;
