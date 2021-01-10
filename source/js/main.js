import {ieFix} from './utils/ie-fix';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------
import {MainPage} from './modules/MainPage';

new MainPage(document.body).init();