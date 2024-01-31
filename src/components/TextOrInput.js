import { useState } from "react";
import { InputBase, useTheme } from "@mui/material";

const TextOrInput = ({ fontSize, textValue, callback }) => {
  const theme = useTheme();
  const [text, setText] = useState(textValue);

  return (
    <InputBase
      type="text"
      sx={{
        width: "100%",
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
          borderRadius: "9px",
        },
      }}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      onBlur={() => {
        callback(text);
      }}
    />
  );
};

export default TextOrInput;
