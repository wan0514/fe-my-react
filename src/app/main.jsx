import '../setup/setupGlobals';
import { render } from '../core/render';
import App from './App';

const root = document.getElementById('root');
render(<App name="wanja" />, root);
