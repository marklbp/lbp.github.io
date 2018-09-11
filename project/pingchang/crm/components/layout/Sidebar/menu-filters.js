export default {
	filters: {
        addQueryStr: function(path, id, query){
            if(process.server)return path;
            id = id || 0;
            path = path + (path.indexOf("?") > -1 ? '&' : '?');

            let queryStrArr = Object.keys(query);
            for (let i = 0, length = queryStrArr.length, k,v, rPath, last; i < length; i++) {
                k = queryStrArr[i];
                v = query[k];
				if(/agencyType|itemId|admissionBaseId|agencyId|currTab|parentId|type|userId/.test(k)) {
                    //左侧菜单过滤不必要的查询字串
					continue;
				}
                if(k == 'buttonId')v = id;
                if(path.substring(path.indexOf('?')).indexOf(k) > -1){
                    rPath = new RegExp('((?:&|\\?))'+ k +'((?:=[^&])*)');
                    path = path.replace(rPath, '$1'+ k + v)
                }else{
                    last = path[path.length-1]
                    path = path + (last == '?' || last == '&' ? '' : '&') + (k + '=' + v)
                }
            }
            if(path.indexOf('buttonId') > -1)return path;
            return path + (path.indexOf("?") > -1 ? '&' : '?') + 'buttonId=' + id
        }
	}
}
