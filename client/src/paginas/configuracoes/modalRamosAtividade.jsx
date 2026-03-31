import { ModalCadastroConfiguracao } from './modalCadastroConfiguracao';

export function ModalRamosAtividade({
  aberto,
  registros,
  somenteConsulta = false,
  fecharAoSalvar = false,
  aoFechar,
  aoSalvar,
  aoInativar,
  aoSelecionarRamo
}) {
  async function tratarSalvarConcluido(registroSalvo) {
    if (typeof aoSelecionarRamo === 'function' && registroSalvo?.idRamo) {
      await aoSelecionarRamo(registroSalvo);
    }

    if (fecharAoSalvar) {
      aoFechar();
    }
  }

  return (
    <ModalCadastroConfiguracao
      aberto={aberto}
      titulo="Ramos de Atividade"
      rotuloIncluir="Incluir ramo"
      registros={registros}
      chavePrimaria="idRamo"
      exibirConsulta={false}
      somenteConsulta={somenteConsulta}
      colunas={[
        { key: 'descricao', label: 'Descricao' }
      ]}
      camposFormulario={[
        { name: 'descricao', label: 'Descricao', required: true },
        { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
      ]}
      aoFechar={aoFechar}
      aoSalvar={aoSalvar}
      aoSalvarConcluido={tratarSalvarConcluido}
      aoInativar={aoInativar}
    />
  );
}
