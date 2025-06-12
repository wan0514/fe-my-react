export default function App({ name }) {
  return (
    <div className="container">
      <h1 className="title">Welcome to My App, {name}</h1>
      <section className="intro">
        <p>Hello, this is a simple custom renderer demo.</p>
        <ul>
          <li key="1">Supports JSX</li>
          <li key="2">Handles nested elements</li>
          <li key="3">Applies basic props like className</li>
        </ul>
      </section>
    </div>
  );
}
