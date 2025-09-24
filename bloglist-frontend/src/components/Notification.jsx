import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification.message) return null; // Don’t show anything if there's no message

  const style = {
    color: notification.type === "error" ? "red" : "green",
    backgroundColor: notification.type === "error" ? "#fdd" : "#dfd",
    border: `1px solid ${notification.type === "error" ? "red" : "green"}`,
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
