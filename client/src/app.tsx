import React from 'react'
import {
  ChakraProvider,
  Flex,
} from '@chakra-ui/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import Login from './views/login'

const queryClient = new QueryClient()

const App = () => {

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Flex
          justify='center'
          align='center'
          bg='#173753'
          h='100vh'
          w='100vw'
        >
          <Login />
        </Flex>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
