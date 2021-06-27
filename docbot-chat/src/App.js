import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get('/messages/sync')
      .then( response => {
        //console.log(response.data);
        setMessages(response.data);
      });
  }, []);

  useEffect(() => {
      var pusher = new Pusher('d02c55ce7a6aa58b2f1a', {
        cluster: 'ap2'
      });

      const channel = pusher.subscribe('messages');
      channel.bind('inserted',(newMessage) => {
        
        setMessages([...messages, newMessage]);
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      }
  },[messages])

  console.log(messages);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages ={messages} />
      </div>
    </div>
  );
}

export default App;
