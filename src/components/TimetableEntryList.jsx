import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const TimetableEntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const columnDefs = useMemo(() => [
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 70 },
    { field: "date", headerName: "Date" },
    { field: "day", headerName: "Day" },
    { field: "period.name", headerName: "Period", valueGetter: params => params.data.period?.name || "-" },
    { field: "classroom.name", headerName: "Classroom", valueGetter: params => params.data.classroom?.name || "-" },
    { field: "subject.name", headerName: "Subject", valueGetter: params => params.data.subject?.name || "-" },
    { field: "teacher.name", headerName: "Teacher", valueGetter: params => params.data.teacher?.name || "-" }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
    resizable: true
  }), []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/timetable`);
      setEntries(res.data.map(entry => ({
        ...entry,
        day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "long" }),
        date: new Date(entry.date).toLocaleDateString("en-GB"),
      })));
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateThisWeek = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/timetable/generate`);
      setStatus("✅" + res.data);
      fetchAll();
    } catch (err) {
      console.error("Failed to generate timetable:", err);
      setStatus("❌ Error generating timetable.");
    } finally {
      setLoading(false);
    }
  };

  const generateBetweenDates = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/timetable/generate-between?startDate=${startDate}&endDate=${endDate}`
      );
      setStatus("✅ " + res.data);
      fetchAll();
    } catch (err) {
      console.error("Failed to generate timetable:", err);
      setStatus("❌ Error generating timetable.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timetable/download-latest-excel`);
      if (!response.ok) throw new Error("Download failed.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "timetable.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download Excel file.");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="container my-5">
      <div className="border rounded p-4 shadow-sm bg-light">
        <h2 className="text-primary fw-bold mb-4">Weekly Timetable</h2>

        <div className="row g-3 mb-3 align-items-end">
          <div className="row g-3 mb-3 align-items-end">
  <div className="col-auto">
    <button className="btn btn-success" onClick={generateThisWeek} disabled={loading}>
      {loading ? "Generating..." : "Generate This Week"}
    </button>
  </div>
  <div className="col-auto">
    <button className="btn btn-primary" onClick={downloadExcel} disabled={loading}>
      {loading ? "Preparing..." : "Download Excel"}
    </button>
  </div>
</div>

          
          
        </div>

        <div className="row g-3 mb-4 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-auto">
            <button
              className="btn btn-warning mt-md-4"
              onClick={generateBetweenDates}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Custom Range"}
            </button>
          </div>
        </div>

        {status && (
          <div className={`alert ${status.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
            {status}
          </div>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="alert alert-info">Loading timetable...</div>
        ) : entries.length === 0 ? (
          <div className="alert alert-warning">No timetable entries found.</div>
        ) : (
          <div className="ag-theme-alpine mt-3" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={entries}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableEntryList;

