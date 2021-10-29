/* This is stub file for gapi.client.{{=it.name}} definition tests */
/* IMPORTANT.
* This file was automatically generated by https://github.com/Bolisov/google-api-typings-generator. Please do not edit it manually.
* In case of any problems please post issue to https://github.com/Bolisov/google-api-typings-generator
**/
gapi.load('client', () => {
    /** now we can use gapi.client */
    gapi.client.load('urlshortener', 'v1', () => {
        /** now we can use gapi.client.urlshortener */

        /** don't forget to authenticate your client before sending any request to resources: */
        /** declare client_id registered in Google Developers Console */
        const client_id = '<<PUT YOUR CLIENT ID HERE>>';
        const scope = [
            /** Manage your goo.gl short URLs */
            'https://www.googleapis.com/auth/urlshortener',
        ];
        const immediate = true;
        gapi.auth.authorize({ client_id, scope, immediate }, authResult => {
            if (authResult && !authResult.error) {
                /** handle succesfull authorization */
                run();
            } else {
                /** handle authorization error */
            }
        });
        run();
    });

    async function run() {
        /** Expands a short URL or gets creation time and analytics. */
        await gapi.client.url.get({
            projection: "projection",
            shortUrl: "shortUrl",
        });
        /** Creates a new short URL. */
        await gapi.client.url.insert({
        });
        /** Retrieves a list of URLs shortened by a user. */
        await gapi.client.url.list({
            projection: "projection",
            "start-token": "start-token",
        });
    }
});
