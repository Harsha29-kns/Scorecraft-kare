import React, { useState, useEffect } from 'react';
import './Mentors.css';
import DeveloperCard from '../DeveloperCard/DeveloperCard';
import { mentors as mentorsAPI } from '../../services/firebase';
import SkeletonCard from './SkeletonCard'; // We will create this new component

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await mentorsAPI.getAll();
        setMentors(data);
      } catch (err) {
        setError('Could not fetch mentors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const renderContent = () => {
    if (loading) {
      // Show 3 skeleton cards while loading
      return Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return mentors.map((mentor, index) => (
      <DeveloperCard
        key={mentor.id}
        name={mentor.name}
        role={mentor.role}
        image={mentor.imageUrl}
        linkedin={mentor.linkedin}
        delay={index * 0.1}
      />
    ));
  };

  return (
    <section className="mentors-section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Our Mentors</h1>
          <p className="section-description">
            Meet the esteemed faculty who guide and support our community. Their expertise and dedication are instrumental to our success.
          </p>
        </div>
        <div className="mentors-grid">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Mentors;