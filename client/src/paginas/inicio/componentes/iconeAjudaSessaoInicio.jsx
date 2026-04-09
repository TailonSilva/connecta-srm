import { Icone } from '../../../componentes/comuns/icone';

export function IconeAjudaSessaoInicio({ titulo, ajuda }) {
  if (!ajuda) {
    return null;
  }

  return (
    <span className="paginaInicioAjudaSessao" tabIndex={0} aria-label={`Informacoes sobre ${titulo || 'a sessao'}`}>
      <Icone nome="informacao" className="paginaInicioAjudaSessaoIcone" />
      <span className="paginaInicioTooltipExplicacao" role="tooltip">
        <strong>{ajuda.titulo || titulo}</strong>
        {ajuda.conceito ? <span>{`Conceito: ${ajuda.conceito}`}</span> : null}
        {ajuda.calculo ? <span>{`Calculo: ${ajuda.calculo}`}</span> : null}
        {ajuda.observacao ? <span>{`Leitura: ${ajuda.observacao}`}</span> : null}
      </span>
    </span>
  );
}
