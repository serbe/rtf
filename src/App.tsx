import './App.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthState } from './services/auth';
import { checkStorage } from './services/storage';

const App = () => {
  const [socketUrl, setSocketUrl] = useState("ws://127.0.0.1:8080");
  const messageHistory = useRef<MessageEvent<any>[]>([]);

  const { setAuth } = useAuthState();
  const [checker, setChecker] = useState(false);
  const [login, setLogin] = useState(false);

  const { sendMessage, lastMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
  });

  useEffect(() => {
    checkStorage(sendJsonMessage);
    // h2.connect('http://127.0.0.1/go/check');
  }, []);


  messageHistory.current = useMemo(
    () => (lastMessage ? messageHistory.current.concat(lastMessage) : messageHistory.current),
    [lastMessage]
  );

  const handleClickChangeSocketUrl = useCallback(() => setSocketUrl("ws://127.0.0.1:8080"), []);

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), [sendMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="px-10 space-y-6">
      <div className="flex space-x-4">
        <button
          className="flex-1 px-6 py-2 font-semibold select-none rounded-md text-indigo-700 border border-indigo-500 bg-transparent hover:bg-indigo-50"
          onClick={handleClickChangeSocketUrl}
        >
          Click Me to change Socket Url
        </button>
      </div>
      <div className="flex space-x-4">
        <button
          className="flex-1 px-6 py-2 font-semibold select-none rounded-md text-indigo-700 border border-indigo-500 bg-transparent hover:bg-indigo-50"
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
      </div>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.current.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};

export default App;
