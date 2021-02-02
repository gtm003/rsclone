import {ieFix} from './utils/ie-fix';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------
import {AppView} from './modules/views/AppView';

const appView = new AppView(document.body);
appView.init();
