import { useEffect, useState } from 'react';
import { instance } from '../axios/index.js';

export const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await instance.get('api/chat');
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <div>
      {chats?.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};
