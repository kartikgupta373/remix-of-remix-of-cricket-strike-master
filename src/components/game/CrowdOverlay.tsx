import crowdVideo from '@/assets/crowd cheer 3.mp4';

export const CrowdOverlay = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className="absolute inset-x-0 pointer-events-none overflow-hidden"
      style={{
        top: isMobile ? '1%' : '10%',
        height: isMobile ? '55%' : '45%',
        zIndex: 0,
        scale: isMobile ? '2' : '.75',
        marginLeft: '2.4%',
      }}
    >
      {/* Single crowd video that covers the grey stadium background area */}
      <div className="w-full h-full flex items-center justify-center">
        <video
          src={crowdVideo}
          className="w-full h-full object-contain object-center"
          style={{
            filter: 'brightness(1.1) saturate(1.1)',
          }}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};
