import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const periodOptions = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"].map((p) => ({
  value: p,
  label: p,
}));

const subjectOptions = [
  "English", "Mathematics", "Science", "Kannada",
  "SocialStudies", "Computer", "GK", "Yoga",
].map((s) => ({ value: s, label: s }));

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
    subjectsAndClasses: [{ subject: "", classes: "" }],
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      availablePeriods: formData.availablePeriods,
      subjectsAndClasses: formData.subjectsAndClasses,
    };

    try {
      if (formData.id === null) {
        await axios.post(`${API_BASE_URL}/api/teachers`, payload);
      } else {
        await axios.put(`${API_BASE_URL}/api/teachers/${formData.id}`, payload);
      }

      resetForm();
      fetchTeachers();
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      availablePeriods: [],
      subjectsAndClasses: [{ subject: "", classes: "" }],
    });
  };

  const handleEdit = (teacher) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      availablePeriods: teacher.availablePeriods || [],
      subjectsAndClasses: teacher.subjectsAndClasses || [{ subject: "", classes: "" }],
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

  const handleSubjectClassChange = (index, key, value) => {
    const updated = [...formData.subjectsAndClasses];
    updated[index][key] = value;
    setFormData({ ...formData, subjectsAndClasses: updated });
  };

  const addSubjectClassRow = () => {
    setFormData({
      ...formData,
      subjectsAndClasses: [...formData.subjectsAndClasses, { subject: "", classes: "" }],
    });
  };

  const removeSubjectClassRow = (index) => {
    const updated = formData.subjectsAndClasses.filter((_, i) => i !== index);
    setFormData({ ...formData, subjectsAndClasses: updated });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Teacher Management</h2>

     <form
  onSubmit={handleSubmit}
  className="p-4 mb-4 bg-white border rounded-4 shadow-sm"
>
  <h5 className="text-info fw-bold mb-3">Add / Edit Teacher</h5>

  <div className="row g-3">
    <div className="col-md-4">
      <label className="form-label fw-semibold">Name</label>
      <input
        type="text"
        className="form-control"
        placeholder="Teacher Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
    </div>

    <div className="col-md-8">
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
  </div>

  <div className="mt-4">
    <label className="form-label fw-semibold">Subjects & Classes</label>
    {formData.subjectsAndClasses.map((entry, index) => (
      <div
        key={index}
        className="row g-2 align-items-center mb-2 bg-light p-2 rounded"
      >
        <div className="col-md-5">
          <Select
            options={subjectOptions}
            value={
              entry.subject
                ? { value: entry.subject, label: entry.subject }
                : null
            }
            onChange={(selected) =>
              handleSubjectClassChange(index, "subject", selected.value)
            }
            placeholder="Select Subject"
          />
        </div>
        <div className="col-md-5">
          <Select
            options={classOptions}
            value={
              entry.classes
                ? { value: entry.classes, label: entry.classes }
                : null
            }
            onChange={(selected) =>
              handleSubjectClassChange(index, "classes", selected.value)
            }
            placeholder="Select Class"
          />
        </div>
        <div className="col-md-2 text-end">
          {index > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeSubjectClassRow(index)}
            >
              ❌
            </button>
          )}
        </div>
      </div>
    ))}

    <button
      type="button"
      className="btn btn-sm btn-outline-primary mt-2"
      onClick={addSubjectClassRow}
    >
      ➕ Add Subject-Class
    </button>
  </div>

  <div className="mt-4 d-flex gap-2">
    <button type="submit" className="btn btn-success">
      {formData.id === null ? "Add Teacher" : "Update"}
    </button>
    {formData.id !== null && (
      <button type="button" className="btn btn-secondary" onClick={resetForm}>
        Cancel
      </button>
    )}
  </div>
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
                  <strong>Subjects & Classes:</strong>{" "}
                  {t.subjectsAndClasses
                    ?.map((sc) => `${sc.subject} - ${sc.classes}`)
                    .join(", ")}
                </small>
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center">
  <button
    className="btn btn-outline-warning btn-sm px-3"
    onClick={() => handleEdit(t)}
    title="Edit"
  >
    Edit
  </button>
  <button
    className="btn btn-outline-danger btn-sm px-3"
    onClick={() => handleDelete(t.id)}
    title="Delete"
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
