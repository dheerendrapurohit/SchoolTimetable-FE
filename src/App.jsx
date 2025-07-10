import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import ClassroomList from './components/ClassroomList';
import PeriodList from './components/PeriodList';
import SubjectList from './components/SubjectList';
import TeacherList from './components/TeacherList';
import TeacherAbsenceManager from './components/TeacherAbsenceManager';
import TimetableEntryList from './components/TimetableEntryList';
import WeeklyTimetableView from './components/WeeklyTimetableView';
import HalfDayLeave from './components/HalfDayLeave';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classrooms" element={<ClassroomList />} />
          <Route path="/periods" element={<PeriodList />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/manageteachers" element={<TeacherAbsenceManager />} />
          <Route path="/managehalfday" element={<HalfDayLeave/>} />
          <Route path="/weektimetable" element={<WeeklyTimetableView />} />
          <Route path="/timetable" element={<TimetableEntryList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
