import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {
  ChakraProvider,
  Flex,
} from '@chakra-ui/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import Views from './views';

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
          <Views />
        </Flex>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
