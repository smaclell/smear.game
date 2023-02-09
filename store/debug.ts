type Result = {
  debug: boolean;
  solo: boolean;
  name: string | null;
};

export function getDebugSettings(): Result {
  const url = new URL(location.toString());
  const params = new URLSearchParams(url.search);

  const debug = params.get('debug') === 'true';
  const solo = params.get('solo') === 'true';
  const name = params.get('name');

  return {
    debug,
    solo,
    name,
  };
}
