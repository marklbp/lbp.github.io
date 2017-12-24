var Comment=React.createClass({
		render:function(){
			return (
				<li>
					<span data-id={this.props.comment.key}>{this.props.comment.name}:</span><span>{this.props.comment.text}</span>
				</li>
			)
		}
	})
	
	,CommentList=React.createClass({
		render:function(){
			var list=this.props.commentlist.map(function(comment){
				return <Comment key={comment.key} comment={comment} />;
			});
			return <ul>{list}</ul>
		}
	})

	,CommentForm=React.createClass({
		handleSubmit:function(e){
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
		},
		render:function(){
			return (
				<form ref="commentForm" onSubmit={this.handleSubmit}>
					<input type="text" ref="name" />
					<input type="text" ref="text" />
					<input type="submit" value="发表评论" />
				</form>
			)
		}
	})

	,CommentBox=React.createClass({
		getInitialState:function(){
			return {
				commentlist:[]
			}
		},
		loadCommentFormSever:function(){
			$.ajax({
				url:this.props.url
			}).done(function(data){
				this.setState({
					commentlist:data
				})
			}.bind(this)).fail(function(data){

			}.bind(this))
		},
		handleCommentFormSubmit:function(comment){
			$.ajax({
				url:this.props.url,
				type:"post",
				data:comment
			}).done(function(){
				//
			}.bind(this)).fail(function(){

			}.bind(this))
		},
		componentDidMount:function(){
			//做请求
			this.loadCommentFormSever();
			setInterval(this.loadCommentFormSever,this.props.interval);
		},
		render:function () {
			return(
				<div class="comment-box">
					<CommentList commentlist={this.state.commentlist} />
					<CommentForm commentFormSubmit={this.handleCommentFormSubmit} />
				</div>
				)
		}
	});

ReactDOM.render(
			<CommentBox url="comment.php" interval={2000} />,
			document.getElementById('content')
		)