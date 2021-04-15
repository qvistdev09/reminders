const makeOptionsObj = (accessToken: string) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

export { makeOptionsObj };
