import { Typography, Box, useTheme, InputBase, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import React from "react";

const TableHeader = ({ title, subtitle, searchInput, searchHandle }) => {
  const theme = useTheme();
  return (
    <FlexBetween color={theme.palette.grey[400]} margin="1.5rem 1rem 0 1rem">
      <FlexBetween>
        <Box width="100%">
          <Typography variant="h3" mb="-0.1rem">
            {title}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap="1rem">
        <Typography variant="h5" fontWeight="700" color={theme.palette.secondary[500]}>
          {subtitle}
        </Typography>
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="3rem" p="0.1rem 1.5rem">
          <InputBase
            placeholder="Search..."
            onChange={searchInput}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                searchHandle();
              }
            }}
            sx={{
              color: theme.palette.grey[300],
            }}
          />
          <IconButton onClick={searchHandle}>
            <Search
              sx={{
                color: theme.palette.grey.main,
              }}
            />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
    </FlexBetween>
  );
};

export default TableHeader;
