// import React, { useState, useEffect } from "react";
// import { Box, Button, Dialog, DialogContent, useTheme, Slide, Divider, Typography, Menu, MenuItem, FormControl, Select } from "@mui/material";
// import { ArrowDropDownOutlined } from "@mui/icons-material";

// import TextOrInput from "../TextOrInput";
// import useHttp from "../../hooks/use-http";

// const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="left" ref={ref} {...props} />;
// });

// const TaskDetailsDialog = ({ task, setTask, open, setOpen, project, setProject }) => {
//   const theme = useTheme();
//   const { isLoading, error, sendRequest } = useHttp();
//   const [users, setUsers] = useState([]);
//   const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
//   const [selectedUserRole, setSelectedUserRole] = useState(null);

//   const userMenuIsOpen = Boolean(userMenuAnchorEl);

//   useEffect(() => {
//     sendRequest(
//       {
//         url: "/users/",
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//       (userData) => {
//         setUsers(userData);
//         console.log("users:", userData);
//       }
//     );
//   }, [sendRequest]);

//   const getDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     const hour = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const seconds = String(date.getSeconds()).padStart(2, "0");
//     return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
//   };

//   return (
//     <Box>
//       {task && (
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           aria-labelledby="alert-dialog-title"
//           fullWidth
//           maxWidth="md"
//           TransitionComponent={Transition}
//           sx={{
//             "& .MuiDialog-container": {
//               justifyContent: "end",
//             },
//           }}
//           PaperProps={{
//             sx: {
//               height: "100%",
//               maxHeight: "100%",
//               m: "0",
//             },
//           }}
//         >
//           <DialogContent
//             sx={{
//               backgroundColor: theme.palette.background.default,
//               display: "flex",
//               justifyContent: "start",
//               flexDirection: "column",
//               pt: "0",
//             }}
//           >
//             {/* Title */}
//             <Box display="flex" justifyContent="center" p="3rem 0">
//               <Typography variant="h2">{task.title}</Typography>
//             </Box>
//             {/* Content */}
//             <Box display="flex" flexDirection="column" p="2rem" backgroundColor={theme.palette.background.light} borderRadius="5px" width="100%">
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Website:</Typography>
//                 <TextOrInput fontSize="14px" textValue={post.website.url} callback={updatePostHandler} fieldToUpdate="url" tableToUpdate="websites" />
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Anchor:</Typography>
//                 <TextOrInput fontSize="14px" textValue={post.anchorKeyword} callback={updatePostHandler} fieldToUpdate="anchorKeyword" tableToUpdate="postRequests" />
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="3rem">
//                 <Box display="flex" gap="1rem" alignItems="center">
//                   <Typography color={theme.palette.grey[500]}>Client Link:</Typography>
//                   <TextOrInput fontSize="14px" textValue={post.clientWebsite.url} callback={updatePostHandler} fieldToUpdate="url" tableToUpdate="clientWebsites" />
//                 </Box>
//                 <Box display="flex" gap="1rem" alignItems="center">
//                   <Typography color={theme.palette.grey[500]}>Link Status:</Typography>
//                   <Typography color={theme.palette.grey[200]}>{post.clientWebsite.status}</Typography>
//                 </Box>
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Post Category:</Typography>
//                 <FormControl
//                   variant="standard"
//                   sx={{
//                     "& .MuiFormControl-root": {
//                       width: "100%",
//                     },
//                   }}
//                 >
//                   <Select
//                     value={post.postCategory}
//                     onChange={(event) => updatePostHandler(event.target.value, "postCategory", "postRequests")}
//                     sx={{
//                       "::before": {
//                         borderBottom: `1px solid ${theme.palette.grey[200]}`,
//                       },
//                       color: theme.palette.grey[500],
//                       "& .MuiSvgIcon-root": {
//                         color: theme.palette.grey[200],
//                       },
//                     }}
//                   >
//                     <MenuItem value="Placeni">Placeni</MenuItem>
//                     <MenuItem value="Insercija">Insercija</MenuItem>
//                     <MenuItem value="Wayback">Wayback</MenuItem>
//                     <MenuItem value="Redovni">Redovni</MenuItem>
//                     <MenuItem value="Ostalo">Ostalo</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Progress Level:</Typography>
//                 <Typography color={theme.palette.grey[200]}>{getProgress(post.progressLevel)}</Typography>
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Urgency Level:</Typography>
//                 <TextOrInput fontSize="14px" textValue={post.urgencyLevel} callback={updatePostHandler} fieldToUpdate="urgencyLevel" tableToUpdate="postRequests" />
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem" alignItems="center">
//                 <Typography color={theme.palette.grey[500]}>Word Number:</Typography>
//                 <TextOrInput fontSize="14px" textValue={post.wordNum} callback={updatePostHandler} fieldToUpdate="wordNum" tableToUpdate="postRequests" />
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="3rem">
//                 <Box display="flex" gap="1rem" alignItems="center">
//                   <Typography color={theme.palette.grey[500]}>Writer:</Typography>
//                   <Button
//                     onClick={(event) => {
//                       setSelectedUserRole("copywriter");
//                       openUserMenuHandler(event);
//                     }}
//                   >
//                     {post.copywriter && (
//                       <Box
//                         component="img"
//                         alt="profile"
//                         src={serverAddress + "/" + post.copywriter.profileImage}
//                         crossOrigin="use-credentials"
//                         height="32px"
//                         width="32px"
//                         borderRadius="50%"
//                         sx={{ objectFit: "cover" }}
//                       />
//                     )}
//                     <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
//                   </Button>
//                 </Box>
//                 <Box display="flex" gap="1rem" alignItems="center">
//                   <Typography color={theme.palette.grey[500]}>Editor:</Typography>

//                   <Button
//                     onClick={(event) => {
//                       setSelectedUserRole("editor");
//                       openUserMenuHandler(event);
//                     }}
//                   >
//                     {post.editor && (
//                       <Box
//                         component="img"
//                         alt="profile"
//                         src={serverAddress + "/" + post.editor.profileImage}
//                         crossOrigin="use-credentials"
//                         height="32px"
//                         width="32px"
//                         borderRadius="50%"
//                         sx={{ objectFit: "cover" }}
//                       />
//                     )}
//                     <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
//                   </Button>
//                 </Box>
//                 <Menu anchorEl={userMenuAnchorEl} open={userMenuIsOpen} onClose={() => setUserMenuAnchorEl(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
//                   {users.map((u) => {
//                     for (const r of u.roles) {
//                       if (r.name === "Editor" && selectedUserRole === "editor") {
//                         return (
//                           <MenuItem
//                             key={u._id}
//                             onClick={() => {
//                               setUserMenuItemHandler(u);
//                             }}
//                           >
//                             <Typography mr="0.4rem">{u.firstName}</Typography>
//                             <Typography>{u.lastName}</Typography>
//                           </MenuItem>
//                         );
//                       } else if (r.name === "Copywriter" && selectedUserRole === "copywriter") {
//                         return (
//                           <MenuItem
//                             key={u._id}
//                             onClick={() => {
//                               setUserMenuItemHandler(u);
//                             }}
//                           >
//                             <Typography mr="0.4rem">{u.firstName}</Typography>
//                             <Typography>{u.lastName}</Typography>
//                           </MenuItem>
//                         );
//                       }
//                     }
//                     return "";
//                   })}
//                 </Menu>
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem">
//                 <Typography color={theme.palette.grey[500]}>Created At:</Typography>
//                 <Typography color={theme.palette.grey[200]}>{getDate(post.createdAt)}</Typography>
//               </Box>
//               <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
//               <Box display="flex" gap="1rem">
//                 <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
//                 <Typography color={theme.palette.grey[200]}>{getDate(post.updatedAt)}</Typography>
//               </Box>
//             </Box>
//           </DialogContent>
//           {/* <DialogActions
//             sx={{
//               backgroundColor: theme.palette.background.default,
//               p: "1.5rem",
//             }}
//           >
//             <Button
//               onClick={() => {
//                 setOpen(false);
//               }}
//               sx={{
//                 color: theme.palette.grey[200],
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 // handleConfirm(email);
//                 // setEmail("");
//               }}
//               autoFocus
//             >
//               Next Step
//             </Button>
//           </DialogActions> */}
//         </Dialog>
//       )}
//     </Box>
//   );
// }

// export default TaskDetailsDialog
