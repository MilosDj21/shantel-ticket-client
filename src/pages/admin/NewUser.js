import { useState, useEffect } from "react";
import { Box, InputBase, useTheme, Button, MenuItem, Select } from "@mui/material";
import { Lock, Person, AccountCircleRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import FlexBetween from "../../components/FlexBetween";
import useHttp from "../../hooks/use-http";
import { authActions } from "../../store/auth";

const NewUser = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {}, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const saveUser = (userData) => {
      console.log(userData);
    };

    sendRequest(
      {
        url: "/users",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { email, password },
      },
      saveUser
    );
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <Box display="flex" flexDirection="column" alignItems="center" gap="2rem" p="4rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px">
        {/* Email */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <Person
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            error
            required
            type="text"
            placeholder="Email"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "18px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FlexBetween>

        {/* PASSWORD */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <Lock
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            error
            required
            type="text"
            placeholder="password"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "18px",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FlexBetween>

        {/* FIRST NAME */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <Person
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            error
            required
            type="text"
            placeholder="First Name"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "18px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FlexBetween>

        {/* LAST NAME */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <Person
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            error
            required
            type="text"
            placeholder="Last Name"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "18px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FlexBetween>

        {/* ROLES */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
          <Person
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <Select
            required
            sx={{
              color: theme.palette.grey[300],
              width: "100%",
              fontSize: "18px",
              border: "none",
              "& .MuiSelect-select": {
                border: "none",
                p: "0.5rem 0",
              },
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FlexBetween>
        <Button
          type="submit"
          variant="contained"
          sx={{
            p: "0.4rem 3.5rem",
            fontSize: "16px",
          }}
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default NewUser;
