import { Icone } from '../../../componentes/comuns/icone';
import '../../../recursos/estilos/indicadorResumoInicio.css';

export function IndicadorResumoInicio({
  ariaLabel,
  icone,
  titulo,
  valor,
  carregando,
  descricao,
  ajuda = null
}) {
  const valorTexto = carregando ? '...' : String(valor || '');
  const valorMonetarioCompacto = !carregando && valorTexto.startsWith('R$') && valorTexto.length >= 10;

  return (
    <section className="inicioIndicadorResumo" aria-label={ariaLabel} tabIndex={0}>
      <div className="inicioIndicadorResumoCabecalho">
        <div className="inicioIndicadorResumoConteudo">
          <span className="inicioIndicadorResumoRotulo">{titulo}</span>
          <strong className={`inicioIndicadorResumoValor ${valorMonetarioCompacto ? 'inicioIndicadorResumoValorCompacto' : ''}`.trim()}>
            {valorTexto}
          </strong>
        </div>
        <span className="inicioIndicadorResumoIcone" aria-hidden="true">
          <Icone nome={icone} />
        </span>
      </div>

      {descricao ? <p className="inicioIndicadorResumoDescricao">{descricao}</p> : null}

      {ajuda ? (
        <span className="inicioIndicadorResumoTooltip" role="tooltip">
          <strong>{ajuda.titulo || titulo}</strong>
          {ajuda.conceito ? <span>{`Conceito: ${ajuda.conceito}`}</span> : null}
          {ajuda.calculo ? <span>{`Calculo: ${ajuda.calculo}`}</span> : null}
          {ajuda.observacao ? <span>{`Leitura: ${ajuda.observacao}`}</span> : null}
        </span>
      ) : null}
    </section>
  );
}
