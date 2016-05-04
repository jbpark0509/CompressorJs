<?php
	
	$file_names = array();
	
	for($i = 0; $i < count($_FILES['myfiles']['name']) ; $i++){
		$file_names[] = $_FILES['myfiles']['name'][$i];
	}
	
	$return = "<ul>";
	
	foreach($file_names as $file_name){
		$return .= "<li>" . $file_name . "</li>";
	}
	
	echo $return . "</ul>";