import { StationExtension } from './extension.js';
import '@terra-money/feather.js';
import './types.js';

declare const getStationFromExtension: () => Promise<StationExtension | undefined>;

export { getStationFromExtension };
