import { HighlightChunk, MetadataPosition } from "../../shared/interfaces";
import { escapeHtml } from "./escapeHtml";
import { highlight } from "./highlight";
import { looseTokenize } from "./looseTokenize";
import { searchResultContextMaxLength } from "./proxiedGenerated";

export function highlightStemmed(
  content: string,
  positions: MetadataPosition[],
  tokens: string[],
  maxLength = searchResultContextMaxLength
): string {
  const { chunkIndex, chunks } = splitIntoChunks(content, positions, tokens);

  const leadingChunks = chunks.slice(0, chunkIndex);
  const firstChunk = chunks[chunkIndex];
  const html: string[] = [firstChunk.html];
  const trailingChunks = chunks.slice(chunkIndex + 1);

  let currentLength = firstChunk.textLength;
  let leftPadding = 0;
  let rightPadding = 0;
  let leftOverflowed = false;
  let rightOverflowed = false;

  while (currentLength < maxLength) {
    if (
      (leftPadding <= rightPadding || trailingChunks.length === 0) &&
      leadingChunks.length > 0
    ) {
      const chunk = leadingChunks.pop() as HighlightChunk;
      if (currentLength + chunk.textLength <= maxLength) {
        html.unshift(chunk.html);
        leftPadding += chunk.textLength;
        currentLength += chunk.textLength;
      } else {
        leftOverflowed = true;
        leadingChunks.length = 0;
      }
    } else if (trailingChunks.length > 0) {
      const chunk = trailingChunks.shift() as HighlightChunk;
      if (currentLength + chunk.textLength <= maxLength) {
        html.push(chunk.html);
        rightPadding += chunk.textLength;
        currentLength += chunk.textLength;
      } else {
        rightOverflowed = true;
        trailingChunks.length = 0;
      }
    } else {
      break;
    }
  }

  if (leftOverflowed || leadingChunks.length > 0) {
    html.unshift("…");
  }

  if (rightOverflowed || trailingChunks.length > 0) {
    html.push("…");
  }

  return html.join("");
}

export function splitIntoChunks(
  content: string,
  positions: MetadataPosition[],
  tokens: string[]
): {
  chunkIndex: number;
  chunks: HighlightChunk[];
} {
  const chunks: HighlightChunk[] = [];
  let positionIndex = 0;
  let cursor = 0;
  let chunkIndex = -1;
  while (positionIndex < positions.length) {
    const [start, length] = positions[positionIndex];
    positionIndex += 1;
    if (start < cursor) {
      continue;
    }

    if (start > cursor) {
      const leadingChunks = looseTokenize(content.substring(cursor, start)).map(
        (token) => ({
          html: escapeHtml(token),
          textLength: token.length,
        })
      );
      for (const item of leadingChunks) {
        chunks.push(item);
      }
    }

    if (chunkIndex === -1) {
      chunkIndex = chunks.length;
    }

    cursor = start + length;
    chunks.push({
      html: highlight(content.substring(start, cursor), tokens, true),
      textLength: length,
    });
  }

  if (cursor < content.length) {
    const trailingChunks = looseTokenize(content.substring(cursor)).map(
      (token) => ({
        html: escapeHtml(token),
        textLength: token.length,
      })
    );
    for (const item of trailingChunks) {
      chunks.push(item);
    }
  }

  return {
    chunkIndex,
    chunks,
  };
}
