export default function isUUID(uuid: string) {
  let s: string | null = '' + uuid;
  if (s === null) return false;
  const res = s.match(
    '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
  );
  if (res === null) {
    return false;
  }
  return true;
}
