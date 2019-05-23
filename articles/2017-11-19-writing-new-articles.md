---
title: Writing New Articles
tags: Tutorial
---

Articles are written in version-controlled markdown files, stored in the root `articles` directory by default. This folder can be configured by changing the `ARTICLES_FOLDER` setting in `config.py`. (If you do change it, you'll also need to update the `articles_dir_name` setting in `ansible/roles/flask/defaults/main.yaml`)

## Article File/Folder Names

An article can either be a single markdown file, like this one, or be a file named `article.md` inside a folder. The full file path must be unique, and should not be changed once the article has been imported into the database. (On import, file paths are used to look up articles in the database to see if they are new, or just being updated.) The actual file/folder name used is otherwise not important, however, the article publish date can optionally be parsed out of the file/folder name:

```
articles/
|- 2017-11-19-example-article.md
|- 2017-11-18-example-article-in-folder/
    |- article.md
```

The publish date must be formatted as `YYYY-MM-DD` for it to be picked up. Alternatively, using the same format you may place the publish date inside the article file's frontmatter:

```md
---
title: Example Article
publish_date: 2017-11-18
---

Article content here...
```

## Article Frontmatter

Frontmatter is stored in YAML format, at the top of the article files, between triple-dashes. Supported keys are:

title
:  *string* (required): The title of the article.

publish_date
:  *datestamp: YYYY-MM-DD* (optional) Default: parse file/folder name or `utcnow`.

author
:  *string* (optional): email or username of a user in the database. Default: `DEFAULT_ARTICLE_AUTHOR_EMAIL`.

header_image
:  *filename* (optional): A header background image filename in the same directory as `article.md`. Default: none.

category
:  *string* A category name (optional)

tags
:  *list (optional)* One or more tag names (can also be a `FRONTMATTER_LIST_DELIMETER`-separated string). Default: none.

Example frontmatter:

```md
---
title: This is the article's title
publish_date: 2017-10-01
author: a@a.com 
header_image: header.png
category: Development
tags: 
   - JavaScript
---

Article content here...
```

## Categories and Tags

As you saw above, the names of an article's category and tags are specified in the frontmatter. If the category/tag name does not already exist, it will be created.

## Article Series

```
articles/
|- 2017-11-18-example-article-series/
    |- series.md
    |- part-1-article-1.md
    |- part-2-article-2.md
    |- part-3-article-3.md
    |- part-4-article-4/
        |- article.md
```
