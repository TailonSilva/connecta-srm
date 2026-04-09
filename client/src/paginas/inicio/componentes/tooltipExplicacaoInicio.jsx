export function TooltipExplicacaoInicio({ titulo, ajuda }) {
  if (!ajuda) {
    return null;
  }

  return (
    <span className="paginaInicioTooltipExplicacao" role="tooltip">
      <strong>{ajuda.titulo || titulo}</strong>
      {ajuda.conceito ? <span>{`Conceito: ${ajuda.conceito}`}</span> : null}
      {ajuda.calculo ? <span>{`Calculo: ${ajuda.calculo}`}</span> : null}
      {ajuda.observacao ? <span>{`Leitura: ${ajuda.observacao}`}</span> : null}
    </span>
  );
}
