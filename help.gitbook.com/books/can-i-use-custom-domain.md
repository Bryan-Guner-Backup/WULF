---
related:
    - books/will-my-book-be-accessible-with-https.md

---

All books on **Gitbook.com** are served under `http://{author}.gitbooks.io/{book}/`, the book's content is available at `http://{author}.gitbooks.io/{book}/content/`.

But you can also tell GitBook.com to serve your content under a custom domain. Custom domains are great to maintain branding or integrate documentation into your website.

Adding a custom domain is easy:

#### On GitBook.com

Go to your book's **Settings** tab and then click on **Domains**. Then simply enter your domain and save.

#### With your domain registrar

To finish the setup you will need to make a few changes with your domain registrar:

1. Login to your domain registrar and find the page that allows you to add/edit host records. That page is often found in your settings under `Edit DNS`, `Host Records` or `Zone File Control`.

2. Set the `www` record to a **CNAME** and set the URL field to: ```www.gitbooks.io```.

3. To **redirect** the naked domain (`yourdomain.com`) to `www.yourdomain.com`, you'll need to enable *"domain forwarding"*. This is often found under `Forwarding`, `URL Forwarding` or `URL Redirect`.

That's all ! It might take a few hours for the new DNS settings to propagate.
