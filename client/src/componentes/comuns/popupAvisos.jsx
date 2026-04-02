import { Botao } from './botao';
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
              <span className="popupAvisosSelo">
                {aviso.icone || 'Agenda'}
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
