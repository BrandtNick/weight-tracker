import React from 'react';
import {
  Button,
  Flex,
} from '@chakra-ui/react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {COLORS} from '../constants';
import Input from '../components/input';
import {authRequests} from '../api';

const Login = () => {
  // Third party hooks
  const queryClient = useQueryClient();

  // API hooks
  const login = useMutation({
    mutationFn: authRequests.authenticate,
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    },
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
        width='400px'
        disabled={false}
        onChange={({target: {value}}) => setUser({...user, username: value})}
        value={user.username}
        placeholder='USERNAME'
      />
      <Input
        type='password'
        icon='Lock'
        valid={!!user.password}
        width='400px'
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
        }}
        disabled={!user.username || !user.password}
        _hover={{
          bg: COLORS.blue2,
        }}
      >
        LOGIN
      </Button>
    </Flex>
  );
};

export default Login;
