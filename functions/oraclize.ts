import { KhaosEventData } from './../oracle/getData/getData'

export type Oraclize = (secret: string, data: KhaosEventData) => Promise<string>
