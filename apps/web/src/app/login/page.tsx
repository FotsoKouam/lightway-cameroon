'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { accessToken } = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(form) });
      localStorage.setItem('token', accessToken);
      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={mainStyle}>
      <h1>Connexion</h1>
      <form onSubmit={submit} style={formStyle}>
        <input style={inputStyle} placeholder="Identifiant ou contact" value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} required />
        <input style={inputStyle} type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button style={btnStyle} type="submit">Se connecter</button>
      </form>
      <p><Link href="/register">Pas encore de compte ? S&apos;inscrire</Link></p>
    </main>
  );
}

const mainStyle: React.CSSProperties = { maxWidth: 400, margin: '60px auto', padding: '0 24px' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const inputStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '1rem', borderRadius: 6, border: '1px solid #ccc' };
const btnStyle: React.CSSProperties = { padding: '14px', fontSize: '1rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };
