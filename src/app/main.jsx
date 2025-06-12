import '../setup/setupGlobals';
import { render } from '../core/render';

const element = (
  <div className="container">
    <h1 className="title">Welcome to My App</h1>
    <section className="intro">
      <p>Hello, this is a simple custom renderer demo.</p>
      <ul>
        <li>Supports JSX</li>
        <li>Handles nested elements</li>
        <li>Applies basic props like className</li>
      </ul>
    </section>
  </div>
);

const root = document.getElementById('root');
render(element, root);
