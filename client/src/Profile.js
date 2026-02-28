import React, { useEffect, useState } from 'react';

function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setBio(data.bio || '');
        }
      } catch {}
    }
    fetchProfile();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio })
      });
      if (res.ok) setMessage('Bio updated!');
      else setMessage('Failed to update bio');
    } catch {
      setMessage('Network error');
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <div><b>Username:</b> {user.username}</div>
      <div><b>Email:</b> {user.email}</div>
      <form onSubmit={handleSave}>
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Enter your bio..." rows={4} />
        <br />
        <button type="submit">Save Bio</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default Profile;
