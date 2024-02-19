import { useState } from "react";
import { InputBase, useTheme } from "@mui/material";

const TextOrInput = ({ fontSize, textValue, callback, fieldToUpdate = null, tableToUpdate = null }) => {
  const theme = useTheme();
  const [text, setText] = useState(textValue);
  const [tempVal, settempVal] = useState(textValue.toString().slice());

  const onBlurHandler = async () => {
    if (fieldToUpdate && tableToUpdate) {
      const isLoading = await callback(text, fieldToUpdate, tableToUpdate);
      if (isLoading) setText(tempVal.toString().slice(0));
    } else {
      callback(text);
    }
  };

  return (
    <InputBase
      type="text"
      sx={{
        flex: "1",
        maxWidth: "100%",
        color: theme.palette.grey[300],
        fontSize: { fontSize },
        m: "0.4rem 0",
        "& .MuiInputBase-input": {
          p: "0.4rem",
        },
        "& .MuiInputBase-input:hover": {
          border: `1px solid ${theme.palette.grey[800]}`,
          borderRadius: "5px",
        },
        "& .MuiInputBase-input:focus": {
          border: `1px solid ${theme.palette.grey[800]}`,
          borderRadius: "5px",
        },
      }}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      onBlur={onBlurHandler}
    />
  );
};

export default TextOrInput;
