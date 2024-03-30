import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ENDPOINT, LOGIN, LOGOUT, CHAT } from './constants';
import { receive } from './actions';

const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  let user;
  let socket;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = new WebSocket(ENDPOINT);
      socket.binaryType = 'blob';
      socket.onmessage = (event) => {
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => dispatch(receive(JSON.parse(reader.result)));
          reader.readAsText(event.data);
        } else {
          dispatch(receive(JSON.parse(event.data)));
        }
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [dispatch]);

  const setUser = (name) => {
    const message = name ? { type: LOGIN, payload: name } : { type: LOGOUT, payload: user };
    user = name;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const sendMessage = (text) => {
    const message = {
      type: CHAT,
      payload: { from: user, text },
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ setUser, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };