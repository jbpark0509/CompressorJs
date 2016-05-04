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