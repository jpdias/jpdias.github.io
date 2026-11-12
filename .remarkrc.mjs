import remarkFrontmatter from "remark-frontmatter";
import remarkLintFrontmatterSchema from "remark-lint-frontmatter-schema";

export default {
  plugins: [
    remarkFrontmatter,
    [
      remarkLintFrontmatterSchema,
      {
        schemas: {
          "./schemas/post.schema.json": ["_posts/**/*.md"],
          "./schemas/page.schema.json": [
            "index.md",
            "talks.md",
            "publications.md",
            "contact.md",
            "404.md",
          ],
        },
      },
    ],
  ],
};
