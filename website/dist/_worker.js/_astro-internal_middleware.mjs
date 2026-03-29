globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_BpZ5DAgg.mjs';
import './chunks/astro/server_BWLNsKza.mjs';
import { s as sequence } from './chunks/index_mGReGfp4.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
