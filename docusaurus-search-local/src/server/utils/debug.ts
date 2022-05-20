import createDebug from "debug";

const debug = createDebug("search-local");
export const debugVerbose = debug.extend("verbose");
export const debugInfo = debug.extend("info");
export const debugWarn = debug.extend("warn");
