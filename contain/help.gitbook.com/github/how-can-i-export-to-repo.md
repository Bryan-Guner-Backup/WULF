<!-- TODO Link to guide for GitHub hosting -->

If you started writing your book on GitBook and you now want to [host its source on GitHub](can-i-host-on-github.md), don't worry, it's easy. To do so, you can either use the GitHub import tool, or operate from the command line.

#### Using the GitHub Import Tool

1. Use the **Import Tool** from GitHub:  [import.github.com/new](https://import.github.com/new)
2. Enter your GitBook git url, for example: `https://git.gitbook.com/MyName/MyBook.git` (this url can be found in your book settings).
3. Enter a name for your GitHub repository.
4. Enter your GitBook credentials (you can use your API token instead of your password) when prompted.
5. Done!

#### Using the command line

This operation will overwrite the content of the GitHub repository.

After creating a repository on GitHub:

```
# Clone your GitBook repository (you'll need to enter your username and password)
$ git clone https://git.gitbook.com/MyName/MyBook.git ./mybook

# Enter the cloned book
cd ./mybook

# Push it to Github
$ git push https://github.com/username/repo.git master --force
```
