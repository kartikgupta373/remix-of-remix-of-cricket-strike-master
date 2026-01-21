import crowdImage from '@/assets/crowd.png';

export const CrowdOverlay = () => {
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-0 overflow-hidden">
      {/* Single crowd image positioned at the grey background area */}
      <div 
        className="relative w-full flex justify-center items-end"
        style={{ 
          height: '40vh',
          paddingTop: '5vh',
        }}
      >
        <img 
          src={crowdImage} 
          alt="" 
          className="w-full h-auto object-cover object-bottom opacity-95"
          style={{ 
            maxHeight: '30vh',
            minWidth: '100%',
          }}
        />
      </div>
    </div>
  );
};
