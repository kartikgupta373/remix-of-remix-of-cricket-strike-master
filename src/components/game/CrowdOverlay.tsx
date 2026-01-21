import crowdImage from '@/assets/crowd.png';

export const CrowdOverlay = () => {
  return (
    <div 
      className="absolute inset-x-0 pointer-events-none overflow-hidden"
      style={{ 
        top: '5%',
        height: '35%',
        zIndex: 5,
      }}
    >
      {/* Single crowd image that covers the grey stadium background area */}
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={crowdImage} 
          alt="Stadium crowd" 
          className="w-full h-full object-contain object-center"
          style={{ 
            filter: 'brightness(1.1) saturate(1.1)',
          }}
        />
      </div>
    </div>
  );
};
