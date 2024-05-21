import styled from 'styled-components';

import {COLORS} from '../../constants';

const StyledInput = styled.input<{value: string}>`
  height: 35px;
  width: 100%;
  padding: 5px 35px 5px 50px;
  margin: 20px 0 15px;
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom: 1px solid ${COLORS.blue3};
  border-left: none;
  border-right: none;
  border-top: none;
  outline: none;
  background: ${({value}) => value ? COLORS.blue2 : 'transparent'};
  color: ${COLORS.blue4};
  transition: all 0.3s;
  font-size: 0.8em;
  
  &:focus {
    background: ${COLORS.blue2};
    
    transition: all 0.3s;
  }
`;

const InputPrepender = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  color: ${COLORS.blue3};
  height: 45px;
  width: 45px;
  margin: 15px 0 15px;
`;

const InputLabel = styled.span<{focused: boolean}>`
  position: absolute;
  font-family: 'Audiowide', sans-serif;
  font-size: ${({focused}) => focused ? '0.6em' : '0.7em'};
  margin-top: ${({focused}) => focused ? '-2px' : '30px'};
  margin-left: ${({focused}) => focused ? '10px' : '50px'};;
  color: ${COLORS.blue4};
  transition: all 0.3s;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin: 2px;
`;

const InputValidator = styled.span<{valid: boolean}>`
  position: absolute;
  color: ${({valid}) => valid ? COLORS.green : COLORS.greyDarker};
  margin-top: 27.5px;
  right: 5px;
  transition: all 0.3s;
`;

export {
  StyledInput,
  InputPrepender,
  InputLabel,
  InputWrapper,
  InputValidator,
}
