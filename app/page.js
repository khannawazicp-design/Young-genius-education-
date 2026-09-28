'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
const CLASSES = ['1-2','3-4','5-6','7-8','9-10','11-12']
const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
export default function Home() {
  const [s, setS] = useState(null), [posts, setPosts] = useState([]), [msg, setMsg] = useState('')
  useEffect(() => {
    sb.from('settings').select('*').eq('id', 1).single().then(r => setS(r.data))
    sb.from('posts').select('*').order('created_at', { ascending: false }).then(r => setPosts(r.data || []))
  }, [])
  async function submit(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target))
    const { error } = await sb.from('registrations').insert(f)
    setMsg(error ? 'Could not register. Please try again.' : 'Registration received. Thank you!')
    if (!error) e.target.reset()
  }
  const list = k => posts.filter(p => p.kind === k)
  if (!s) return <p>Loading...</p>
  const open = s.status === 'Open'
  return (<>
    <div className="hero"><h1 style={{margin:0}}>Where young talent gets noticed</h1>
      <p>Class-wise tests for students in Pakistan and international students abroad.</p>
      <div className="fee">Rs. {s.fee}</div><div>Registration {open ? 'open' : 'closed'} • closes {fmt(s.deadline)} • test date {fmt(s.test_date)}</div></div>
    {s.announcement && <div className="card note"><b>Announcement</b><br />{s.announcement}</div>}
    <h2>Register</h2>
    {open ? <form className="card" onSubmit={submit}>
      <label>Student name</label><input name="student" required />
      <label>School</label><input name="school" required />
      <label>Class group</label><select name="class_group">{CLASSES.map(c => <option key={c}>{c}</option>)}</select>
      <label>Country</label><input name="country" defaultValue="Pakistan" required />
      <label>Parent phone / WhatsApp</label><input name="phone" required />
      <button>Submit registration</button><p className="ok">{msg}</p></form> : <p className="card">Registration is closed.</p>}
    {[['school','Top schools'],['student','Top students'],['news','News and messages']].map(([k, t]) => list(k).length > 0 &&
      <section key={k}><h2>{t}</h2><div className="grid">{list(k).map(p => <div className="card" key={p.id}><b>{p.title}</b><br />{p.body}</div>)}</div></section>)}
  </>)
}
