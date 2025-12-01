import { Joi } from "@docusaurus/utils-validation";
import { PluginOptions } from "../../shared/interfaces";

type ValidateFn = (
  schema: Joi.Schema,
  options: PluginOptions | undefined
) => Required<PluginOptions>;

const isStringOrArrayOfStrings = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string())
);

const isBooleanOrString = Joi.alternatives().try(Joi.boolean(), Joi.string());

const isArrayOfStringsOrRegExpsOrStringOrRegExp = Joi.alternatives().try(
  Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object().regex())),
  Joi.string(),
  Joi.object().regex()
);

const schema = Joi.object<PluginOptions>({
  indexDocs: Joi.boolean().default(true),
  indexBlog: Joi.boolean().default(true),
  indexPages: Joi.boolean().default(false),
  docsRouteBasePath: isStringOrArrayOfStrings.default(["docs"]),
  blogRouteBasePath: isStringOrArrayOfStrings.default(["blog"]),
  language: isStringOrArrayOfStrings.default(["en"]),
  hashed: isBooleanOrString.default(false),
  docsDir: isStringOrArrayOfStrings.default(["docs"]),
  blogDir: isStringOrArrayOfStrings.default(["blog"]),
  removeDefaultStopWordFilter: Joi.alternatives()
    .try(Joi.boolean(), Joi.array().items(Joi.string()))
    .default([]),
  removeDefaultStemmer: Joi.boolean().default(false),
  highlightSearchTermsOnTargetPage: Joi.boolean().default(false),
  searchResultLimits: Joi.number().default(8),
  searchResultContextMaxLength: Joi.number().default(50),
  explicitSearchResultPath: Joi.boolean().default(false),
  ignoreFiles: isArrayOfStringsOrRegExpsOrStringOrRegExp.default([]),
  ignoreCssSelectors: isStringOrArrayOfStrings.default([]),
  searchBarShortcut: Joi.boolean().default(true),
  searchBarShortcutHint: Joi.boolean().default(true),
  searchBarShortcutKeymap: Joi.string().default("mod+k"),
  searchBarPosition: Joi.string().default("auto"),
  docsPluginIdForPreferredVersion: Joi.string(),
  zhUserDict: Joi.string(),
  zhUserDictPath: Joi.string(),
  searchContextByPaths: Joi.array().items(
    Joi.alternatives().try(
      Joi.string(),
      Joi.object<{ label: string | Record<string, string>; path: string }>({
        label: Joi.alternatives().try(
          Joi.string(),
          Joi.object<Record<string, string>>().pattern(
            Joi.string(),
            Joi.string()
          )
        ),
        path: Joi.string(),
      })
    )
  ),
  hideSearchBarWithNoSearchContext: Joi.boolean().default(false),
  useAllContextsWithNoSearchContext: Joi.boolean().default(false),
  forceIgnoreNoIndex: Joi.boolean().default(false),
  fuzzyMatchingDistance: Joi.number().default(1),
  synonyms: Joi.array().items(Joi.array().items(Joi.string())).default([]),
});

export function validateOptions({
  options,
  validate,
}: {
  options: PluginOptions | undefined;
  validate: ValidateFn;
}): Required<PluginOptions> {
  return validate(schema, options || {});
}
