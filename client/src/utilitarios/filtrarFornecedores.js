import { normalizarStatusRegistro, registroEstaAtivo } from './statusRegistro';
import { listaIncluiValorFiltro, normalizarValorComparacaoFiltro } from './compararValoresFiltro';

function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarFornecedores(fornecedores, pesquisa, filtros = {}) {
  const termo = normalizarTexto(pesquisa);

  return fornecedores.filter((fornecedor) => {
    const passouFiltros = (
      listaIncluiValorFiltro(filtros.estado, fornecedor.estado, normalizarTexto) &&
      (!filtros.cidade || normalizarTexto(fornecedor.cidade) === normalizarTexto(filtros.cidade)) &&
      (!filtros.idGrupoEmpresa || normalizarValorComparacaoFiltro(fornecedor.idGrupoEmpresa) === normalizarValorComparacaoFiltro(filtros.idGrupoEmpresa)) &&
      listaIncluiValorFiltro(filtros.idRamo, fornecedor.idRamo) &&
      listaIncluiValorFiltro(filtros.idComprador, fornecedor.idComprador) &&
      listaIncluiValorFiltro(filtros.tipo, fornecedor.tipo, normalizarTexto) &&
      listaIncluiValorFiltro(filtros.status, normalizarStatusRegistro(fornecedor.status))
    );

    if (!passouFiltros) {
      return false;
    }

    if (!termo) {
      return true;
    }

    const camposPesquisa = [
      fornecedor.idFornecedor,
      fornecedor.codigoAlternativo,
      fornecedor.nomeFantasia,
      fornecedor.razaoSocial,
      fornecedor.cnpj,
      fornecedor.cidade,
      fornecedor.estado,
      fornecedor.nomeGrupoEmpresa,
      fornecedor.nomeContatoPrincipal,
      fornecedor.emailContatoPrincipal,
      fornecedor.nomeComprador,
      registroEstaAtivo(fornecedor.status) ? 'ativo' : 'inativo'
    ];

    return camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));
  });
}
