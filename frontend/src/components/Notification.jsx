const Notification = ({ message, type }) => {
  console.log(message);
  if (!message) return null; // Don’t show anything if there's no message

  const style = {
    color: type === "error" ? "red" : "green",
    backgroundColor: type === "error" ? "#fdd" : "#dfd",
    border: `1px solid ${type === "error" ? "red" : "green"}`,
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
