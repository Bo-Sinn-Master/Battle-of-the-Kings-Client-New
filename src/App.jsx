import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const userId = 123; // Заглушка

  useEffect(() => {
    fetch('http://localhost:8081/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'get_user', platform: window.Telegram?.WebApp?.platform || 'android' })
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h1>Battle of the Kings</h1>
      {user ? (
        <div>
          <p>Balance: {user.balance} $TSARC</p>
          <p>Energy: {user.energy}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default App;