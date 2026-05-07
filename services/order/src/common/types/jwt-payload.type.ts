export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export type JwtClaims = {
  id: string;
  email: string;
  role: string;
};
