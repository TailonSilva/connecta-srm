import { Botao } from '../comuns/botao';

export function ModalContatoFornecedor({
  aberto,
  modo,
  formulario,
  aoAlterarCampo,
  aoFechar,
  aoSalvar
}) {
  if (!aberto) {
    return null;
  }

  const somenteLeitura = modo === 'consulta';

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <section
        className="ModalContatoFornecedor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalContato"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className="cabecalhoModalContato">
          <h3 id="tituloModalContato">
            {modo === 'consulta'
              ? 'Consultar Contato'
              : modo === 'edicao' ? 'Editar Contato' : 'Adicionar Contato'}
          </h3>
          <div className="acoesFormularioContatoModal">
            <Botao variante="secundario" type="button" onClick={aoFechar}>
              {somenteLeitura ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!somenteLeitura ? (
              <Botao variante="primario" type="button" onClick={aoSalvar}>
                {modo === 'edicao' ? 'Atualizar Contato' : 'Adicionar Contato'}
              </Botao>
            ) : null}
          </div>
        </div>

        <div className="corpoModalContato">
          <div className="gradeCamposModalFornecedor">
            <CampoFormulario label="Nome" name="nome" value={formulario.nome} onChange={aoAlterarCampo} disabled={somenteLeitura} />
            <CampoFormulario label="Cargo" name="cargo" value={formulario.cargo} onChange={aoAlterarCampo} disabled={somenteLeitura} />
            <CampoFormulario label="E-mail" name="email" type="email" value={formulario.email} onChange={aoAlterarCampo} disabled={somenteLeitura} />
            <CampoFormulario label="Telefone" name="telefone" value={formulario.telefone} onChange={aoAlterarCampo} disabled={somenteLeitura} />
            <CampoFormulario label="WhatsApp" name="whatsapp" value={formulario.whatsapp} onChange={aoAlterarCampo} disabled={somenteLeitura} />
            <div className="linhaCheckboxFormulario">
              <label className="campoCheckboxFormulario" htmlFor="statusContato">
                <input id="statusContato" type="checkbox" name="status" checked={formulario.status} onChange={aoAlterarCampo} disabled={somenteLeitura} />
                <span>Contato ativo</span>
              </label>
              <label className="campoCheckboxFormulario" htmlFor="principalContato">
                <input id="principalContato" type="checkbox" name="principal" checked={formulario.principal} onChange={aoAlterarCampo} disabled={somenteLeitura} />
                <span>Contato principal</span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }
}

function CampoFormulario({ label, name, type = 'text', ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

