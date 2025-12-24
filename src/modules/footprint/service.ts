export async function getFootprints() {
  return import('./data').then(content => content.footprints);
}
