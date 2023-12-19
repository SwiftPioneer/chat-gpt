import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { publish } from '../../event/event';

import 'react-toastify/dist/ReactToastify.css';

import '../../styles/global.css';
import '../../styles/layout/chat/ChatPage.css';

import ChatContent from '../../components/chat/ChatContent';
import { SysMessage } from '../../components/chat/ChatContent/SysMessage'
import ChatHistory from '../../components/chat/ChatHistory';
import ChatInput from '../../components/chat/ChatInput';

import { chopString } from '../../utils/utils';
import { API_BASE_URL } from '../../utils/const';


const ChatPage = () => {
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const chatlistcontainerRef = useRef(null);

  const [isWaiting, setIsWaiting] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [chatText, setChatText] = useState('');
  const [chatLists, setChatLists] = useState([]);
  const [chatContents, setChatContents] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [isLearnActive, setIsLearnActive] = useState(false);
  const [isSendBtnActive, setIsSendBtnActive] = useState(false);

  useEffect(() => {
    const postData = { username: "user" };
    getChatListFromSever(postData);
  }, []);

  useEffect(() => {
    refreshChatList();
  }, [selectedChat, messages]);

  const refreshChatList = () => {
    const newChatLists = messages.map(item => (
      <React.Fragment key={item.id}>
        {item.datetime && <div className='chat-history-date'>{item.datetime}</div>}
        <div className='chat-history-body'  style = {{backgroundColor: selectedChat == item.id ? 'rgba(255, 255, 255, 0.2)' : 'white'}}>
          <Link onClick={() => chatSelected(item.id)} style={{ color: 'black', textDecoration: 'none', height: '100%' }}>
            {item.title}
          </Link>
          <button className='button-del' onClick={() => delClicked(item.id)} disabled={isWaiting}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </React.Fragment>
    ));

    setChatLists([<>{newChatLists}</>]);
  }

  const getChatListFromSever = async (postData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/get-chat-list`, postData);
      setCanEdit(true);
      const activeId = response.data.active_id;
      
      setMessages(response.data.message);
      setSelectedChat(activeId);
      
      //refreshChatList(response, activeId);
      textareaRef.current.focus();
    } catch (error) {
      toast.error('Error fetching chat list: ' + error);
    }
  }

  const getChatContentFromServer = async (postData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/get-chat-content`, postData);

      let messageString = response.data.message;
      setCanEdit(false);
      setChatContents([
        <>
        {
          messageString.map(item => (
            <React.Fragment>
              <div className='chat-content-user'>
                {item.question}
              </div>
              
              <SysMessage initialStatus={false} chatMsg="Generating answers for you..."/>
              
              <div className='chat-content-ai'>
                {item.answer}
                <br/><br/>
                <button className='chat-content-feedback-button'>Give Feedback</button>
                <div className='chat-content-ai-horizontal-line'></div>
              </div>
            </React.Fragment>
          ))
        }
        </>
      ]);
      textareaRef.current.focus();
    } catch(error) {
      toast.error('Error fetching chat list: ' + error);
    }
  }
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    publish('endLoading');
  }, [chatContents]);

  useEffect(() => {
    chatlistcontainerRef.current.scrollTop = chatlistcontainerRef.current.scrollHeight;
  }, [chatLists]);

  useEffect(() => {
    if (selectedChat == 0 || selectedChat == null)
      return;

    const postData = { username: "user", chat_id: selectedChat };
    getChatContentFromServer(postData);
  }, [selectedChat]);

  const handleChatInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendClicked();
    } 
  }

  const handleChatTextChange = (event) => {
    setChatText(event.target.value);
    if (event.target.value == "")
      setIsSendBtnActive(false);
    else
      setIsSendBtnActive(true);
  }

  const sendClicked = () => {
    let isNewChat = false;

    if (chatText === "") {
      toast.error("Type your message.");
      return;
    }

    if (chatLists.length == 0 || selectedChat == 0 || chatLists.length == 1 && chatLists[0].props.children.length == 0)
      isNewChat = true;

    // Api Call
    setChatContents(prevComponents => [
      ...prevComponents,
      <>
      <div className='chat-content-user'>
      {
        chatText.split('\n').map((line, index) => (
          <React.Fragment>
            {line}
            <br />
          </React.Fragment>
        ))
      }
      </div>
      <SysMessage initialStatus={true} chatMsg="Generating answers for you..."/>
      </>
    ]);

    setChatText("");
    setIsSendBtnActive(false);
    getResponseFromServer(isNewChat);
  };

  const getResponseFromServer = isNewChat => {
    const postData = { username: "user", prompt: chatText, learn: isLearnActive };
    setIsWaiting(true);
    axios.post(`${API_BASE_URL}/get-response-message`, postData)
      .then(response => {
        setIsWaiting(false);
        setChatContents(prevComponents => [
          ...prevComponents,
          <>
          <div className='chat-content-ai'>
          {
            response.data.message.split('\n').map((line, index) => (
              <React.Fragment>
                {line}
                <br />
              </React.Fragment>
            ))
          }
          </div>
          </>
        ]);

        if (isNewChat) {
          const newChatId = response.data.newChatId;
          const newMessage = { id: response.data.newChatId, title: response.data.title };
          messages.push(newMessage);
          setSelectedChat(newChatId);
        }
      })
      .catch(error => toast.error('Error fetching data:' + error))
      .finally(() => {
        textareaRef.current.focus();
        publish('endLoading');
      });
  }

  const chatSelected = chat_id => {
    setSelectedChat(chat_id);
  }

  const delClicked = chat_id => {
    const postData = { username: "user", chat_id: chat_id };
    axios.post(`${API_BASE_URL}/delete-chat`, postData)
      .then(response => {
        setChatContents([]);
        getChatListFromSever(postData);
        
        toast.success("Chat Deleted Successfully.");
      })
      .catch(error => toast.error('Error fetching data:' + error));
  }

  const learnClicked = () => {
    toast.info('Learn button clicked.');
    setIsLearnActive(isLearnActive ? false : true);
  };

  const newChatClicked = () => {
    setChatContents([]);
    const postData = { username: "user" };
    axios.post(`${API_BASE_URL}/create-new-chat`, postData)
      .then(response => {
        if (response.data.message == 'success') {
          setSelectedChat(0);
        }
      })
      .catch(error => toast.error('Error fetching data:' + error));

    textareaRef.current.focus();
  };

  return (
    <div>
      <div className='chat-container'>
        <div className='chat-header'>
          <p className='header-title'>Tax Genii</p>
        </div>

        <ChatHistory chatlistcontainerRef={chatlistcontainerRef} chatLists={chatLists} />

        <ChatContent containerRef={containerRef} chatContents={chatContents}/>

        <ChatInput textareaRef={textareaRef} chatText={chatText} canEdit={canEdit} handleChatInputKeyDown={handleChatInputKeyDown} handleChatTextChange={handleChatTextChange} sendClicked={sendClicked} learnClicked={learnClicked} newChatClicked={newChatClicked} isSendBtnActive={isSendBtnActive} isLearnActive={isLearnActive}/>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />
      </div>
    </div>
  );
};

export default ChatPage;