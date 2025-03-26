import './css/app.css';
import './css/style.css';
import { init } from './util/init';
import { procedure } from './procedure/procedure';

// import SVG, apply initial settings, create global data object
init();

// run community-specific procedure
await procedure();
