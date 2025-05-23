import configByCode from "./projectConfigCode";
import { configByName } from "./projectConfigName";

export const PROJECT_CONFIG = "eoe";
//
export const eoeApp = 'eoe';
export const hmerApp = 'hmer';
export const hvnStockApp = 'stock';
export const adhocApp = 'adhoc';
export const acecookApp = 'acecook';
export const brsApp = 'brs';
export const vpmApp = 'vpm';
// 
export default [eoeApp, hmerApp, adhocApp, hvnStockApp, acecookApp, brsApp, vpmApp].includes(PROJECT_CONFIG) ? configByName(PROJECT_CONFIG) : configByCode; 