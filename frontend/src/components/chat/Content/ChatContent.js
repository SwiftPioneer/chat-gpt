import React from 'react';

import '../../../styles/components/chat/Content.css';

const ChatContent = ({ containerRef, chatContents}) => {
  return (
    <div ref={containerRef} className='chat-content-container'>
      {chatContents}
    </div>
  );
};

export default ChatContent;