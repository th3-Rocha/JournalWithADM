export function replaceSpaceWithUnderscore(title: string) {
  const titleNFD = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return titleNFD.toLowerCase().split(' ').join('-');
}
