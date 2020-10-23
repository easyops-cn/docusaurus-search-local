import {
  HighlightChunk,
  MetadataPosition,
  ChunkIndexRef,
} from "../../shared/interfaces";
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
  const chunkIndexRef: ChunkIndexRef = {
    chunkIndex: -1,
  };
  const chunks = splitIntoChunks(
    content,
    positions,
    tokens,
    0,
    0,
    chunkIndexRef
  );

  const leadingChunks = chunks.slice(0, chunkIndexRef.chunkIndex);
  const firstChunk = chunks[chunkIndexRef.chunkIndex];
  const html: string[] = [firstChunk.html];
  const trailingChunks = chunks.slice(chunkIndexRef.chunkIndex + 1);

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
  tokens: string[],
  positionIndex: number,
  cursor: number,
  chunkIndexRef?: ChunkIndexRef
): HighlightChunk[] {
  const chunks: HighlightChunk[] = [];
  const [start, length] = positions[positionIndex];
  if (start < cursor) {
    positionIndex += 1;
    if (positionIndex < positions.length) {
      chunks.push(
        ...splitIntoChunks(content, positions, tokens, positionIndex, cursor)
      );
    }
  } else {
    if (start > cursor) {
      chunks.push(
        ...looseTokenize(content.substring(cursor, start)).map((token) => ({
          html: escapeHtml(token),
          textLength: token.length,
        }))
      );
    }
    if (chunkIndexRef) {
      chunkIndexRef.chunkIndex = chunks.length;
    }
    chunks.push({
      html: highlight(content.substr(start, length), tokens, true),
      textLength: length,
    });
    const nextCursor = start + length;
    positionIndex += 1;
    if (positionIndex < positions.length) {
      chunks.push(
        ...splitIntoChunks(
          content,
          positions,
          tokens,
          positionIndex,
          nextCursor
        )
      );
    } else {
      if (nextCursor < content.length) {
        chunks.push(
          ...looseTokenize(content.substr(nextCursor)).map((token) => ({
            html: escapeHtml(token),
            textLength: token.length,
          }))
        );
      }
    }
  }
  return chunks;
}
