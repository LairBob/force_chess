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
  
  // Add no-shadow class when both white and black threats are zero
  const noShadow = whiteThreatCount === 0 && blackThreatCount === 0;
  
  return (
    <div className={`threat-indicator ${noShadow ? 'no-shadow' : ''}`}>
      <div className={`top-half ${whiteIntensityClass}`}>
        {/* Removed number display */}
      </div>
      <div className={`bottom-half ${blackIntensityClass}`}>
        {/* Removed number display */}
      </div>
    </div>
  );
};

export default ThreatIndicator; 