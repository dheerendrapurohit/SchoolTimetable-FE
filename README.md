# 🖥️ School Timetable Frontend (React.js)

This is the **React.js frontend** for the School Timetable Generator system. It interacts with a Spring Boot backend via REST APIs and allows users to manage classrooms, teachers, subjects, periods, and generate timetables with support for teacher absences.

---

## 🌐 Tech Stack

- **React.js**
- **Bootstrap 5** – for responsive UI
- **AG Grid** – for advanced timetable table display and filtering
- **Axios** – for API calls
- **React Router** – for navigation between components


---

## 📌 Features

### 🧾 Data Management
- Add/Edit/Delete **Classrooms**, **Periods**, **Subjects**, and **Teachers**
- Assign subjects to teachers
- React forms with Bootstrap styles

### 📅 Timetable Display
- View weekly timetable by **class**, **teacher**, or **date**
- Filter by teacher name or class
- Generate timetable for:
  - This week
  - Custom start and end date
- Display using **AG Grid** with sorting, filtering, and column visibility

### 📤 Excel Export
- Download most recent Excel file of weekly timetable
- View and download past weekly timetables via dropdown

### 🧑‍🏫 Absence Management
- Mark **full-day** or **half-day** teacher absences
- Automatically handled in backend and reflected in UI

---

## 🛠️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/dheerendrapurohit/SchoolTimetable-FE.git
   cd SchoolTimetable-FE

2.Install dependencies:

npm install

3.Set API URL in .env file:

VITE_API_BASE_URL=http://localhost:8080

4.Run the app:

npm run dev

