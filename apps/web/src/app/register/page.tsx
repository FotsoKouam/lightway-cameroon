'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', contact: '', name: '', password: '', kind: 'USER', language: 'FR' });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={mainStyle}>
      <h1>Inscription</h1>
      <form onSubmit={submit} style={formStyle}>
        <input style={inputStyle} placeholder="Identifiant" value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} required />
        <input style={inputStyle} placeholder="Contact (email ou téléphone)" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
        <input style={inputStyle} placeholder="Nom affiché" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input style={inputStyle} type="password" placeholder="Mot de passe (8 car. min)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <select style={inputStyle} value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>
          <option value="USER">Utilisateur</option>
          <option value="DRIVER">Conducteur</option>
        </select>
        <select style={inputStyle} value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
          <option value="FR">Français</option>
          <option value="EN">English</option>
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button style={btnStyle} type="submit">Créer mon compte</button>
      </form>
      <p><Link href="/login">Déjà un compte ? Se connecter</Link></p>
    </main>
  );
}

const mainStyle: React.CSSProperties = { maxWidth: 400, margin: '60px auto', padding: '0 24px' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const inputStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '1rem', borderRadius: 6, border: '1px solid #ccc' };
const btnStyle: React.CSSProperties = { padding: '14px', fontSize: '1rem', background: '#34a853', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };
