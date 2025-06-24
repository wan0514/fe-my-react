import Sample from './Sample';
import { useState } from '../core/useState';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="container">
      <button onClick={() => setCount((prev) => prev + 1)}>
        부모 버튼 : ${count}
      </button>
      <Sample parentCount={count} />
    </div>
  );
}
