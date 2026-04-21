import { AvatarFornecedor } from './fornecedores-avatarFornecedor';
import { AcoesRegistro } from '../comuns/acoesRegistro';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { TextoGradeClamp } from '../comuns/textoGradeClamp';
import { obterCodigoPrincipalFornecedor } from '../../utilitarios/codigoFornecedor';
import { registroEstaAtivo } from '../../utilitarios/statusRegistro';
import { obterValorGrid } from '../../utilitarios/valorPadraoGrid';

export function LinhaFornecedor({ empresa, fornecedor, aoConsultar, aoEditar, aoInativar }) {
  const ativo = registroEstaAtivo(fornecedor.status);

  return (
    <tr className="LinhaFornecedor">
      <td className="colunaGradeMidia"><AvatarFornecedor fornecedor={fornecedor} /></td>
      <td className="colunaGradeCodigo">
        <CodigoRegistro valor={obterCodigoPrincipalFornecedor(fornecedor, empresa) || 0} />
      </td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.nomeFantasia || fornecedor.razaoSocial)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.cnpj)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.cidade)}</TextoGradeClamp></td>
      <td className="colunaGradeSigla">{obterValorGrid(fornecedor.estado)}</td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.nomeContatoPrincipal)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.emailContatoPrincipal)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(fornecedor.nomeComprador)}</TextoGradeClamp></td>
      <td className="colunaGradeStatus">
        <span className={`etiquetaStatus ${ativo ? 'ativo' : 'inativo'}`}>
          {ativo ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="colunaGradeAcoes">
        <AcoesRegistro
          rotuloConsulta="Consultar fornecedor"
          rotuloEdicao="Editar fornecedor"
          rotuloInativacao="Inativar fornecedor"
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoInativar}
        />
      </td>
    </tr>
  );
}

