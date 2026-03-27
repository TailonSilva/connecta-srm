import { CabecalhoPadrao } from './cabecalhoPadrao';
import { CorpoPadrao } from './corpoPadrao';

export function PaginaPadrao({ pagina }) {
  return (
    <>
      <CabecalhoPadrao titulo={pagina.titulo} descricao={pagina.descricao} />
      <CorpoPadrao pagina={pagina} />
    </>
  );
}
