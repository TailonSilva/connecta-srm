import '../../recursos/estilos/cartaoPaginaVazia.css';

export function CartaoPaginaVazia({ titulo, descricao }) {
  return (
    <section className="cartaoPaginaVazia">
      <div className="cartaoPaginaVaziaFaixaDestaque" />
      <div className="cartaoPaginaVaziaConteudo">
        <h2>{titulo}</h2>
        <p>{descricao}</p>
      </div>
    </section>
  );
}
