# PDF Booklet Maker

A web-based tool that allows you to convert PDF files into booklet format for double-sided printing. When printed and folded, it creates a proper booklet with pages in the correct order.

## Features

- Upload multiple PDF files via drag-and-drop or file selection
- Preview the booklet layout before generating
- Process individual PDFs or batch process multiple files at once
- Download individual booklet PDFs or all processed PDFs as a ZIP file
- Separator lines between pages for easier folding
- Responsive design that works on desktop and mobile devices
- SEO optimized with Open Graph metadata for better social sharing

## How It Works

The tool rearranges the pages of your PDF in the following way:

**First Sheet (Front Side):**

- Left: Page 4
- Right: Page 1

**First Sheet (Back Side):**

- Left: Page 2
- Right: Page 3

When printed double-sided (flip on short edge) and folded in the middle, the pages will appear in the correct order: 1, 2, 3, 4.

## SEO & Social Sharing

The tool is optimized for search engines and social media sharing with:

- Comprehensive meta tags for better search engine visibility
- Open Graph metadata for rich previews when shared on Facebook, LinkedIn, etc.
- Twitter Card metadata for enhanced Twitter sharing
- JSON-LD structured data for better understanding by search engines
- Favicon and Apple Touch Icon for better branding
- robots.txt and sitemap.xml for improved search engine crawling

## How to Use

1. Open `index.html` in a modern web browser
2. Upload your PDF files by:
   - Dragging and dropping them onto the upload area
   - Clicking "Choose Files" to select them from your device
3. For individual files:
   - Click "Preview" on a file to see how it will look as a booklet
   - Click "Generate Booklet PDF" to create the booklet-formatted PDF
4. For batch processing:
   - Upload multiple PDF files
   - Click "Process All Files" to convert all files to booklet format
5. Download options:
   - Click "Download" next to any processed file to save it individually
   - Click "Download All as ZIP" to download all processed files in a ZIP archive
6. Print the generated PDF(s) with the following settings:
   - Double-sided printing
   - Flip on short edge
   - No scaling (100% size)
7. Fold the printed sheet(s) in the middle to create your booklet(s)

## Technical Details

This tool uses the following libraries:

- [PDF.js](https://mozilla.github.io/pdf.js/) for rendering and processing PDF files
- [jsPDF](https://github.com/parallax/jsPDF) for creating the new booklet PDFs
- [JSZip](https://stuk.github.io/jszip/) for creating ZIP archives of multiple PDFs
- [Font Awesome](https://fontawesome.com/) for icons

## Browser Compatibility

The tool works best in modern browsers:

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Limitations

- Works best with PDFs that have a multiple of 4 pages
- For PDFs with fewer pages, blank pages will be added to complete the booklet
- Works best with PDFs that have standard page sizes (A4, Letter)
- Large PDFs may take longer to process

## License

This project is open source and available under the MIT License.

## Creator

Developed by [Vaibhav Kumar Singh](https://linkedin.com/in/vaib215)
