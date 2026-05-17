//src/pages/Home/index.tsx (SL_SC_01)

import { useState } from 'react';
import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea';

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#f5f5f5', 
      overflow: 'hidden' 
    }}>
      
      {isLoading && <HomeSkeleton />}

      <div style={{ 
        display: isLoading ? 'none' : 'flex', 
        flexDirection: 'column', 
        height: '100%'
      }}>

        <main style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '20px', 
          minHeight: 0 
        }}>
          <CameraView 
            isMonitoring={true} 
            onLoaded={() => setIsLoading(false)} 
          />
        </main>
        
        <SubtitleArea />
      </div>
    </div>
  );
}

export default Home;