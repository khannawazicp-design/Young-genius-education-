import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = { title: 'Young Genius Education', description: 'Testing, Talent, Achievement, Excellence' }
export default function Root({ children }) {
  return (<html lang="en"><body>
    <header><b>Young Genius Education</b><small>Testing • Talent • Achievement • Excellence</small></header>
    <main>{children}</main>
    <SpeedInsights /></body></html>)
}
