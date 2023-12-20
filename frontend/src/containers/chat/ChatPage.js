import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { publish } from '../../event/event';

import 'react-toastify/dist/ReactToastify.css';

import '../../styles/global.css';
import '../../styles/layout/chat/ChatPage.css';


import ChatTitle from '../../components/chat/ChatTitle';
import Sidebar from '../../components/chat/Sidebar/Sidebar';
import ChatContent from '../../components/chat/Content/ChatContent';
import ChatInput from '../../components/chat/ChatInput';

import AnswerMessage from '../../components/chat/Content/AnswerMessage';
import { SysMessage } from '../../components/chat/Content/SysMessage'

import { API_BASE_URL, ROLE_USER, ROLE_SYSTEM, ROLE_KNOWLEDGE } from '../../utils/const';


const ChatPage = () => {
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const chatlistcontainerRef = useRef(null);

  const [chatTitle, setChatTitle] = useState('');

  const [isWaiting, setIsWaiting] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [chatContents, setChatContents] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [isLearnActive, setIsLearnActive] = useState(false);
  const [isSendBtnActive, setIsSendBtnActive] = useState(false);

  useEffect(() => {
    const postData = { username: "user" };
    getChatListFromSever(postData);
  }, []);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    publish('endLoading');

    if (chatContents.length == 0 || selectedChat == 0 || chatContents.length == 1 && chatContents[0].props.children.length == 0) {
      setChatTitle('New chat');
    }
  }, [chatContents]);


  useEffect(() => {
    //chatlistcontainerRef.current.scrollTop = chatlistcontainerRef.current.scrollHeight;
  }, [chatLists]);


  useEffect(() => {
    refreshChatList();
  }, [selectedChat, messages]);

  const refreshChatList = () => {
    const newChatLists = messages.map(item => (
      <React.Fragment key={item.id}>
        {item.datetime && <div className='chat-history-date'>{item.datetime}</div>}
        <div className={selectedChat != item.id ? 'chat-history-body' : 'chat-history-body disabled'}>
          <Link className='chat-history-body-link' onClick={() => chatSelected(item.id, item.title)}>
            {item.title}
          </Link>
          <button className='button-del' onClick={() => delClicked(item.id, item.title)}>
            <FontAwesomeIcon icon={faTrashCan} size='lg'/>
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
            {
              item.role == ROLE_USER ?
                <>
                  <div className='chat-content-gap-horizontal-line'></div>
                  <div className='chat-content-user'>
                    {item.prompt}
                  </div>
                </>
              : 
              item.role == ROLE_SYSTEM ?
                <SysMessage initialStatus={false} chatMsg={item.prompt}/>
              : 
              item.role == ROLE_KNOWLEDGE ? 
              <AnswerMessage answerMsg={item.prompt}/>
              : <></>
            }
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
    if (selectedChat == 0 || selectedChat == null)
      return;

    const postData = { username: "user", chat_id: selectedChat };
    getChatContentFromServer(postData);
  }, [selectedChat]);

  const handleChatInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
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

    if (!isLearnActive) {
      // Api Call
      setChatContents(prevComponents => [
        ...prevComponents,
        <>
        <div className='chat-content-gap-horizontal-line'></div>
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
        {
          isLearnActive ? 
          <></> :
          <SysMessage initialStatus={true} chatMsg="Generating answers for you..."/>
        }
        </>
      ]);
      setChatText("");
      setIsSendBtnActive(false);
      getResponseFromServer(isNewChat);
    }
    else {
      setChatText("");
      setIsSendBtnActive(false);
      toast.info("Thanks for your feedback");
    }
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
          <AnswerMessage answerMsg={response.data.message}/>
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

  const chatSelected = (chat_id, chat_title) => {
    setSelectedChat(chat_id);
    setChatTitle(chat_title);
  }

  const delClicked = (chat_id, chat_title) => {
    const postData = { username: "user", chat_id: chat_id };
    axios.post(`${API_BASE_URL}/delete-chat`, postData)
      .then(response => {
        setChatContents([]);
        getChatListFromSever(postData);
        
        toast.success(`Chat history  '${chat_title}'  removed.`);
      })
      .catch(error => toast.error('Error fetching data:' + error));
  }

  const learnClicked = () => {
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
        <Sidebar chatlistcontainerRef={chatlistcontainerRef} chatLists={chatLists} />

        <ChatTitle chatTitle={chatTitle} />

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