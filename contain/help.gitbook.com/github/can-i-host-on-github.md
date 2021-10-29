<!-- TODO Reuse the article from documentation/doc-separation and make a it _guide_ -->

GitBook integrates perfectly with [GitHub](https://github.com) as a hosting solution for the source of your book. When configured correctly, this has several effects:

- The Editor will make changes directly to the GitHub repository
- GitBook will watch for updates on GitHub and trigger website/pdf updates accordingly

Integrating with GitHub is done in 3 steps:

1. Setting up [permissions](#permissions)
2. [Linking your book](#linking) to a GitHub repository
3. Setting up [webhooks](#webhooks)


### 1. Setting up permissions {#permissions}

To integrate your book with GitHub, you need to authorize GitBook to access your GitHub account to some extent. From your [account's settings](https://www.gitbook.com/settings), connect your GitHub account and choose what you will allow:

- **Default permissions**: Allows you to authenticate with GitHub on GitBook.
- **Access to public repositories**: Allows editing books on your public GitHub repositories from the GitBook Web editor.
- **Access to private repositories**: Same as above, but for private repositories too.
- **Access to webhook**: Allows GitBook to create webhooks on your book repositories to trigger builds automatically.


### 2. Linking your book to a GitHub repository {#linking}

From your book's GitHub settings page, you can easily specify to which GitHub repository your book will be linked.

In the input form, type in the name of your book's repository in the following format:

`<github-username>/<github-repository-name>`

Note that you shouldn't enter neither the full GitHub address, nor the `.git` extension.

Finally, click on the **Save** button.


### 3. Setting up webhooks {#webhooks}

The final step is to configure a webhook on your GitHub repository that will let GitBook know when your repository is updated.

After completing [step 2.](#linking), a new **Integration** panel will appear on your book's GitHub settings page.
To add the webhook, you can either:

- Click on the **Add webhook** button to automatically create the webhook in your GitHub repo
- Add the provided **Webhook URL** manually to your GitHub repository with access to **Push** events

Either way, clicking on the **Check webhooks** button will lead you to your GitHub repo settings page where you should see the newly created webhook.

The next push event to your GitHub repository will trigger a new update of your book on GitBook.