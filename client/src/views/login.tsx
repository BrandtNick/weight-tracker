import React from 'react';
import {
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import {useMutation} from '@tanstack/react-query';

import {COLORS, USER_ROUTES} from '../constants';
import Input from '../components/input';
import {authRequests} from '../api';

interface LoginProps {
  setUserRoute: React.Dispatch<React.SetStateAction<keyof typeof USER_ROUTES>>;
  refetch: () => void;
}

const Login = (props: LoginProps) => {
  // API hooks
  const login = useMutation({
    mutationFn: authRequests.authenticate,
  });
  
  // State hooks
  const [user, setUser] = React.useState({
    username: '',
    password: '',
  });

  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
    >
      <Input
        type='text'
        icon='User'
        valid={!!user.username}
        disabled={false}
        onChange={({target: {value}}) => setUser({...user, username: value})}
        value={user.username}
        placeholder='USERNAME'
      />
      <Input
        type='password'
        icon='Lock'
        valid={!!user.password}
        disabled={false}
        onChange={({target: {value}}) => setUser({...user, password: value})}
        value={user.password}
        placeholder='PASSWORD'
      />
      <Button
        h='28px'
        w='100px'
        m='10px'
        variant='outline'
        colorScheme='blue'
        color={COLORS.blue3}
        onClick={() => {
          login.mutate(user);
          props.refetch();
        }}
        isDisabled={!user.username || !user.password}
        _hover={{
          bg: COLORS.blue2,
        }}
      >
        Sign in
      </Button>
      <Text
        marginTop='10px'
        fontSize='12px'
        onClick={() => props.setUserRoute(USER_ROUTES.new)}
        color={COLORS.blue3}
        cursor='pointer'
        _hover={{
          textDecoration: 'underline',
        }}
      >
        Dont have an account? Sign up now
      </Text>
    </Flex>
  );
};

export default Login;
