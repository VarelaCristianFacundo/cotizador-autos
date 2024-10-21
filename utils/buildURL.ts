import { AllianzI, MercantilI, RusI } from "./interfaces.aseguradoras";

export function buildUrlWithoutDefaults(params: RusI): string {
  const baseUrl = "/api/cotizador?";
  const queryParts: string[] = [];

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      queryParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      );
    }
  }

  return baseUrl + queryParts.join("&");
}

export function buildUrlWithDefaults(
  params: RusI | MercantilI | AllianzI,
  defaults: RusI | MercantilI | AllianzI
): string {
  const baseUrl = "/api/cotizador?";
  const finalParams = { ...defaults, ...params };
  const queryParts: string[] = [];

  for (const key in finalParams) {
    queryParts.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(finalParams[key])}`
    );
  }

  return baseUrl + queryParts.join("&");
}
