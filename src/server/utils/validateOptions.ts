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
  hashed: Joi.boolean().default(false),
  docsDir: isStringOrArrayOfStrings.default(["docs"]),
  blogDir: isStringOrArrayOfStrings.default(["blog"]),
  removeDefaultStopWordFilter: Joi.boolean().default(false),
  highlightSearchTermsOnTargetPage: Joi.boolean().default(false),
  searchResultLimits: Joi.number().default(8),
  searchResultContextMaxLength: Joi.number().default(50),
  explicitSearchResultPath: Joi.boolean().default(false),
  ignoreFiles: isArrayOfStringsOrRegExpsOrStringOrRegExp.default([]),
  translations: Joi.object<TranslationMap>({
    search_placeholder: Joi.string().default("Search"),
    see_all_results: Joi.string().default("See all results"),
    no_results: Joi.string().default("No results."),
    search_results_for: Joi.string().default(
      'Search results for "{{ keyword }}"'
    ),
    search_the_documentation: Joi.string().default("Search the documentation"),
    count_documents_found_plural: Joi.string().default(
      (parent) => parent.count_documents_found ?? "{{ count }} documents found"
    ),
    count_documents_found: Joi.string().default("{{ count }} document found"),
    no_documents_were_found: Joi.string().default("No documents were found"),
  })
    .default()
    .unknown(false),
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
