import React from 'react';
import {
  InputLabel,
  InputPrepender,
  InputValidator,
  InputWrapper,
  StyledInput,
} from './styled';
import * as Icon from 'react-feather';

interface InputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  icon: keyof typeof Icon;
  valid: boolean;
}

const Input = (
  {
    onChange,
    type,
    value,
    placeholder,
    disabled,
    icon,
    valid,
  }: InputProps
) => {
  const [focused, setFocused] = React.useState(false);
  const InputIcon = Icon[icon];

  return (
    <InputWrapper>
      <InputLabel
        focused={focused || !!value.length}
      >
        {placeholder}
      </InputLabel>
      <InputPrepender>
        <InputIcon size={25}/>
      </InputPrepender>
      <StyledInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        type={type}
        onChange={onChange}
        value={value}
      />
      <InputValidator valid={valid}>
        <Icon.CheckCircle
          size={20}
        />
      </InputValidator>
    </InputWrapper>
  );
};

export default Input;
