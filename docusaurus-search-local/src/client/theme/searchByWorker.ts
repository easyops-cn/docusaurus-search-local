import * as Comlink from "comlink";
import { SearchResult } from "../../shared/interfaces";

interface RemoteWorker {
  fetchIndexes(baseUrl: string, searchContext: string): Promise<void>;
  search(
    baseUrl: string,
    searchContext: string,
    input: string,
    limit: number
  ): Promise<SearchResult[]>;
}

function createWorker(workerUrl: URL): Worker {
  // When Webpack publicPath is set to a CDN origin, `workerUrl` will point to
  // that CDN domain. Browsers enforce that Worker scripts must be same-origin,
  // so `new Worker(cdnUrl)` would be blocked immediately.
  //
  // Workaround: create a tiny Blob-based stub worker on the *current* origin.
  // Blob URLs are always considered same-origin, so the browser accepts them.
  // Inside the stub we call `importScripts(workerUrl)` — unlike `fetch()`,
  // `importScripts` is not subject to CORS restrictions, allowing it to load
  // the script from any URL without extra server-side headers.
  if (workerUrl.origin !== location.origin) {
    const blobContent = `importScripts(${JSON.stringify(workerUrl.href)});`;
    const blob = new Blob([blobContent], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    const worker = new Worker(blobUrl);
    // Release the object URL once the Worker has had a chance to start.
    URL.revokeObjectURL(blobUrl);
    return worker;
  }

  return new Worker(workerUrl);
}

let remoteWorkerPromise: Promise<RemoteWorker> | undefined;

function getRemoteWorker() {
  if (process.env.NODE_ENV === "production" && !remoteWorkerPromise) {
    remoteWorkerPromise = (async () => {
      const Remote = Comlink.wrap(
        createWorker(new URL("./worker.js", import.meta.url))
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
  input: string,
  limit: number
): Promise<SearchResult[]> {
  if (process.env.NODE_ENV === "production") {
    const remoteWorker = await getRemoteWorker();
    return remoteWorker!.search(baseUrl, searchContext, input, limit);
  }
  return [];
}
