import { useSelector, useDispatch } from 'react-redux';
import './App.css'
import { useContext, useState } from 'react'
import { CHAT, LOGIN, LOGOUT } from './constants';
import { login, logout, send } from './actions';
import { WebSocketContext } from './Context.jsx';
import './index.css'

function App() {
  const context = useContext(WebSocketContext);
  const user = useSelector(state => state.user);
  const messages = useSelector(state => state.messages);
  const [name,setName] = useState(''); 
  const dispatch = useDispatch()
  const setUser = () =>{
    if(user){
      dispatch(logout(context))
    }else{
      dispatch(login(context, name))
    }
  }
  const sendMessage = event =>{
    if(event.keyCode === 13 && event.target.value.trim().length>0){
      dispatch(send(context, event.target.value.trim()))
      event.target.value = '';
    }
  }
  return (
    <>
      <div className="container">
        <h2 style={{textAlign: "center"}}>Chat App</h2>
          <form>
              <label>User</label>
              <input value={name} onChange={event=> setName(event.target.value.trim())} readOnly={user !== undefined} />
              <input type="button" value={user === undefined ? 'Login' : 'Logout'} onClick={setUser} />
              <label>Message</label>
              <input onKeyUp={sendMessage} readOnly={user === undefined} />
              <div className="messages">
                {
                  messages.map(({type, payload}, index)=>{
                    switch(type){
                      case LOGIN:
                        return (
                          <div key={index} className='admin'>
                            User <b>{payload}</b> has entered the chat.
                          </div>
                        )
                      case LOGOUT:
                        return (
                          <div key={index} className='admin'>
                            User <b>{payload}</b> has left the chat.
                          </div>
                        )
                      case CHAT:
                        return (
                          <div key={index} className={payload.from === user ? 'me' : 'other'}>
                            <b>{payload.from}:</b> {payload.text}
                          </div>
                        )
                      default:
                        return (
                          <div key={index}>
                            `Unknown message type ${type}.`
                          </div>
                        )
                    }
                  })
                }
              </div>
          </form>
      </div>
    </>
  )
}

export default App
