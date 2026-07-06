export function getPhotoWidths(aspectRatio: string): number[] {
  switch (aspectRatio) {
    case '1:1':
      return [650, 1300, 1950]
    case '3:2':
      return [975, 1950, 2925]
    case '16:9':
      return [1156, 2312, 3468]
    default:
      return [650, 1300, 1950]
  }
}
