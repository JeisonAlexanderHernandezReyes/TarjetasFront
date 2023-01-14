import { TextField } from "@mui/material";
import React from 'react'
import { Controller } from 'react-hook-form';


const ControlledInputRoundedForm = ({ inputProps, inputRef, stateShrink, setStateShrink, adornment, control, pattern, ...props }) => {
    const regexPattern = new RegExp(pattern);


    const handleSpecialCharacters = (text) => {
        if (pattern === undefined) {
            return text;
        }
        let value = text.replace(regexPattern, '');
        return value;
    };

    return (
        <Controller
            control={control}
            name={props.name}
            {...props}
            render={
                ({ field: { onChange, value, ...rest } }) => (
                    <TextField
                        variant="filled"
                        size="small"
                        margin={'dense'}
                        InputProps={{ disableUnderline: true, inputProps, ...adornment }}
                        InputLabelProps={{
                            classes: {
                                shrink: !!setStateShrink ? stateShrink : props.shrink
                            }
                        }}
                        inputRef={inputRef}
                        value={value}
                        onChange={(e) => {
                            onChange(handleSpecialCharacters(e.target.value))
                        }}
                        {...rest}
                        {...props}

                    />
                )
            }
        />
    )
}

export default ControlledInputRoundedForm