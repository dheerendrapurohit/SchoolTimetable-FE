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

const classOptions = ["PKG", "LKG", "UKG", "1", "2", "3", "4", "5"].map((cls) => ({
  value: cls,
  label: cls,
}));

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    availablePeriods: [],
    subjects: [],
    availableClasses: [],
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
      availableClasses: formData.availableClasses,
    };

    try {
      if (formData.id === null) {
        await axios.post(`${API_BASE_URL}/api/teachers`, payload);
      } else {
        await axios.put(`${API_BASE_URL}/api/teachers/${formData.id}`, payload);
      }

      setFormData({
        id: null,
        name: "",
        availablePeriods: [],
        subjects: [],
        availableClasses: [],
      });
      fetchTeachers();
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      availablePeriods: teacher.availablePeriods || [],
      subjects: teacher.subjects || [],
      availableClasses: teacher.availableClasses || [],
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
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Teacher Management</h2>

      <form
        onSubmit={handleSubmit}
        className="row g-3 align-items-end mb-4 p-3 bg-light rounded-4 shadow-sm border border-2 border-info"
      >
        <div className="col-md-3">
          <label className="form-label fw-semibold">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Teacher Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">Available Periods</label>
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
            placeholder="Select Periods"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-semibold">Subjects</label>
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

        <div className="col-md-3">
          <label className="form-label fw-semibold">Available Classes</label>
          <Select
            isMulti
            options={classOptions}
            value={formData.availableClasses.map((c) => ({
              value: c,
              label: c,
            }))}
            onChange={(selected) =>
              setFormData({
                ...formData,
                availableClasses: selected.map((opt) => opt.value),
              })
            }
            placeholder="Select Classes"
          />
        </div>

        <div className="col-md-auto">
          <button type="submit" className="btn btn-success">
            {formData.id === null ? "Add Teacher" : "Update"}
          </button>
        </div>
        {formData.id !== null && (
          <div className="col-md-auto">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setFormData({
                  id: null,
                  name: "",
                  availablePeriods: [],
                  subjects: [],
                  availableClasses: [],
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
            className="list-group-item list-group-item-light mb-2 rounded-3 shadow-sm border d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold text-primary">{t.name}</div>
              <div className="text-muted">
                <small>
                  <strong>Periods:</strong> {t.availablePeriods.join(", ")}
                </small>
              </div>
              <div className="text-muted">
                <small>
                  <strong>Subjects:</strong> {t.subjects.join(", ")}
                </small>
              </div>
              <div className="text-muted">
                <small>
                  <strong>Classes:</strong>{" "}
                  {t.availableClasses ? t.availableClasses.join(", ") : "—"}
                </small>
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-warning me-2"
                onClick={() => handleEdit(t)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
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
