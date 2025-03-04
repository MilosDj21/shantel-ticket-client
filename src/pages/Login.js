import { useState, useEffect, Fragment } from "react";
import { Box, InputBase, useTheme, Button } from "@mui/material";
import { Lock, Person, AccountCircleRounded, Pin } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FlexBetween from "../components/FlexBetween";
import useHttp from "../hooks/use-http";
import { authActions } from "../store/auth";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFaToken, setTwoFaToken] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const { sendRequest } = useHttp();

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const saveUser = (userData) => {
      // console.log(userData);
      dispatch(authActions.login(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    };

    sendRequest(
      {
        url: "/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { email, password, twoFaToken },
      },
      saveUser,
    );
  };

  return (
    <Fragment>
      {!userId && (
        <Box component="form" onSubmit={handleFormSubmit} display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <Box position="relative" display="flex" flexDirection="column" alignItems="center" gap="2rem" p="6rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px">
            <AccountCircleRounded
              sx={{
                position: "absolute",
                top: "-5rem",
                color: theme.palette.grey[800],
                fontSize: "10rem",
              }}
            />
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
                type="password"
                placeholder="********"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FlexBetween>
            <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.1rem 1.5rem">
              <Pin
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <InputBase
                error
                required
                type="text"
                placeholder="2 Factor Auth(6 Digit Code)"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                }}
                value={twoFaToken}
                onChange={(e) => setTwoFaToken(e.target.value)}
              />
            </FlexBetween>
            <Button
              type="submit"
              variant="contained"
              sx={{
                p: "0.4rem 3.5rem",
                fontSize: "16px",
              }}>
              Login
            </Button>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default Login;
