import React from 'react';

import '../../styles/components/chat/ChatTitle.css';

const ChatTitle = ({ chatTitle }) => {
  return (
    <div className='chat-title-container'>
        <div className='chat-title'>
            { chatTitle }
        </div>
        <div className='chat-title-line'></div>
    </div>
  );
};

export default ChatTitle;