# CompressorJs
CompressorJs is an open source library providing client side image compression to reduce upload time and bandwidth.

## Installation

1. Download CompressorJs.js and include it in your project. Then CompressorJs will be available in your window object as window.CompressorJs!

	`<script src="path/CompressorJs.js"></script>`

2. Set up your html form. If you want a preview like the demo, you will also have to create a preview box.

	`<form action="server/processImage.php">
		<input type="file" id="CompressorFiles" multiple/>
		<input type="submit" value="Press to submit!"/><br/>
		<div id="preview"></div>'
	</form>`