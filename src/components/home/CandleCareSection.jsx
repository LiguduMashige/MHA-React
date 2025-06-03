import React from 'react';
import { FaFire, FaRegClock, FaRegHandPaper, FaLeaf } from 'react-icons/fa';
import '../../styles/CandleCareSection.css';

const careItems = [
  {
    icon: <FaFire />,
    title: 'First Burn',
    description: 'Allow the wax to melt across the entire surface before extinguishing to prevent tunneling.'
  },
  {
    icon: <FaRegClock />,
    title: 'Burn Time',
    description: 'Never burn your candle for more than 4 hours at a time to maintain quality and safety.'
  },
  {
    icon: <FaRegHandPaper />,
    title: 'Trim the Wick',
    description: 'Trim the wick to 1/4 inch before each burn to prevent excessive smoke and uneven burning.'
  },
  {
    icon: <FaLeaf />,
    title: 'Keep Clean',
    description: 'Keep the wax pool free of wick trimmings, matches, and debris to ensure a clean burn.'
  }
];

const CandleCareSection = () => {
  return (
    <section className="care-section-container">
      <h2 className="care-section-title">Candle Care & Safety Tips</h2>
      <div className="care-items-grid">
        {careItems.map((item, index) => (
          <div className="care-item" key={index}>
            <div className="icon-container">{item.icon}</div>
            <h3 className="item-title">{item.title}</h3>
            <p className="item-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};


export default CandleCareSection;
