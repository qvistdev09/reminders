const affirmJwtString = (req: any): string | null => {
  if (!req.jwt || !req.jwt.claims || typeof req.jwt.claims.uid !== 'string') {
    return null;
  }
  return req.jwt.claims.uid;
};

export { affirmJwtString };
