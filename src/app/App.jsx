import { useState } from '../core/useState';
import TodoApp from './TodoApp';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="container">
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <TodoApp key="mainTodo" />
    </div>
  );
}
