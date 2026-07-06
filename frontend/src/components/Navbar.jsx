import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">DiagnoX</NavLink>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/analysis">AI Analysis</NavLink>
        <NavLink to="/wellness-hub">Wellness Hub</NavLink>
        <NavLink to="/DiseaseAwareness">Awareness</NavLink> 
      </div>
    </nav>
  );
}