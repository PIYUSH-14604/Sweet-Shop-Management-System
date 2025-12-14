import React, { useState } from 'react'
import Api from './api'

export default function Auth({ onAuth }){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault(); setError(null)
    try{
      if (mode==='register'){
        await Api.post('/auth/register', { email, password, role })
        // auto-login
        const res = await Api.post('/auth/login', { email, password })
        onAuth(res)
      } else {
        const res = await Api.post('/auth/login', { email, password })
        onAuth(res)
      }
    }catch(err){
      const msg = err?.response ? `${err.response.status} ${err.response.statusText} - ${err.response.data?.message || JSON.stringify(err.response.data)}` : err.message
      setError(msg)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={()=>setMode('login')} disabled={mode==='login'}>Login</button>
        <button onClick={()=>setMode('register')} disabled={mode==='register'} style={{ marginLeft: 8 }}>Register</button>
      </div>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {mode==='register' ? (
          <div>
            <label>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ) : null}
        <div style={{ marginTop: 12 }}>
          <button type="submit">{mode==='login' ? 'Login' : 'Register'}</button>
        </div>
        {error ? <div style={{ color: 'red', marginTop: 8 }}>{error}</div> : null}
      </form>
    </div>
  )
}
