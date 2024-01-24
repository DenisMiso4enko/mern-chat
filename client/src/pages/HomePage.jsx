import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Login from '../components/Auth/Login.jsx';
import Signup from '../components/Auth/Signup.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user) navigate('/chat');
  }, [navigate]);

  return <Container maxW={'xl'} centerContent={true}>
    <Box
      d="flex"
      justifyContent="center"
      p={3}
      bg="white"
      w="100%"
      m="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px">
      <Text fontSize="4xl" fontFamily="Work sans" d="inline-block">
        MERN-CHAT-APP
      </Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs isFitted variant="soft-rounded">
        <TabList mb="1em">
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login />
          </TabPanel>
          <TabPanel>
            <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container>;
};
