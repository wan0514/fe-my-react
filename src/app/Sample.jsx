import { useState } from '../core/useState';

export default function Sample() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      자식버튼 : {count}
    </button>
  );
}
