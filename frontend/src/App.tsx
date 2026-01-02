import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import Auth from './components/Auth';
import Chat from './components/Chat';

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState('');

  const handleLogout = () => {
    setCurrentUser('');
    // Optional: Disconnect socket or refresh
    window.location.reload();
  };

  return (
    <div className="w-full h-full font-sans antialiased text-white">
      {!currentUser ? (
        <Auth onLogin={setCurrentUser} />
      ) : (
        <Chat currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
