import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

type Props = {
  numeroCelular: number;
  setNumeroCelular: (numeroCelular: number) => void;
  isRequired: boolean;
  label: string;
  maxLength: number;
};

function Telefono(props: Props) {
  const handleNumeroCelularChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Permitir solo valores numéricos
    if (/^\d*$/.test(value) && value.length <= props.maxLength) {
      props.setNumeroCelular(value === "" ? 0 : Number(value));
    }
  };

  return (
    <>
      <FormControl isRequired={props.isRequired}>
        <FormLabel>{props.label}</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <PhoneIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="tel"
            placeholder="Ingrese el teléfono"
            value={props.numeroCelular}
            onChange={handleNumeroCelularChange}
            pattern="[0-9]*"
            maxLength={props.maxLength}
          />
        </InputGroup>
      </FormControl>
    </>
  );
}

export default Telefono;
