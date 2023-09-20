import { Button, InputBase, Box, useTheme } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { MenuButtonBold, MenuButtonItalic, MenuControlsContainer, MenuDivider, MenuSelectHeading, RichTextEditor } from "mui-tiptap";
import { useRef, useState } from "react";

const TextEditor = ({ isLoading, saveMessage }) => {
  const theme = useTheme();
  const rteRef = useRef(null);
  const [image, setImage] = useState(null);

  return (
    <Box
      sx={{
        "& .MuiSelect-select": {
          color: theme.palette.grey[200],
        },
        "& .MuiButtonBase-root": {
          color: theme.palette.grey[200],
        },
        "& .MuiButton-root": {
          color: "rgba(0, 0, 0, 0.87)",
        },
        "& .MuiInputBase-root:hover": {
          border: `1px solid ${theme.palette.grey[200]}`,
        },
        "& .MuiSvgIcon-root": {
          color: `${theme.palette.grey[200]} !important`,
        },
        "& .MuiTiptap-FieldContainer-root": {
          border: `1px solid ${theme.palette.grey[700]}`,
        },
        "& .MuiTiptap-FieldContainer-root:hover": {
          border: `1px solid ${theme.palette.grey[200]}`,
        },
        "& .MuiCollapse-root": {
          borderBottom: `1px solid ${theme.palette.grey[700]}`,
          backgroundColor: theme.palette.background.light,
        },
        "& ::before": {
          color: `${theme.palette.grey[700]} !important`,
        },
        "& .ProseMirror": {
          wordWrap: "anywhere",
        },
      }}
    >
      <RichTextEditor
        ref={rteRef}
        extensions={[StarterKit, Placeholder]}
        // content="<p>Hello world</p>" // Initial content for the editor
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        )}
      />

      <Box pt="1rem" display="flex" justifyContent="space-between">
        <InputBase
          type="file"
          sx={{
            color: theme.palette.grey[300],
            p: "0.2rem 0",
            fontSize: "15px",
          }}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          onClick={(event) => {
            event.preventDefault();
            saveMessage(rteRef.current?.editor?.getHTML(), image);
            rteRef.current.editor.commands.clearContent();
            setImage(null);
          }}
          sx={{
            p: "0.4rem 3.5rem",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;
