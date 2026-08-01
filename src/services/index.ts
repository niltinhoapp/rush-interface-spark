/**
 * Ponto único de acesso aos serviços.
 * Para conectar ao backend real, substitua `mockServices` por uma
 * implementação HTTP dos mesmos contratos — nenhuma tela muda.
 */
import { mockServices } from "./mock";
import type { NuvemRushServices } from "./contracts";

export const services: NuvemRushServices = mockServices;

export type * from "./contracts";
