# Custom New Tab

A customizable new-tab page with a different authentic Brave wallpaper on every load.

## Wallpapers

- **86 genuine Brave New Tab wallpapers** are bundled in `Assets/wallpapers/brave/`.
- They come from Brave's own `brave/brave-core` repository (pinned commits) and Brave's live NTP Background Images component (v1.0.25), with artist names and profile links taken from Brave's own `backgrounds.ts` / `photo.json` attribution files.
- **No sponsored images, no New Tab Takeover ads, no stock-photo API.**
- Images were resized to JPEG so they work everywhere, including Ladybird.
- Full credit table: [`Assets/wallpapers/brave/CREDITS.md`](Assets/wallpapers/brave/CREDITS.md).

Wallpapers are picked from a shuffled bag: **no wallpaper repeats until all 86 have been shown**, then a fresh shuffled cycle begins. Progress is saved in `localStorage`, so reloads continue the same cycle. The credit line in the bottom-left links to the artist (hide it with **Settings → Show photo credit**). Use the shuffle button in the top-right (or **Settings → Wallpaper → New wallpaper now**) to roll a new one instantly.

The tab icon and extension icon both come from `Assets/icons/internet.png`; resized copies are used for the browser tab and extension toolbar.

## Run as a normal page (all browsers)

Just open `index.html`, or serve the folder with any static server:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/
```

Works in Brave, Firefox, Ladybird and any modern browser. Ladybird only supports the standalone page — its alpha builds do not support WebExtensions, so it cannot replace the browser's new tab.

## GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **Deploy from a branch**, choose `main` / `/ (root)`, and save.
4. Open `https://Batman123nn.github.io/browser-newtab-custom/`.

All asset paths are relative, so the page works at the `/browser-newtab-custom/` subpath with no extra configuration. `404.html` turns URLs like `/browser-newtab-custom/search+term` into `/browser-newtab-custom/?q=search+term`.

## Use as a new-tab extension (Brave & Firefox)

1. Open `brave://extensions` (Brave) or `about:debugging#/runtime/this-firefox` (Firefox).
2. Enable **Developer mode** (Brave) / click **Load Temporary Add-on** (Firefox).
3. Choose this folder (Brave: **Load unpacked**; Firefox: select `manifest.json`).
4. Open a new tab.

### Firefox: “corrupted extension” when installing from a file

That message is Firefox's generic error for an **unsigned** add-on installed through **about:addons → Install Add-on From File**. A normal Firefox release refuses unsigned add-ons even when they are installed from a local file.

For quick testing, use **Load Temporary Add-on** and select `manifest.json` from this folder. It stays active until Firefox is restarted.

### Firefox: permanent install

Normal Firefox releases require a Mozilla-signed XPI. To make one:

1. Build a correctly packaged archive (with `manifest.json` at the archive root):
   ```sh
   python3 build-extension.py
   ```
   This writes `dist/custom-new-tab-1.0.1.xpi`.
2. Create an AMO developer account and API credentials at <https://addons.mozilla.org/en-US/developers/addon/api/key/>.
3. Sign it as an unlisted add-on:
   ```sh
   WEB_EXT_API_KEY="your-key" WEB_EXT_API_SECRET="your-secret" \
   npx web-ext sign --source-dir . --artifacts-dir dist --channel=unlisted
   ```
4. Install the signed `.xpi` from `dist/` using **about:addons → Install Add-on From File**. It will stay installed across restarts.

`manifest.json` declares the fixed ID `custom-new-tab@dario.local` and `data_collection_permissions` for the search suggestions sent to Google. If that ID is already taken on AMO, change it to another unique `name@example.com`-style ID before signing.

Alternatively, use Firefox ESR, Developer Edition, or Nightly, set `xpinstall.signatures.required` to `false` in `about:config`, and install the unsigned `dist/custom-new-tab-1.0.1.xpi` permanently. Standard Firefox releases ignore that preference.

Search suggestions use a CORS request in extensions and JSONP on normal pages, so both modes work.

## Settings

Clock language, time format, clock size and position, search position, accent color, overlay darkness, gradient colors, greeting, quick links, custom credit text and wallpaper behavior are all configurable in the settings panel.

**Show photo credit** controls the author watermark shown under the clock. Turn it off to hide it; full attribution still lives in `CREDITS.md`.

Choosing your own wallpaper switches off random Brave wallpapers; re-enable **Random Brave wallpaper** in Settings to go back. Removing your image returns to the gradient until random wallpapers are turned back on.
