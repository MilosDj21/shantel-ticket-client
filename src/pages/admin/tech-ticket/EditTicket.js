import React from "react";
import { useParams } from "react-router-dom";

const EditTicket = () => {
  const { ticketId } = useParams();
  return <div>{ticketId}</div>;
};

export default EditTicket;
