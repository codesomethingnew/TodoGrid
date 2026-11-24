
import {
  HashRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Home from './Home';
import Todolist from './Todolist';
import Bookstore from './Bookstore';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div>
        <nav className="menu">
          <Link to="/">Home</Link>
          <Link to="/todolist">Todolist</Link>
          <Link to="/bookstore">Bookstore</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todolist" element={<Todolist />} />
          <Route path="/bookstore" element={<Bookstore />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
