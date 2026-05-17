//src/pages/Home/index.tsx (SL_SC_01)

import HomeSkeleton from './HomeSkeleton';
// import CameraView from './CameraView';
// import SubtitleArea from './SubtitleArea';

function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <HomeSkeleton />
    </div>
  );
}

export default Home;