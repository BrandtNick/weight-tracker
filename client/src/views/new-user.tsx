import React from 'react';
import {
  Button,
  Flex,
} from '@chakra-ui/react';
import {useMutation} from '@tanstack/react-query';

import {COLORS, USER_ROUTES} from '../constants';
import Input from '../components/input';
import {userRequests} from '../api';

interface NewUserProps {
  setUserRoute: React.Dispatch<React.SetStateAction<keyof typeof USER_ROUTES>>;
}
const NewUser = (props: NewUserProps) => {
  // API hooks
  const create = useMutation({
    mutationFn: userRequests.create,
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
      <Flex 
        justify='space-between'
        w='100%'
      >
        <Button
          h='28px'
          w='100px'
          m='10px'
          variant='outline'
          colorScheme='blue'
          color={COLORS.blue3}
          onClick={() => {
            create.mutate(user);
            props.setUserRoute(USER_ROUTES.login);
          }}
          isDisabled={!user.username || !user.password}
          _hover={{
            bg: COLORS.blue2,
          }}
        >
          Create
        </Button>
        <Button
          h='28px'
          w='100px'
          m='10px'
          variant='outline'
          colorScheme='blue'
          color={COLORS.grey}
          onClick={() => {
            props.setUserRoute(USER_ROUTES.login);
          }}
          _hover={{
            bg: COLORS.blue2,
          }}
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default NewUser;
