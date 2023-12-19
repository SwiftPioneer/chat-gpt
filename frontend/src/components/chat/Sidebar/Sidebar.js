import React from 'react';

import '../../../styles/components/chat/Sidebar.css';
import '../../../styles/components/chat/History.css';
import ImageBanner from './ImageBanner';

const Sidebar = ({ chatlistcontainerRef, chatLists}) => {
  return (
    <div className='chat-sidebar'>
      <ImageBanner imgPath="images/banner.png"/>
      <div ref={chatlistcontainerRef} className='chat-history-container'>
        {chatLists}
      </div>
      <div className='chat-sidebar-vertical-line'></div>
    </div>
  );
};

export default Sidebar;