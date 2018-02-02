var Comment = React.createClass({
		deleteComment(){
			this.props.deleteComment(this.props.comment.key);
		}
		,render(){
			return (
				<li>
					<span>{this.props.comment.name}:</span>
					<span>{this.props.comment.text}</span>
					<span className="fa fa-times text-danger" onClick={this.deleteComment}></span>
				</li>
			)
		}
	})
	
	,CommentList = React.createClass({
		render(){
			var deleteComment = this.props.deleteComment;
			var list=this.props.commentlist.map(function(comment){
				return <Comment key={comment.key} deleteComment={deleteComment}  comment={comment} />;
			});
			return <ul>{list}</ul>
		}
	})

	,CommentForm = React.createClass({
		handleSubmit(e){
			e.preventDefault();
			var name=this.refs.name;
			var text=this.refs.text;
			var nameVal=name.value.trim();
			var textVal=text.value.trim();
			if(nameVal&&textVal){
				this.props.commentFormSubmit({
					name:nameVal,
					text:textVal
				})
				name.value="";
				text.value="";
			}else{
				return
			}
		}
		,render(){
			return (
				<form className="form-inline" ref="commentForm" onSubmit={this.handleSubmit}>
					<input className="form-control" type="text" ref="name" placeholder="name"/>
					<input className="form-control" type="text" ref="text" placeholder="say something..."/>
					<button className="btn btn-default" type="submit">发表评论</button>
				</form>
			)
		}
	})

	,CommentBox = React.createClass({
		getInitialState(){
			return {
				commentlist:[]
			}
		},
		loadCommentFormSever(){
			$.ajax({
				url:this.props.url
			}).done(function(data){
				this.setState({
					commentlist:data
				})
			}.bind(this)).fail(function(data){

			}.bind(this))
		},
		deleteComment(key){
			$.ajax({
				url:this.props.url + '?key='+key,
				type: "delete"
			}).done(function(){
				this.loadCommentFormSever();
			}.bind(this))
		},
		handleCommentFormSubmit(comment){
			$.ajax({
				url:this.props.url,
				type:"post",
				data:comment
			}).done(function(){
				//
			}.bind(this)).fail(function(){

			}.bind(this))
		},
		componentDidMount(){
			//做请求
			this.loadCommentFormSever();
			setInterval(this.loadCommentFormSever,this.props.interval);
		},
		render () {
			return(
				<div class="comment-box">
					<CommentList commentlist={this.state.commentlist} deleteComment={this.deleteComment} />
					<CommentForm commentFormSubmit={this.handleCommentFormSubmit} />
				</div>
				)
		}
	});

ReactDOM.render(
			<CommentBox url="comment.php" interval={2000} />,
			document.getElementById('content')
		)