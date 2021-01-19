import {ieFix} from './utils/ie-fix';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------
import {AppView} from './modules/views/appView';

new AppView(document.body).init();

// import appView from './views/app';


