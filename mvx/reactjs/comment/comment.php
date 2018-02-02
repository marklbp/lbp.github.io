<?php
	$comments = file_get_contents('comments.json');
	if(!$comments){
		$comments=json_encode(array(),JSON_PRETTY_PRINT);
		file_put_contents('comments.json', $comments);
	}
    if($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD']  === 'DELETE') {
        $commentsDecoded = json_decode($comments, true);
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $commentsDecoded[] = [
                'key'      => round(microtime(true) * 1000),
                'name'     => $_POST['name'],
                'text'     => $_POST['text']
            ];
        }else{
            $key = intval($_GET['key']);
            $len = count($commentsDecoded);
            for($i = 0; $i < $len; $i++){
                if($commentsDecoded[$i]["key"] === $key){
                    array_splice($commentsDecoded, $i, 1);
                    break;
                }
            }
        }
        $comments = json_encode($commentsDecoded, JSON_PRETTY_PRINT);
        file_put_contents('comments.json', $comments);
    }
    header('Content-Type: application/json');
    header('Cache-Control: no-cache');
    header('Access-Control-Allow-Origin: *');
    echo $comments;
?>