import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider.jsx';
import SideDrawer from '../components/SideDrawer.jsx';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/MyChats.jsx';
import ChatBox from '../components/ChatBox.jsx';


export const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  useEffect(() => {
  }, []);
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box style={{ display: 'flex', justifyContent: 'space-between' }} w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};
