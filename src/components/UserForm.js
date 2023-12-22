import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputBase, useTheme, Button, MenuItem, Select } from "@mui/material";
import { Lock, Person, Email, PhotoCamera, SupervisorAccount } from "@mui/icons-material";

import FlexBetween from "./FlexBetween";
import useHttp from "../hooks/use-http";
import QRcodeDialog from "./QRcodeDialog";
import AlertDialog from "./AlertDialog";

const UserForm = ({ method, userId = null }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // GET ROLES FROM SERVER
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

    //IF EXISTING USER GET DATA FROM SERVER
    if (userId) {
      const saveUser = (userData) => {
        // console.log(userData);
        setEmail(userData.email);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
      };

      sendRequest(
        {
          url: `/users/${userId}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        saveUser
      );
    }
  }, [sendRequest, userId]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    //IF NEW USER, SAVE ALL FIELDS
    if (!userId) {
      if (!email || !password || !firstName || !lastName || !selectedRole) return;
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("image", profileImage);
      formData.append("roles", selectedRole);
    }
    //IF EXISTING USER CHECK WHAT TO SAVE
    else {
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (password) formData.append("password", password);
      if (profileImage) formData.append("image", profileImage);
      if (selectedRole) formData.append("roles", selectedRole);
    }

    sendRequest(
      {
        url: userId ? `/users/${userId}` : "/users",
        method: method,
        formData: formData,
      },
      (qrData) => {
        if (!userId) {
          setQrCode(qrData);
          setShowQrCodeModal(true);
        }
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setProfileImage("");
        setSelectedRole("");
      }
    );
  };

  const deleteUserHandler = async () => {
    sendRequest(
      {
        url: `/users/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (userData) => {
        console.log(userData);
        navigate("/admin/users");
      }
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
            required={userId ? false : true}
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
            required={userId ? false : true}
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
            required={userId ? false : true}
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
        <FlexBetween gap="2rem">
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              p: "0.4rem 3rem",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Loading..." : userId ? "Update" : "Create"}
          </Button>
          {userId && (
            <Box>
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={() => setOpenDialog(true)}
                sx={{
                  p: "0.4rem 3rem",
                  fontSize: "16px",
                }}
              >
                {isLoading ? "Loading..." : "Delete"}
              </Button>
              <AlertDialog title="Delete User?" content="Are you sure you want to delete this user?" open={openDialog} setOpen={setOpenDialog} handleConfirm={deleteUserHandler} />
            </Box>
          )}
        </FlexBetween>
      </Box>
      <QRcodeDialog open={showQrCodeModal} setOpen={setShowQrCodeModal} imgSource={qrCode} />
    </Box>
  );
};

export default UserForm;
