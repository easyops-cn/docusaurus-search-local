import Joi from "joi";
import { PluginOptions, TranslationLocaleMap } from "../../shared/interfaces";

type ValidateFn = (
  schema: Joi.Schema,
  options: PluginOptions | undefined
) => Required<PluginOptions>;

const isStringOrArrayOfStrings = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string())
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
  translations: Joi.object<TranslationLocaleMap>()
    .pattern(
      Joi.string().min(2),
      Joi.object({
        search_placeholder: Joi.string().default("Search"),
        see_all_results: Joi.string().default("See all results"),
        no_results: Joi.string().default("No results."),
        search_results_for: Joi.string().default(
          'Search results for "{{ keyword }}"'
        ),
        search_the_documentation: Joi.string().default(
          "Search the documentation"
        ),
        count_documents_found_plural: Joi.string().default(
          (parent) =>
            parent.count_documents_found ?? "{{ count }} documents found"
        ),
        count_documents_found: Joi.string().default(
          "{{ count }} document found"
        ),
        no_documents_were_found: Joi.string().default(
          "No documents were found"
        ),
      })
    )
    .default({
      en: {
        search_placeholder: "Search",
        see_all_results: "See all results",
        no_results: "No results.",
        search_results_for: 'Search results for "{{ keyword }}"',
        search_the_documentation: "Search the documentation",
        count_documents_found: "{{ count }} document found",
        count_documents_found_plural: "{{ count }} documents found",
        no_documents_were_found: "No documents were found",
      },
    }),
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
