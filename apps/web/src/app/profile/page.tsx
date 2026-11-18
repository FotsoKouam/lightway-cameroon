'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('FR');
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    apiFetch('/accounts/me').then(a => { setAccount(a); setName(a.name); setLanguage(a.language); }).catch(() => router.push('/login'));
  }, [router]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const updated = await apiFetch('/accounts/me', { method: 'PATCH', body: JSON.stringify({ name, language }) });
      setAccount(updated); setMsg('Profil mis à jour');
    } catch (e: any) { setErr(e.message); }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await apiFetch('/accounts/me/password', { method: 'PATCH', body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }) });
      setCurPwd(''); setNewPwd(''); setMsg('Mot de passe modifié');
    } catch (e: any) { setErr(e.message); }
  };

  const logout = () => { localStorage.removeItem('token'); router.push('/login'); };

  if (!account) return <p style={{ padding: 40 }}>Chargement…</p>;

  return (
    <main style={{ maxWidth: 480, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Mon profil</h1>
        <button onClick={logout} style={{ padding: '8px 20px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Déconnexion</button>
      </div>
      <p><strong>Identifiant :</strong> {account.identifier}</p>
      <p><strong>Contact :</strong> {account.contact}</p>
      <p><strong>Type :</strong> {account.kind}</p>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p style={{ color: 'red' }}>{err}</p>}

      <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <h2>Modifier le profil</h2>
        <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Nom" />
        <select style={inp} value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="FR">Français</option>
          <option value="EN">English</option>
        </select>
        <button style={btn('#1a73e8')} type="submit">Enregistrer</button>
      </form>

      <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
        <h2>Changer le mot de passe</h2>
        <input style={inp} type="password" placeholder="Mot de passe actuel" value={curPwd} onChange={e => setCurPwd(e.target.value)} required />
        <input style={inp} type="password" placeholder="Nouveau mot de passe (8 car. min)" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
        <button style={btn('#34a853')} type="submit">Modifier</button>
      </form>
    </main>
  );
}

const inp: React.CSSProperties = { padding: '12px 16px', fontSize: '1rem', borderRadius: 6, border: '1px solid #ccc' };
const btn = (bg: string): React.CSSProperties => ({ padding: '14px', fontSize: '1rem', background: bg, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 });
