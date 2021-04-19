const extractAccessToken = (header: any) => {
  if (!header || typeof header !== 'string') {
    return null;
  }
  const match = header.match(/Bearer (.+)/);
  if (!match) {
    return null;
  }
  return match[1];
};

export { extractAccessToken };
