import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const userId = 123;

  useEffect(() => {
    fetch('http://localhost:8081/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'get_user', platform: 'web' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUser(data);
        } else {
          setError(data.message || 'Ошибка загрузки данных');
        }
      })
      .catch(err => setError('Ошибка соединения: ' + err.message));
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8082');
    ws.onopen = () => {
      ws.send(JSON.stringify({ user_id: userId, action: 'pvp_match' }));
    };
    ws.onmessage = (e) => {
      console.log('WebSocket:', e.data);
    };
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
    return () => ws.close();
  }, []);

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Battle of the Kings</h1>
      {user ? (
        <div>
          <p>Balance: {user.balance} $TSARC</p>
          <p>Energy: {user.energy}</p>
          <p>Buildings: {user.buildings?.length ? user.buildings.join(', ') : 'None'}</p>
          <p>Weapons: {user.weapons?.length ? user.weapons.join(', ') : 'None'}</p>
          <button onClick={() => {
            fetch('http://localhost:8081/api', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId, action: 'build', building: 'mine', platform: 'web' })
            })
              .then(res => res.json())
              .then(data => alert(JSON.stringify(data)));
          }}>Build Mine</button>
          <button onClick={() => {
            fetch('http://localhost:8081/api', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId, action: 'buy_weapon', weapon: 'sword', platform: 'web' })
            })
              .then(res => res.json())
              .then(data => alert(JSON.stringify(data)));
          }}>Buy Sword</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default App;