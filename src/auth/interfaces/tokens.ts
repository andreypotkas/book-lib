export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  email: string;
  id: number;
}
export interface TokenPayloadFromJwt extends TokenPayload {
  iat: number;
  exp: number;
}
