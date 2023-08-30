import { Typography, Box, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import React from "react";

const TableHeader = ({ title, subtitle }) => {
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
      <Typography variant="h5" fontWeight="700" color={theme.palette.secondary[500]}>
        {subtitle}
      </Typography>
    </FlexBetween>
  );
};

export default TableHeader;
