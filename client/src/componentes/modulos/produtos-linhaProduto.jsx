import { AcoesRegistro } from '../comuns/acoesRegistro';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { TextoGradeClamp } from '../comuns/textoGradeClamp';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { registroEstaAtivo } from '../../utilitarios/statusRegistro';
import { obterValorGrid } from '../../utilitarios/valorPadraoGrid';
import { ImagemProduto } from './produtos-imagemProduto';

export function LinhaProduto({
  produto,
  aoConsultar,
  aoEditar,
  aoInativar,
  somenteConsulta = false
}) {
  const ativo = registroEstaAtivo(produto.status);

  return (
    <tr className="linhaProduto">
      <td className="colunaGradeMidia"><ImagemProduto produto={produto} /></td>
      <td className="colunaGradeCodigo"><CodigoRegistro valor={produto.idProduto} /></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(produto.referencia)}</TextoGradeClamp></td>
      <td className="colunaGradeTextoPrincipal"><TextoGradeClamp>{obterValorGrid(produto.descricao)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(produto.nomeGrupo)}</TextoGradeClamp></td>
      <td className="colunaGradeTexto"><TextoGradeClamp>{obterValorGrid(produto.nomeMarca)}</TextoGradeClamp></td>
      <td className="colunaGradeTextoCurto"><TextoGradeClamp>{obterValorGrid(produto.nomeUnidade)}</TextoGradeClamp></td>
      <td className="colunaGradeValor">{normalizarPreco(produto.custo)}</td>
      <td className="colunaGradeStatus">
        <span className={`etiquetaStatus ${ativo ? 'ativo' : 'inativo'}`}>
          {ativo ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="colunaGradeAcoes">
        <AcoesRegistro
          rotuloConsulta="Consultar produto"
          rotuloEdicao="Editar produto"
          rotuloInativacao="Inativar produto"
          exibirEdicao={!somenteConsulta}
          exibirInativacao={!somenteConsulta}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoInativar}
        />
      </td>
    </tr>
  );
}

