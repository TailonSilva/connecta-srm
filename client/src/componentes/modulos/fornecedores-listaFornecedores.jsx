import { useMemo } from 'react';
import { GradePadrao } from '../comuns/gradePadrao';
import { AcoesRegistro } from '../comuns/acoesRegistro';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { TextoGradeClamp } from '../comuns/textoGradeClamp';
import { obterCodigoPrincipalFornecedor } from '../../utilitarios/codigoFornecedor';
import { registroEstaAtivo } from '../../utilitarios/statusRegistro';
import { obterValorGrid } from '../../utilitarios/valorPadraoGrid';
import { AvatarFornecedor as AvatarFornecedor } from './fornecedores-avatarFornecedor';
import {
  normalizarColunasGridFornecedores,
  TOTAL_COLUNAS_GRID_FORNECEDORES
} from '../../dados/colunasGridFornecedores';

export function ListaFornecedores({
  empresa,
  fornecedores,
  carregando,
  mensagemErro,
  aoEditarFornecedor,
  aoConsultarFornecedor,
  aoInativarFornecedor
}) {
  const colunasVisiveisFornecedores = useMemo(
    () => normalizarColunasGridFornecedores(empresa?.colunasGridFornecedores),
    [empresa?.colunasGridFornecedores]
  );

  return (
    <GradePadrao
      modo="layout"
      totalColunasLayout={TOTAL_COLUNAS_GRID_FORNECEDORES}
      cabecalho={<CabecalhoGradeFornecedores colunas={colunasVisiveisFornecedores} />}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={fornecedores.length > 0}
      mensagemCarregando="Carregando fornecedores..."
      mensagemVazia="Nenhum fornecedor encontrado."
    >
      {fornecedores.map((fornecedor) => (
        <LinhaFornecedor
          key={fornecedor.idFornecedor}
          empresa={empresa}
          fornecedor={fornecedor}
          colunas={colunasVisiveisFornecedores}
          aoConsultar={() => aoConsultarFornecedor(fornecedor)}
          aoEditar={() => aoEditarFornecedor(fornecedor)}
          aoInativar={() => aoInativarFornecedor(fornecedor)}
        />
      ))}
    </GradePadrao>
  );
}

function CabecalhoGradeFornecedores({ colunas }) {
  return (
    <div className="cabecalhoLayoutGradePadrao cabecalhoGradeFornecedores">
      {colunas.map((coluna) => (
        <div key={coluna.id} className={coluna.classe} style={obterEstiloColunaLayout(coluna)}>
          {coluna.rotulo}
        </div>
      ))}
    </div>
  );
}

function LinhaFornecedor({ empresa, fornecedor, colunas, aoConsultar, aoEditar, aoInativar }) {
  return (
    <div className="linhaLayoutGradePadrao linhaFornecedor">
      {colunas.map((coluna) => renderizarCelulaFornecedor({
        coluna,
        empresa,
        fornecedor,
        aoConsultar,
        aoEditar,
        aoInativar
      }))}
    </div>
  );
}

function renderizarCelulaFornecedor({ coluna, empresa, fornecedor, aoConsultar, aoEditar, aoInativar }) {
  const propriedadesCelula = {
    key: coluna.id,
    className: `celulaLayoutGradePadrao ${coluna.classe}`.trim(),
    style: obterEstiloColunaLayout(coluna)
  };

  if (coluna.id === 'imagem') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <AvatarFornecedor fornecedor={fornecedor} />
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'codigo') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={obterCodigoPrincipalFornecedor(fornecedor, empresa) || 0} />
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'idFornecedor') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={fornecedor.idFornecedor || 0} />
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'codigoAlternativo') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        {fornecedor.codigoAlternativo ? (
          <CodigoRegistro valor={fornecedor.codigoAlternativo} />
        ) : (
          '-'
        )}
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'fornecedor') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeFantasia || fornecedor.razaoSocial)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'razaoSocial') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.razaoSocial)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'nomeFantasia') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeFantasia)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'documento') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.cnpj)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'cnpj') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.cnpj)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'tipo') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.tipo)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'inscricaoEstadual') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.inscricaoEstadual)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'idGrupoEmpresa') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeGrupoEmpresa)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'idRamo') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeRamo)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'idConceito') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeConceito)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'cidade') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.cidade)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'estado') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        {obterValorGrid(fornecedor.estado)}
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'contato') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeContatoPrincipal)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'emailContatoPrincipal') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.emailContatoPrincipal)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'email') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.email)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'telefone') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.telefone)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'comprador') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeComprador)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'idComprador') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.nomeComprador)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'logradouro') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.logradouro)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'numero') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        {obterValorGrid(fornecedor.numero)}
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'complemento') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.complemento)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'bairro') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.bairro)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'cep') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.cep)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'observacao') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor.observacao)}</TextoGradeClamp>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'dataCriacao') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        {formatarDataCriacaoFornecedor(fornecedor.dataCriacao)}
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'status') {
    const ativo = registroEstaAtivo(fornecedor.status);

    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <span className={`etiquetaStatus ${ativo ? 'ativo' : 'inativo'}`}>
          {ativo ? 'Ativo' : 'Inativo'}
        </span>
      </CelulaLayoutFornecedor>
    );
  }

  if (coluna.id === 'acoes') {
    return (
      <CelulaLayoutFornecedor coluna={coluna} {...propriedadesCelula}>
        <AcoesRegistro
          rotuloConsulta="Consultar fornecedor"
          rotuloEdicao="Editar fornecedor"
          rotuloInativacao="Inativar fornecedor"
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoInativar}
        />
      </CelulaLayoutFornecedor>
    );
  }

  return null;
}

function CelulaLayoutFornecedor({ coluna, children, ...propriedades }) {
  return (
    <div {...propriedades}>
      <span className="rotuloCelulaLayoutGradePadrao">{coluna.rotulo}</span>
      {children}
    </div>
  );
}

function obterEstiloColunaLayout(coluna) {
  return {
    order: coluna.ordem,
    gridColumn: `span ${Math.max(1, Number(coluna.span || 1))}`
  };
}

function formatarDataCriacaoFornecedor(valor) {
  if (!valor) {
    return '-';
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR').format(data);
}

