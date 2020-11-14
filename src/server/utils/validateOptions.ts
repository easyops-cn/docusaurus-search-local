import Joi from "@hapi/joi";
import { PluginOptions } from "../../shared/interfaces";

type ValidateFn = (
  schema: Joi.Schema,
  options: PluginOptions | undefined
) => Required<PluginOptions>;

const isStringOrArrayOfStrings = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string())
);

const schema = Joi.object({
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
  searchResultLimits: Joi.number().default(8),
  searchResultContextMaxLength: Joi.number().default(50),
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
