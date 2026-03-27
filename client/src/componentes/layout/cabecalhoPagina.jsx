export function CabecalhoPagina({ titulo, descricao }) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>

      <div className="campoBusca" aria-label="Busca visual">
        <span className="iconeBusca" />
      </div>
    </header>
  );
}
