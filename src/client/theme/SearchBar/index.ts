// istanbul ignore file
import lunr from "lunr";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.stemmer.support")(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("../../../shared/lunrLanguageZh").lunrLanguageZh(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.multi")(lunr);

import SearchBar from "./SearchBar";

export default SearchBar;
