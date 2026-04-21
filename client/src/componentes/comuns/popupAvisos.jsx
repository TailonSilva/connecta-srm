import { Botao } from './botao';
import { Icone } from './icone';
import '../../recursos/estilos/popupAvisos.css';

export function PopupAvisos({ avisos, aoFechar }) {
  if (!Array.isArray(avisos) || avisos.length === 0) {
    return null;
  }

  return (
    <div className="popupAvisosPilha" aria-live="polite" aria-atomic="false">
      {avisos.map((aviso) => (
        <div key={aviso.id} className="popupAvisosCartao" role="status">
          <div className="popupAvisosCabecalho">
            <div className="popupAvisosTitulo">
              <span className="popupAvisosSelo" aria-hidden="true">
                <Icone nome={normalizarIconeAviso(aviso.icone)} />
              </span>
              <div>
                <strong>{aviso.titulo}</strong>
                {aviso.subtitulo ? <small>{aviso.subtitulo}</small> : null}
              </div>
            </div>

            <Botao
              variante="secundario"
              icone="fechar"
              somenteIcone
              title="Fechar aviso"
              aria-label="Fechar aviso"
              onClick={() => aoFechar(aviso.id)}
            >
              Fechar aviso
            </Botao>
          </div>

          <div className="popupAvisosConteudo">
            {aviso.mensagem ? <p>{aviso.mensagem}</p> : null}
            {aviso.detalhe ? <span>{aviso.detalhe}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function normalizarIconeAviso(icone) {
  const nome = String(icone || '').trim().toLowerCase();

  if (['agenda', 'confirmar', 'fechar', 'mensagem', 'pagamento', 'cotacao', 'ordemCompra', 'fornecedores', 'contato', 'configuracoes', 'alerta'].includes(nome)) {
    return nome;
  }

  return 'agenda';
}
