import React from 'react';

const Home = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded-4 border border-2 border-primary">
        <h1 className="display-4 fw-bold text-primary mb-3 welcome-text">
          Welcome to <span className="text-info">School Time-Table Generator</span>
        </h1>
        <p className="lead text-muted mb-4">
          Plan your weekly school schedule easily and effectively.
        </p>
      
      </div>
    </div>
  );
};

export default Home;
