import {ieFix} from './utils/ie-fix';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------
import {AppView} from './modules/views/AppView';

new AppView(document.body).init();
