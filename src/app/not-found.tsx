import Link from 'next/link';
export default function NotFound(){return <div className="error-page"><p className="eyebrow">404 / A DIFFERENT PATH</p><h1>Let’s find your way back.</h1><p>This page does not exist. Your learning progress is still on this device.</p><Link href="/dashboard" className="button primary">Return to overview →</Link></div>}
