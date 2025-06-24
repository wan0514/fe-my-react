import { useState } from '../core/useState';

export default function Sample() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        자식 버튼 : ${count}
      </button>
    </div>
  );
}
