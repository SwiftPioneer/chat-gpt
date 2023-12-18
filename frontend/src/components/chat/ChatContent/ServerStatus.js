import React from 'react';

import '../../../styles/components/chat/ChatContent.css';

const ServerStatus = ({ waitingForServer }) => {
  return (
    <div className='chat-content-server-status'>
        <div className={waitingForServer ? 'loading-circle' : 'loading-done' }></div>
        <div className='loading-text'>Generating answers for you...</div>
    </div>
  );
};

export default ServerStatus;