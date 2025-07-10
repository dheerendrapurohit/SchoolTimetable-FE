import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">School Timetable</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/classrooms">Classrooms</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/periods">Periods</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/subjects">Subjects</NavLink>
            </li>

            {/* Teachers Dropdown */}
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Teachers
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/teachers">Manage Teachers</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/manageteachers">Manage Full Day Absence</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/managehalfday">Manage Half Day Absence</NavLink>
                </li>
              </ul>
            </li>

            {/* Timetable Dropdown */}
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Time Table
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/weektimetable">Weekly Time Table</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/timetable">Time Table Lists</NavLink>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
