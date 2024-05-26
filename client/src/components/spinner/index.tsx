import {Spinner as ChakraSpinner} from '@chakra-ui/react';

import {COLORS} from '../../constants';

const Spinner = () => {
  return (
    <ChakraSpinner
      thickness='2px'
      emptyColor={COLORS.blue5}
      color={COLORS.blue3}
      size='lg'
    />
  );
};

export default Spinner;
