import { assistant } from './assistant';
import { cci } from './cci';
import { retention } from './retention';
import { registerMessages } from '../registry';
import { documents } from './documents';
import { dashboard } from './dashboard';
import { employees } from './employees';
import { government } from './government';

// Register existing namespaces
registerMessages('assistant', assistant);
registerMessages('cci', cci);
registerMessages('retention', retention);
registerMessages('documents', documents);

// Register Phase 17 namespaces
registerMessages('dashboard', dashboard);
registerMessages('employees', employees);
registerMessages('government', government);

// If you add more namespaces, import and register them here.