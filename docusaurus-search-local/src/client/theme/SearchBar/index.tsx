import React from "react";
import "../../utils/proxiedGenerated";
import SearchBar from "./SearchBar";
import { DocsPreferredVersionContextProvider } from "@docusaurus/plugin-content-docs/client";

export default function SearchBarWrapper(
  props: React.ComponentProps<typeof SearchBar>
): React.ReactElement {
  return (
    <DocsPreferredVersionContextProvider>
      <SearchBar {...props} />
    </DocsPreferredVersionContextProvider>
  );
}
