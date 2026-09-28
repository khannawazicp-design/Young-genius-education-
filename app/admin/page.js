'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
export default function Admin() {
  const [user, setUser] = useState(null), [s, setS] = useState(null), [posts, setPosts] = useState([]), [regs, setRegs] = useState([]), [msg, setMsg] = useState('')
  useEffect(() => { sb.auth.getSession().then(r => setUser(r.data.session?.user || null)) }, [])
  async function load() {
    setS((await sb.from('settings').select('*').eq('id', 1).single()).data)
    setPosts((await sb.from('posts').select('*').order('created_at', { ascending: false })).data || [])
    setRegs((await sb.from('registrations').select('*').order('created_at', { ascending: false })).data || [])
  }
  useEffect(() => { if (user) load() }, [user])
  async function login(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target))
    const { data, error } = await sb.auth.signInWithPassword(f)
    if (error) setMsg('Wrong email or password.'); else setUser(data.user)
  }
  async function save(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); f.fee = +f.fee
    const { error } = await sb.from('settings').update(f).eq('id', 1)
    setMsg(error ? 'Not allowed: ' + error.message : 'Saved.'); load()
  }
  async function addPost(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target))
    const { error } = await sb.from('posts').insert(f)
    if (!error) e.target.reset(); setMsg(error ? 'Not allowed.' : 'Added.'); load()
  }
  async function del(id) { await sb.from('posts').delete().eq('id', id); load() }
  if (!user) return (<form className="card" onSubmit={login}><h2>Admin login</h2>
    <label>Email</label><input name="email" type="email" required /><label>Password</label><input name="password" type="password" required />
    <button>Log in</button><p>{msg}</p></form>)
  if (!s) return <p>Loading...</p>
  return (<>
    <h2>Settings</h2><form className="card" onSubmit={save}>
      <label>Registration fee (Rs.)</label><input name="fee" type="number" defaultValue={s.fee} />
      <label>Deadline</label><input name="deadline" type="date" defaultValue={s.deadline} />
      <label>Test date</label><input name="test_date" type="date" defaultValue={s.test_date} />
      <label>Status</label><select name="status" defaultValue={s.status}><option>Open</option><option>Closed</option></select>
      <label>Announcement</label><textarea name="announcement" rows="3" defaultValue={s.announcement} />
      <button>Save changes</button></form>
    <h2>Add school, student or news</h2><form className="card" onSubmit={addPost}>
      <label>Type</label><select name="kind"><option value="school">Top school</option><option value="student">Top student</option><option value="news">News</option></select>
      <label>Title</label><input name="title" required /><label>Details</label><textarea name="body" rows="3" />
      <button>Add</button><p className="ok">{msg}</p></form>
    {posts.map(p => <div className="card" key={p.id}><b>{p.kind}: {p.title}</b> <button onClick={() => del(p.id)}>Delete</button></div>)}
    <h2>Registrations ({regs.length})</h2><div style={{overflowX:'auto'}}><table><thead><tr><th>Student</th><th>School</th><th>Class</th><th>Country</th><th>Phone</th></tr></thead>
      <tbody>{regs.map(r => <tr key={r.id}><td>{r.student}</td><td>{r.school}</td><td>{r.class_group}</td><td>{r.country}</td><td>{r.phone}</td></tr>)}</tbody></table></div>
    <button onClick={() => sb.auth.signOut().then(() => setUser(null))}>Log out</button>
  </>)
}
