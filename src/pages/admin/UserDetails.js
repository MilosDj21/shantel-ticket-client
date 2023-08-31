import React from "react";
import { useParams } from "react-router-dom";

import UserForm from "../../components/UserForm";

const UserDetails = () => {
  const { userId } = useParams();
  return <UserForm method="PATCH" userId={userId} />;
};

export default UserDetails;
