import React from 'react';
import './ThreatIndicator.css';

interface ThreatIndicatorProps {
  whiteThreatCount: number;
  blackThreatCount: number;
}

const ThreatIndicator: React.FC<ThreatIndicatorProps> = ({ whiteThreatCount, blackThreatCount }) => {
  // Determine the intensity class for each half based on threat count
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'no-threat';
    if (count > 5) return 'threat-5'; // Cap at 5
    return `threat-${count}`;
  };

  const whiteIntensityClass = getIntensityClass(whiteThreatCount);
  const blackIntensityClass = getIntensityClass(blackThreatCount);
  
  return (
    <div className="threat-indicator">
      <div className={`top-half ${whiteIntensityClass}`}>
        {whiteThreatCount > 0 && whiteThreatCount}
      </div>
      <div className={`bottom-half ${blackIntensityClass}`}>
        {blackThreatCount > 0 && blackThreatCount}
      </div>
    </div>
  );
};

export default ThreatIndicator; 