# Tweet Saver Extension

A browser extension that allows you to save tweets from X for later reference.

## Features

- Save tweets directly from your X timeline with a single click
- View and manage saved tweets in a convenient popup interface
- Capture tweet text, author information, timestamps, and media links
- Export your saved tweets collection as JSON
- Support for quoted tweets
- Dark mode interface

## Installation

1. Clone this repository:

```bash
git clone https://github.com/ghsaboias/x-extension.git
```

2. For Chrome:

   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the extension directory

   For Brave:

   - Navigate to `brave://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the extension directory

## Usage

1. Browse X.com
2. Click the "Save" button that appears on any tweet to save it
3. Click the extension icon in your browser toolbar to view saved tweets
4. Use the popup interface to:
   - View saved tweets with their complete information
   - Open original tweets in new tabs
   - Delete individual tweets
   - Clear all saved tweets
   - Export your collection as JSON

## Project Structure

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Extension popup interface with dark theme
- `popup.js` - Manages the saved tweets display and interaction
- `content.js` - Injects save buttons into X timeline and extracts tweet data

## License

MIT License

## Contributing

Feel free to open issues or submit pull requests to improve the extension.
