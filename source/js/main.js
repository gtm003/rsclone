import {ieFix} from './utils/ie-fix';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------
import {appView} from './modules/views/app';

new appView(document.body).init();

//import appView from './views/app';


