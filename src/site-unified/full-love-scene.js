import { initLoveTrioScene } from './combined-scene.js';
import { initVivenciasScene } from './vivencias-scene.js';

/**
 * Fluxo contínuo: Sorriso -> Estilo -> Academia -> Vivências.
 *
 * Não existe mais uma "ponte" artificial entre Academia e Vivências.
 * As duas partes são seções reais e adjacentes do mesmo documento, então ao
 * terminar o último frame da Academia o scroll entra diretamente no primeiro
 * frame de Vivências. Isso também torna a volta totalmente reversível.
 */
export function initFullLoveScene(root, options = {}) {
  if (!root) throw new Error('initFullLoveScene(root): root é obrigatório.');

  const assetBase = (options.assetBase || '/assets').replace(/\/$/, '');

  const host = document.createElement('section');
  host.className = 'full-love';
  host.innerHTML = `
    <div class="full-love__trio" data-full-love-trio></div>
    <div class="full-love__vivencias" data-full-love-vivencias></div>
  `;
  root.appendChild(host);

  const trioMount = host.querySelector('[data-full-love-trio]');
  const vivMount = host.querySelector('[data-full-love-vivencias]');

  const trioScene = initLoveTrioScene(trioMount, { assetBase });
  const vivenciasScene = initVivenciasScene(vivMount, { assetBase: `${assetBase}/vivencias` });

  return {
    root: host,
    trioScene,
    vivenciasScene,
    refresh() {
      trioScene.refresh?.();
      vivenciasScene.refresh?.();
    },
    destroy() {
      trioScene.destroy?.();
      vivenciasScene.destroy?.();
      host.remove();
    },
  };
}
