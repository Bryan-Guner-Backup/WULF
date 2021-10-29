<!-- TODO simplify ? The article is already laid out so the important info comes first -->

Importing an existing document to GitBook is easy. Upload it when creating a book using the _Import_ tab.

##### Accepted formats

GitBook.com currently supports importing:

| Type                      | Extension         |
| --------------------------| ----------------- |
| Microsoft Word Document   | `.doc` or `.docx` |
| DocBook v5.x              | `.xml`            |
| HTML file                 | `.html`           |

For better results, we recommend using:
* Microsoft Word 2007+ documents
* DocBook v5.x documents

For DocBook v4 documents, please consider [converting them to version 5](http://doccookbook.sourceforge.net/html/en/dbc.structure.db4-to-db5.html) for improved compatibility.

##### Conversion

This conversion generates a set of markdown files from the original document, along with a suitable `SUMMARY.md`.

For example, a document with this structure...

    [Content here becomes the book's README.md]

    * Section 1
        [Content here becomes the a chapter's README.md]
        * Section 1.1
            * Section 1.1.1
            * Section 1.1.2

        * Section 1.2

    * Section 2
        [Content here becomes the content of chapter 2]

... will be converted to a book with this structure:

    .
    ├── README.md
    ├── SUMMARY.md
    ├── section-1
    │   ├── README.md
    │   ├── section-1-1.md
    │   └── section-1-2.md
    └── section-2.md


Also, for `.docx` documents, all included images are exported to an `assets/` folder.

#### Command line

The import feature uses the [gitbook-convert](https://github.com/GitbookIO/gitbook-convert) CLI utility. If you ever need more flexibility, consider using [gitbook-convert](https://github.com/GitbookIO/gitbook-convert) locally, create a repository and import it using Git or GitHub.

[gitbook-convert](https://github.com/GitbookIO/gitbook-convert) infers a book structure from your document's structure, based on header levels. Top-level headers become chapters. Chapters are folders with a `README.md` as preface, and sub-chapters for every second-level headers. If no second-level headers are present, the chapter will consist of a single file instead of a folder.
