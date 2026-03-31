import { ModalCadastroConfiguracao } from './modalCadastroConfiguracao';

export function ModalUnidadesMedida({
  aberto,
  registros,
  somenteConsulta = false,
  fecharAoSalvar = false,
  aoFechar,
  aoSalvar,
  aoInativar,
  aoSelecionarUnidade
}) {
  async function tratarSalvarConcluido(registroSalvo) {
    if (typeof aoSelecionarUnidade === 'function' && registroSalvo?.idUnidade) {
      await aoSelecionarUnidade(registroSalvo);
    }

    if (fecharAoSalvar) {
      aoFechar();
    }
  }

  return (
    <ModalCadastroConfiguracao
      aberto={aberto}
      titulo="Unidades de Medida"
      rotuloIncluir="Incluir unidade"
      registros={registros}
      chavePrimaria="idUnidade"
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
