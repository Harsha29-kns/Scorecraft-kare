import React, { useState, useEffect } from 'react';
import './CoreTeam.css';
import DeveloperCard from '../DeveloperCard/DeveloperCard';
import { coreTeam as coreTeamAPI } from '../../services/firebase';

const CoreTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      const data = await coreTeamAPI.getAll();
      setTeamMembers(data);
      setLoading(false);
    };
    fetchTeamMembers();
  }, []);

  return (
    <section className="core-team-section">
      <div className="container">
        <h2 className="section-title">Our Core Team</h2>
        <div className="section-description">
          <p>Meet our dedicated core team members who work tirelessly to make our community thrive.</p>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mx-auto justify-center items-center text-center">
            {teamMembers.map((member, index) => (
              <DeveloperCard
                key={member.id}
                name={member.name}
                role={member.role}
                image={member.imageUrl}
                linkedin={member.linkedin}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoreTeam;