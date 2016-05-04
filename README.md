# CompressorJs
CompressorJs is an open source library providing client side image compression to reduce upload time and bandwidth.

## Installation

1. Download CompressorJs.js and include it in your project. Then CompressorJs will be available in your window object as window.CompressorJs!

	`<script src="path/CompressorJs.js"></script>`

2. Set up your html form. If you want a preview like the demo, you will also have to create a preview box.

		<form action="server/processImage.php">
			<input type="file" id="CompressorFiles" multiple/>
			<input type="submit" value="Press to submit!"/><br/>
			<div id="preview"></div>
		</form>
		
3. Declare your own CompressorJs. *CompressorJS does not handle server side of your project!* Here is an example of a CompressorJs declaration.

		var myCompressor = new CompressorJs('CompressorFiles', {
			previewId: "preview",			
			quality: 70,					
			maxWidth: 700,					
			befsend: function(xhr, CompressorJs){
				CompressorJs.preview.style.pointerEvents = 'none';
				if(CompressorJs.filesArray[0]){
					CompressorJs.progressContainer.style.display = 'block';
				}
			},
			callback: function(callback, CompressorJs){
				serverResponse.innerHTML = "I received the following images! <br/>" + callback;
				CompressorJs.filesArray = [];
				if(CompressorJs.preview){
					CompressorJs.preview.innerHTML = "";
					CompressorJs.setPreviewContainer();
					CompressorJs.preview.style.pointerEvents = 'auto';
				}
			},
			error: function(){}
		});

## Configuration

You can declare your CompressorJs with the following options:

Option | Description
------ | -----------
maxWidth | Max width of ouput image. Default value is set to 1024.
maxHeight | Max height of ouput image. Default value is set to 1024.
quality | Quality of output image. Default value is set to 100.
multiple | Determine your file input is set to multiple. Default is set to true.
allowedExtensions | Allowed extensions for your image files. Default is set to .png, .jpeg .jpg .gif. To configure allowedExtension, use the following format: "png|jpeg|jpg|gif"
previewId | Preview container id. If set to false, preview will not be shown.
outputName | Name to be sent to your server. Default is set to myfiles[].
befsend | Function to be executed before images are sent to the server.
callback | Function to be executed after images are sent to the server.
error | Function to be executed if error in sending images to the server.

## Author
Jeong Park <jbpark0509@hotmail.com>