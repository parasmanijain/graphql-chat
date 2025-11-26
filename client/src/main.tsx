import 'bulma/css/bulma.css';
import './style.css';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
