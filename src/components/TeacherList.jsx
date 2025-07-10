import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const periodOptions = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"].map((p) => ({
  value: p,
  label: p,
}));

const subjectOptions = [
  "English",
  "Mathematics",
  "Science",
  "Kannada",
  "SocialStudies",
  "Computer",
  "Drawing",
  "Yoga",
].map((s) => ({
  value: s,
  label: s,
}));

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    availablePeriods: [],
    subjects: [],
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      availablePeriods: formData.availablePeriods,
      subjects: formData.subjects,
    };

    try {
      if (formData.id === null) {
        await axios.post(`${API_BASE_URL}/api/teachers`, payload);
      } else {
        await axios.put(`${API_BASE_URL}/api/teachers/${formData.id}`, payload);
      }

      setFormData({ id: null, name: "", availablePeriods: [], subjects: [] });
      fetchTeachers();
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      availablePeriods: teacher.availablePeriods,
      subjects: teacher.subjects,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/teachers/${id}`);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Teacher List</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Teacher Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="col-md-4">
          <Select
            isMulti
            options={periodOptions}
            value={formData.availablePeriods.map((p) => ({
              value: p,
              label: p,
            }))}
            onChange={(selected) =>
              setFormData({
                ...formData,
                availablePeriods: selected.map((opt) => opt.value),
              })
            }
            placeholder="Select Available Periods"
          />
        </div>

        <div className="col-md-4">
          <Select
            isMulti
            options={subjectOptions}
            value={formData.subjects.map((s) => ({
              value: s,
              label: s,
            }))}
            onChange={(selected) =>
              setFormData({
                ...formData,
                subjects: selected.map((opt) => opt.value),
              })
            }
            placeholder="Select Subjects"
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
              onClick={() =>
                setFormData({
                  id: null,
                  name: "",
                  availablePeriods: [],
                  subjects: [],
                })
              }
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <ul className="list-group">
        {teachers.map((t) => (
          <li
            key={t.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{t.name}</strong>
              <div>
                <small className="text-muted">
                  Periods: {t.availablePeriods.join(", ")}
                </small>
              </div>
              <div>
                <small className="text-muted">
                  Subjects: {t.subjects.join(", ")}
                </small>
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(t)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(t.id)}
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

export default TeacherList;
