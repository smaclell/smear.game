type Result = {
  debug: boolean;
  solo: boolean;
};

export function getDebugSettings(): Result {
  const url = new URL(location.toString());
  const params = new URLSearchParams(url.search);
  const debug = params.get('debug') === 'true';
  const solo = params.get('solo') === 'true';

  return {
    debug,
    solo,
  };
}
