import { ModalCadastroConfiguracao } from './modalCadastroConfiguracao';

export function ModalGruposProduto({
  aberto,
  registros,
  somenteConsulta = false,
  fecharAoSalvar = false,
  aoFechar,
  aoSalvar,
  aoInativar,
  aoSelecionarGrupo
}) {
  async function tratarSalvarConcluido(registroSalvo) {
    if (typeof aoSelecionarGrupo === 'function' && registroSalvo?.idGrupo) {
      await aoSelecionarGrupo(registroSalvo);
    }

    if (fecharAoSalvar) {
      aoFechar();
    }
  }

  return (
    <ModalCadastroConfiguracao
      aberto={aberto}
      titulo="Grupos de Produto"
      rotuloIncluir="Incluir grupo"
      registros={registros}
      chavePrimaria="idGrupo"
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
