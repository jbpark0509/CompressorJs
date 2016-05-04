(function(){
	
	var CompressorJs, _mergeObject, _readImage, _addPreview, _emptyPreview, _compression, 
		_defaultOptions = {
			maxWidth: 1024,
			maxHeight: 1024,
			quality: 100,
			multiple: true,
			allowedExtensions:  "png|jpeg|jpg|gif",
			previewId: false,
			outputName: 'myfiles[]',
			callback: false,
			error: false,
			befsend: false
		};
	
	window.URL = window.URL || window.webkitURL;
	
	_mergeObject = function(o1, o2){
		var o = {}, key;
		for( key in o1 ){ o[key] = o1[key]; }
		for( key in o2 ){ o[key] = o2[key]; }
		return o;
	}

	_readImage = function ( file, CompressorJs ) {
		
		var reader = new FileReader(), _width, _height;
		
		reader.addEventListener("load", function () {
			var image  = new Image();
			image.addEventListener("load", function () {
				_compression(file, this, CompressorJs._options.quality, "jpeg", CompressorJs);
			});
			image.src = window.URL.createObjectURL(file);
			window.URL.revokeObjectURL(file);
		});
		
		reader.readAsDataURL(file); 
	}

	
	_compression = function (file, image, quality, output_format, CompressorJs) {
		
		var _newWidth, _newHeight, _ratio, cvs, ctx, newImageData, result_image_obj, 
			mime_type = "image/jpeg";
			
		if(typeof output_format !== "undefined" && output_format=="png"){
			mime_type = "image/png";
		}
		_ratio = image.naturalWidth / image.naturalHeight;
		
		_newWidth = image.naturalWidth > CompressorJs._options.maxWidth ? CompressorJs._options.maxWidth : image.naturalWidth;
		_newHeight = _newWidth / _ratio;
		
		cvs = document.createElement('canvas');
		cvs.width = _newWidth;
		cvs.height = _newHeight;
		ctx = cvs.getContext("2d").drawImage(image, 0, 0, _newWidth, _newHeight);
		
		cvs.toBlob(function(blob){
			
			var compressedFile = blob;
			
			compressedFile.type = file.type;
			compressedFile.myname = file.name;
			compressedFile.lastModified = file.lastModified;
			
			if(CompressorJs._options.multiple){
				CompressorJs.filesArray.push(compressedFile);
				if(CompressorJs.preview){
					_addPreview(cvs, compressedFile, CompressorJs);
				}	
			}else{
				CompressorJs.filesArray[0] = compressedFile;
				if(CompressorJs.preview){
					_emptyPreview(CompressorJs);
					_addPreview(cvs, compressedFile, CompressorJs);
				}
			}
			
		},mime_type, quality/100);
	}
	
	_addPreview = function(canvas, compressedFile, CompressorJs) {
		
		var index, iPreview = document.createElement("div"),
			iPreviewDelete = document.createElement("span");
			
		iPreview.setAttribute("class", "iPreview");
		iPreviewDelete.setAttribute("class", "iPreview-delete");
		iPreviewDelete.innerHTML = '&times;';
		iPreview.appendChild(canvas);
		iPreview.appendChild(iPreviewDelete);
		CompressorJs.preview.appendChild(iPreview);
		
		iPreviewDelete.addEventListener("click", function(e){
			index = CompressorJs.filesArray.indexOf(compressedFile);
			if (index > -1) {
				CompressorJs.filesArray.splice(index, 1);
			}
			preview.removeChild(iPreview);
		});
	}
	
	_emptyPreview = function(CompressorJs){
		
		var iPreviews = CompressorJs.preview.getElementsByClassName("iPreview");
		
		Array.prototype.forEach.call(iPreviews, function(iPreview) {
			CompressorJs.preview.removeChild(iPreview);
		});
		
	}
	
	CompressorJs = function(id, options){
		
		this._element = document.getElementById(id);
		this._form = this._element.form;
		this._options = _mergeObject( _defaultOptions, options );
		this.filesArray = [];
		
		//Initialize CompressorJs
		this.init();
		
	}
	
	CompressorJs.prototype.init = function(){
		
		if(this._options.previewId){
			this.preview = document.getElementById(this._options.previewId) || false;
		}
		
		if(this.preview){
			this.setPreviewContainer();
		}
		
		var CompressorJs = this;
		
		this._element.addEventListener("change", function(){
			
			var files = this.files;
			
			if (files && files[0]) {
				for(var i=0; i<files.length; i++) {
					
					var file = files[i];
					
					var regex = new RegExp("\.(" + CompressorJs._options.allowedExtensions + ")$", "i");
					if ( (regex).test(file.name) ) {
						
						if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
							_readImage( file, CompressorJs );
						}
					}else{
						//File not allowed
					}
				}
			}
		});
		
		this._form.addEventListener("submit", function(e){
			
			e.preventDefault();
			
			var url, i, befsend, error, callback;
				
			befsend = function(xhr){
				if(CompressorJs._options.befsend){
					CompressorJs._options.befsend.call(this, xhr, CompressorJs);
				}
			}
			
			error = function(error){
				if(CompressorJs._options.error){
					CompressorJs._options.error.call(this, error, CompressorJs);
				}
			}
			
			callback = function(callback){
				if(CompressorJs._options.callback){
					CompressorJs._options.callback.call(this, callback, CompressorJs );
				}
			}
			
			CompressorJs._element.value = "";

			url = this.getAttribute('action');
			
			var myFormData = new FormData(CompressorJs._form);
			for( i = 0 ; i < CompressorJs.filesArray.length ; i++ ) {
				myFormData.append(CompressorJs._options.outputName, 
					CompressorJs.filesArray[i], CompressorJs.filesArray[i].myname);
			}
			
			var xhr = new XMLHttpRequest();
			
			xhr.upload.addEventListener("progress", function(e) {
				CompressorJs._progress.setAttribute("value", Math.floor(e.loaded / e.total *100));
			}, false);
			
			xhr.onreadystatechange = function () {
				
				if( xhr.readyState == 2 ){
					if ( befsend && typeof befsend === 'function' ) {
						befsend(xhr)
					}
				}

				if ( xhr.readyState === 4 ) {
					if ( xhr.status !== 200 ) {
						if ( error && typeof error === 'function' ) {
							error( xhr.responseText );
						}
						return;
					}
					if ( callback && typeof callback === 'function' ) {
						callback(xhr.responseText)
					}
				}
		
			};
			xhr.open('POST', url, true);
			xhr.send(myFormData);
		});
	}
	
	CompressorJs.prototype.setPreviewContainer = function(){
		
		//create progress container
		var progressContainer = document.createElement("div");
		progressContainer.setAttribute("class", "cjs-p-c");
		progressContainer.style.display = "none";
		
		//create progress bar
		var progress = document.createElement("progress");
		progress.setAttribute("class", "cjs-p");
		progress.setAttribute("max", "100");
		progress.setAttribute("value", "0");
		progressContainer.appendChild(progress);
		
		//append progress to preview
		this.preview.appendChild(progressContainer);
		
		this.progressContainer = progressContainer;
		this._progress = progress;
	}
	
	this.CompressorJs = CompressorJs;
	
}).call(this);

(function (window) {
var CanvasPrototype = window.HTMLCanvasElement &&
						window.HTMLCanvasElement.prototype
var hasBlobConstructor = window.Blob && (function () {
	try {
	return Boolean(new Blob())
	} catch (e) {
	return false
	}
}())
var hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array &&
	(function () {
	try {
		return new Blob([new Uint8Array(100)]).size === 100
	} catch (e) {
		return false
	}
	}())
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
					window.MozBlobBuilder || window.MSBlobBuilder
var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/
var dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob &&
	window.ArrayBuffer && window.Uint8Array &&
	function (dataURI) {
	var matches,
		mediaType,
		isBase64,
		dataString,
		byteString,
		arrayBuffer,
		intArray,
		i,
		bb
	// Parse the dataURI components as per RFC 2397
	matches = dataURI.match(dataURIPattern)
	if (!matches) {
		throw new Error('invalid data URI')
	}
	// Default to text/plain;charset=US-ASCII
	mediaType = matches[2]
		? matches[1]
		: 'text/plain' + (matches[3] || ';charset=US-ASCII')
	isBase64 = !!matches[4]
	dataString = dataURI.slice(matches[0].length)
	if (isBase64) {
		// Convert base64 to raw binary data held in a string:
		byteString = atob(dataString)
	} else {
		// Convert base64/URLEncoded data component to raw binary:
		byteString = decodeURIComponent(dataString)
	}
	// Write the bytes of the string to an ArrayBuffer:
	arrayBuffer = new ArrayBuffer(byteString.length)
	intArray = new Uint8Array(arrayBuffer)
	for (i = 0; i < byteString.length; i += 1) {
		intArray[i] = byteString.charCodeAt(i)
	}
	// Write the ArrayBuffer (or ArrayBufferView) to a blob:
	if (hasBlobConstructor) {
		return new Blob(
		[hasArrayBufferViewSupport ? intArray : arrayBuffer],
		{type: mediaType}
		)
	}
	bb = new BlobBuilder()
	bb.append(arrayBuffer)
	return bb.getBlob(mediaType)
	}
if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
	if (CanvasPrototype.mozGetAsFile) {
	CanvasPrototype.toBlob = function (callback, type, quality) {
		if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
		callback(dataURLtoBlob(this.toDataURL(type, quality)))
		} else {
		callback(this.mozGetAsFile('blob', type))
		}
	}
	} else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
	CanvasPrototype.toBlob = function (callback, type, quality) {
		callback(dataURLtoBlob(this.toDataURL(type, quality)))
	}
	}
}
if (typeof define === 'function' && define.amd) {
	define(function () {
	return dataURLtoBlob
	})
} else if (typeof module === 'object' && module.exports) {
	module.exports = dataURLtoBlob
} else {
	window.dataURLtoBlob = dataURLtoBlob
}
}(window));
