import { useState } from '../core/useState';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    setTodos([...todos, text.trim()]);
    setText('');
  };

  const handleRemove = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div key="todoApp">
      <h2>Todo List</h2>
      <input
        key="input"
        type="text"
        value={text}
        onInput={(e) => setText(e.target.value)}
      />
      <button key="addBtn" onClick={handleAdd}>
        Add
      </button>
      <ul key="list">
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button key={`del-${index}`} onClick={() => handleRemove(index)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
