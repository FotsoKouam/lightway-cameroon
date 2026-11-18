import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>LightWay Cameroon</h1>
      <p style={{ color: '#555', marginBottom: 40 }}>GPS camerounais orienté prévention routière</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link href="/login" style={btnStyle('#1a73e8')}>Connexion</Link>
        <Link href="/register" style={btnStyle('#34a853')}>Inscription</Link>
      </div>
    </main>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    display: 'inline-block', padding: '14px 32px', borderRadius: 8,
    background: bg, color: '#fff', textDecoration: 'none',
    fontSize: '1.1rem', fontWeight: 600,
  };
}
