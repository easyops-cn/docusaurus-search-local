import * as Comlink from "comlink";
import { SearchResult } from "../../shared/interfaces";

interface RemoteWorker {
  fetchIndexes(baseUrl: string, searchContext: string): Promise<void>;
  search(
    baseUrl: string,
    searchContext: string,
    input: string
  ): Promise<SearchResult[]>;
}

let remoteWorkerPromise: Promise<RemoteWorker> | undefined;

function getRemoteWorker() {
  if (!remoteWorkerPromise) {
    remoteWorkerPromise = (async () => {
      const Remote = Comlink.wrap(
        new Worker(new URL("./worker.js", import.meta.url))
      ) as any;
      return await new Remote();
    })();
  }
  return remoteWorkerPromise;
}

export async function fetchIndexesByWorker(
  baseUrl: string,
  searchContext: string
): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    const remoteWorker = await getRemoteWorker();
    await remoteWorker!.fetchIndexes(baseUrl, searchContext);
  }
}

export async function searchByWorker(
  baseUrl: string,
  searchContext: string,
  input: string
): Promise<SearchResult[]> {
  if (process.env.NODE_ENV === "production") {
    const remoteWorker = await getRemoteWorker();
    return remoteWorker!.search(baseUrl, searchContext, input);
  }
  return [];
}
