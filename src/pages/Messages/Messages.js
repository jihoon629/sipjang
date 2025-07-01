import "./Messages.css";

const messages = [
  {
    id: 1,
    name: "대한건설",
    lastMsg: "내일 8시에 현장으로 오시면 됩니다!",
    time: "오전 10:22",
    unread: 2,
  },
  {
    id: 2,
    name: "현대건축",
    lastMsg: "지원서 잘 받았습니다.",
    time: "어제",
    unread: 0,
  },
];

function Messages() {
  return (
    <div className="messages-page">
      
      <div className="messages-header">메시지</div>
      <div className="messages-list">
        {messages.map(msg => (
          <div className={"messages-item" + (msg.unread ? " unread" : "") } key={msg.id}>
            <div className="messages-avatar">{msg.name[0]}</div>
            <div className="messages-info">
              <div className="messages-name-row">
                <span className="messages-name">{msg.name}</span>
                <span className="messages-time">{msg.time}</span>
              </div>
              <div className="messages-last">{msg.lastMsg}</div>
            </div>
            {msg.unread > 0 && <span className="messages-unread-badge">{msg.unread}</span>}
          </div>
        ))}
      </div>
      
    </div>
  );
}
export default Messages;
