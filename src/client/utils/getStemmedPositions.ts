import { MatchMetadata, MetadataPosition } from "../../shared/interfaces";

export function getStemmedPositions(
  metadata: MatchMetadata,
  field: string
): MetadataPosition[] {
  const positions: MetadataPosition[] = [];
  for (const match of Object.values(metadata)) {
    if (match[field]) {
      positions.push(...match[field].position);
    }
  }

  // Put positions with lower start pos before those with higher start pos.
  // Put longer positions before shorter positions when they are the same in start pos.
  return positions.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
}
