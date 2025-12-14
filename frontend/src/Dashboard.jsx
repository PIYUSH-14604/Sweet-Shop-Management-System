import React, { useEffect, useState } from 'react'
import Api from './api'

export default function Dashboard(){
  const [sweets, setSweets] = useState([])
  const [q, setQ] = useState('')

  async function load(){
    try{
      const data = await Api.get('/sweets')
      setSweets(data)
    }catch(err){ console.error(err) }
  }

  useEffect(()=>{ load() }, [])

  async function handlePurchase(id){
    try{
      await Api.post(`/sweets/${id}/purchase`, { quantity: 1 })
      load()
    }catch(err){ alert(err?.response?.data?.message || err.message) }
  }

  const filtered = sweets.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase()))

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Search by name or category" value={q} onChange={e=>setQ(e.target.value)} style={{ width: 320 }} />
        <button onClick={load}>Refresh</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {filtered.map(s => (
          <div key={s._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, background:'#fff' }}>
            <h3 style={{ margin: 0 }}>{s.name}</h3>
            <div style={{ color: '#666', marginTop: 6 }}>{s.category}</div>
            <div style={{ marginTop: 6, fontWeight: 600 }}>${Number(s.price).toFixed(2)}</div>
            <div style={{ marginTop: 6 }}>Qty: {s.quantity}</div>
            <button disabled={s.quantity<=0} onClick={()=>handlePurchase(s._id)} style={{ marginTop: 8 }}>
              {s.quantity>0 ? 'Purchase' : 'Out of stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
