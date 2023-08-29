import { useState, useEffect } from "react";
import { Box, InputBase, useTheme, Button, MenuItem, Select } from "@mui/material";
import { Lock, Person, Email, PhotoCamera, SupervisorAccount } from "@mui/icons-material";

import FlexBetween from "../../components/FlexBetween";
import useHttp from "../../hooks/use-http";

const NewUser = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const saveRole = (rolesData) => {
      setRoles(rolesData);
    };

    sendRequest(
      {
        url: "/roles",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      saveRole
    );
  }, [sendRequest]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || !firstName || !lastName || !selectedRole) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("image", profileImage);
    formData.append("roles", selectedRole);

    const saveUser = (userData) => {
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setProfileImage("");
      setSelectedRole("");
    };

    sendRequest(
      {
        url: "/users",
        method: "POST",
        formData: formData,
      },
      saveUser
    );
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <Box display="flex" flexDirection="column" alignItems="center" gap="2rem" p="4rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px">
        {/* Email */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <Email
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
            placeholder="Password"
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FlexBetween>

        {/* PROFILE IMAGE */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
          <PhotoCamera
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            required
            type="file"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "15px",
            }}
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </FlexBetween>

        {/* ROLES */}
        <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
          <SupervisorAccount
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
            defaultValue=""
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FlexBetween>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            p: "0.4rem 3.5rem",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Loading..." : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default NewUser;
