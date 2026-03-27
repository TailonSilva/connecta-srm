export function CabecalhoPadrao({ titulo, descricao }) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  );
}
