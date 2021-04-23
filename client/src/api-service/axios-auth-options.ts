interface Params {
  [key: string]: string;
}

const makeOptionsObj = (accessToken: string, params?: Params) => {
  if (!params) {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  };
};

export { makeOptionsObj };
