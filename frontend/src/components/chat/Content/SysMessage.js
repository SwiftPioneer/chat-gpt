import React from "react";
import ServerStatus from "./ServerStatus";

export const SysMessage = ({chatMsg, initialStatus}) => {
    return (
      <div className='chat-content-server-status'>
        <ServerStatus status = {initialStatus}/>
        <div className='loading-text'>{chatMsg}</div>
      </div>
    );
}