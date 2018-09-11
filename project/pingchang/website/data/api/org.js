module.exports = [{
  		params: {level: 1, tree: '', page: 1, limit: 10},
  		response: './api/org.tree.json'
	}, {
  		params: {page: 1, limit: 99999, tree: ''},
  		response: './api/org.tree.json'
	}, {
  		params: {level: 1},
  		response: './api/org.one.json'
	}];