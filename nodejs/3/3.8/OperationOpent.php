<?php
require('Open/Api.php');
require('Open/Client.php');
require('Open/Oauth.php');
require('Open/Opent.php');

class Core_OperationOpent
{
	/**
	 * 发一条微博
	 * @param unknown_type $tweet
	 * @return  : return_type
	 */
	public static function add($p, $wbInfo=array())
	{
		if (empty($p)){
			return null;
		}
		try{
			$ret = Core_Open_Api::getAdminClient($wbInfo)->postOne($p);
		}catch(Exception $e){
			var_dump($e);
		}
		$data = isset($ret['data'])  ? $ret['data'] : array();
		return $data;
	}
    
}
