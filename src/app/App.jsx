import Sample from './Sample';
import { useState } from '../core/useState';

export default function App() {
  const [count, setCount] = useState(0);
  const [완자는살수있는가, set완자는살수있는가] = useState(false);

  return (
    <div className="container">
      <h1 className="title">Welcome to My App</h1>
      <section className="intro">
        <p>Hello, this is a simple custom renderer demo.</p>
        <ul>
          <li key="1">Supports JSX</li>
          <li key="2">Handles nested elements</li>
          <li key="3">Applies basic props like className</li>
        </ul>

        <button onClick={() => setCount((prev) => prev + 1)}>
          버튼 {count}
        </button>

        <button onClick={() => set완자는살수있는가((prev) => !prev)}>
          완자를 살리는 버튼 , 현재 상태 {String(완자는살수있는가)}
        </button>
      </section>
      <Sample />
    </div>
  );
}
