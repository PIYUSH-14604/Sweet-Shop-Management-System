import React, { useEffect, useState } from 'react'
import Api from './api'

export default function Admin(){
  const [sweets, setSweets] = useState([])
  const [form, setForm] = useState({ name:'', category:'', price:'', quantity:'' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name:'', category:'', price:'', quantity:'' })

  async function load(){
    try{ const data = await Api.get('/sweets'); setSweets(data) }catch(err){ console.error(err) }
  }

  useEffect(()=>{ load() }, [])

  async function add(e){
    e.preventDefault()
    try{
      await Api.post('/sweets', { name: form.name, category: form.category, price: Number(form.price), quantity: Number(form.quantity) })
      setForm({ name:'', category:'', price:'', quantity:'' })
      load()
    }catch(err){ alert(err?.response?.data?.message || err.message) }
  }

  function startEdit(s){
    setEditingId(s._id)
    setEditForm({ name: s.name, category: s.category, price: s.price, quantity: s.quantity })
  }

  async function saveEdit(e){
    e.preventDefault()
    try{
      await Api.put(`/sweets/${editingId}`, { name: editForm.name, category: editForm.category, price: Number(editForm.price), quantity: Number(editForm.quantity) })
      setEditingId(null)
      load()
    }catch(err){ alert(err?.response?.data?.message || err.message) }
  }

  function cancelEdit(){ setEditingId(null) }

  async function remove(id){ if (!confirm('Delete?')) return; await Api.delete(`/sweets/${id}`); load() }
  async function restock(id){ const qty = Number(prompt('Quantity to add', '10')||'0'); if (qty>0) { await Api.post(`/sweets/${id}/restock`, { quantity: qty }); load() } }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Admin: Manage Sweets</h2>
      <form onSubmit={add} style={{ marginBottom: 12 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} style={{ marginLeft: 8 }} />
        <input placeholder="Price" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} style={{ marginLeft: 8 }} />
        <input placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} style={{ marginLeft: 8 }} />
        <button style={{ marginLeft: 8 }} type="submit">Add</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {sweets.map(s => (
          <div key={s._id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, background:'#fff' }}>
            {editingId===s._id ? (
              <form onSubmit={saveEdit}>
                <input value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} />
                <input value={editForm.category} onChange={e=>setEditForm({...editForm, category: e.target.value})} style={{ marginLeft: 6 }} />
                <input value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} style={{ marginLeft: 6 }} />
                <input value={editForm.quantity} onChange={e=>setEditForm({...editForm, quantity: e.target.value})} style={{ marginLeft: 6 }} />
                <div style={{ marginTop: 8 }}>
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <strong>{s.name}</strong>
                <div style={{ marginTop: 6 }}>{s.category} — ${s.price}</div>
                <div style={{ marginTop: 6 }}>Qty: {s.quantity}</div>
                <div style={{ marginTop: 8 }}>
                  <button onClick={()=>startEdit(s)}>Edit</button>
                  <button onClick={()=>restock(s._id)} style={{ marginLeft: 8 }}>Restock</button>
                  <button onClick={()=>remove(s._id)} style={{ marginLeft: 8 }}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
