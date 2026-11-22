export function AboutPage(): Node {
  return (
    <section className="card stack">
      <h2>How this app is layered</h2>
      <ol>
        <li><strong>domain/</strong> — types and pure rules (no I/O).</li>
        <li><strong>services/</strong> — a <code>UserRepository</code> interface with HTTP and in-memory implementations, plus the directory service.</li>
        <li><strong>state/</strong> — a tiny observable store shared by every page.</li>
        <li><strong>router/</strong> — hash routes as a union type.</li>
        <li><strong>ui/</strong> — components that only read state and call services.</li>
        <li><strong>main.tsx</strong> — the composition root that wires it all together.</li>
      </ol>
    </section>
  );
}

export function NotFoundPage({ path }: { path: string }): Node {
  return (
    <section className="notice">
      Nothing lives at <code>{path}</code>. <a href="#/">Go home</a>
    </section>
  );
}
