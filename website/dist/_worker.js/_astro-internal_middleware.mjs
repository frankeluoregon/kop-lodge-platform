globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_BP5JkySj.mjs';
import './chunks/astro/server_XPN6sfq-.mjs';
import { s as sequence } from './chunks/index_CinJ-tXx.mjs';

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
