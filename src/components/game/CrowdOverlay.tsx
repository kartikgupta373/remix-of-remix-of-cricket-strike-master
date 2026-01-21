import crowdImage from '@/assets/crowd.png';

export const CrowdOverlay = () => {
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-0 overflow-hidden">
      {/* Main crowd band - positioned at the top of the viewport */}
      <div className="relative w-full" style={{ height: '35vh' }}>
        {/* Crowd image repeated to fill width */}
        <div 
          className="absolute inset-0 flex items-end justify-center"
          style={{ 
            paddingTop: '8vh',
          }}
        >
          {/* Left crowd section */}
          <img 
            src={crowdImage} 
            alt="" 
            className="h-auto object-cover opacity-95"
            style={{ 
              width: '40%',
              maxHeight: '22vh',
              objectPosition: 'center bottom',
            }}
          />
          {/* Center crowd section */}
          <img 
            src={crowdImage} 
            alt="" 
            className="h-auto object-cover opacity-95"
            style={{ 
              width: '40%',
              maxHeight: '22vh',
              objectPosition: 'center bottom',
            }}
          />
          {/* Right crowd section */}
          <img 
            src={crowdImage} 
            alt="" 
            className="h-auto object-cover opacity-95"
            style={{ 
              width: '40%',
              maxHeight: '22vh',
              objectPosition: 'center bottom',
            }}
          />
        </div>
      </div>
    </div>
  );
};
