import { AvatarFornecedor } from './fornecedores-avatarFornecedor';
import { AcoesRegistro } from '../comuns/acoesRegistro';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { TextoGradeClamp } from '../comuns/textoGradeClamp';
import { obterCodigoPrincipalCliente } from '../../utilitarios/codigoCliente';
import { registroEstaAtivo } from '../../utilitarios/statusRegistro';
import { obterValorGrid } from '../../utilitarios/valorPadraoGrid';

export function LinhaFornecedor({ empresa, cliente, aoConsultar, aoEditar, aoInativar }) {
  const ativo = registroEstaAtivo(cliente.status);

  return (
    <tr className="LinhaFornecedor">
      <td className="colunaGradeMidia"><AvatarFornecedor cliente={cliente} /></td>
      <td className="colunaGradeCodigo">
        <CodigoRegistro valor={obterCodigoPrincipalCliente(cliente, empresa) || 0} />
      </td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.nomeFantasia || cliente.razaoSocial)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.cnpj)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.cidade)}</TextoGradeClamp></td>
      <td className="colunaGradeSigla">{obterValorGrid(cliente.estado)}</td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.nomeContatoPrincipal)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.emailContatoPrincipal)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(cliente.nomeVendedor)}</TextoGradeClamp></td>
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

