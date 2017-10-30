# mirador-ruler

When an IIIF physical dimension service is provided for an image resource, this plugin renders a ruler overlay on a window.

Currently, this plugin supports Mirador 2.5+.

## Setup

You can find production-ready build artifacts inside the 'dist/' folder.

Alternatively, clone this repository and do:

```bash
npm install
gulp
```

This will minify all source files as well as download and tack on one dependency, namely [ UCLALibrary's fork of the OpenSeadragonScalebar plugin](https://github.com/UCLALibrary/OpenSeadragonScalebar).

Now look in the 'dist/' folder. Drop these files into your Mirador build output directory and point your webpage to them:

```html
<!DOCTYPE html>
<html>
    <head>
        ...
        <link rel="stylesheet" type="text/css" href="mirador-combined.css">
        <link rel="stylesheet" type="text/css" href="MiradorRuler.min.css">
        ...
    </head>
    <body>
        <div id="viewer"></div>

        <script src="mirador.js"></script>
        <script src="MiradorRuler.min.js"></script>

        <script type="text/javascript">

        $(function() {
            Mirador({
                ...
```

Also, be sure to put each of the files in 'images/' in your Mirador directory.
