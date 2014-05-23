# Invoice Processing UI #
==============

Invoice Processing UI is a combination of HTML, CSS, jQuery, JS and a very nice PDF viewer.
The pdf viewer is done by the project PDF.JS (by Mozilla). 
PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5. 
The library is available from https://github.com/mozilla/pdf.js


## PDF Viewer ##
--------------

The UI shows a pdf viewer on the left side. The viewer was reduced to offer the following features:

* Zoom in and Zoom out by buttons "-" and "+"
* Zoom in and Zoom out by selecting the value from a dropdown menu
* Thumbnail View
* Scroll by using number pages or scroll bar

## Data Extracted ##
--------------

The right side is populated by extracted data which is loaded from a JSON file. The features included are:

* Delete the rows
* Add new rows
* Add colors to extracted data based on the property "confidence" included in the JSON file
