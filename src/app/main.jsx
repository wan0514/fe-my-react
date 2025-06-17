import { render } from '../core/render';
import { setRenderFn, resetHooks } from '../core/useState';
import App from './App';

const root = document.getElementById('root');

function reRender() {
  resetHooks();
  const vnode = App();
  console.log('App re-rendered with vnode:', vnode);
  render(vnode, root);
}

setRenderFn(reRender);

render(<App name="wanja" />, root);
