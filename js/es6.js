(function(context){
  return context.extend(context,{
    config: {
      aside: '#aside_content',
      content: '#main_content',
      backTop: '#back_top',
      cache: {},
      cacheKey: 'MARKLBP_ES6_HANDBOOK',
      list: []
    },
    init: function (){
      this.updateCache().initEvents().renderContent(this.config.aside, 'es6').updateContent()
      var file = decodeURI(location.hash.split('#')[2])
      $(this.config.content).find('li.link[data-id=' + file + ']').trigger('click')
      return this
    },
    initEvents: function (){
      var that = this
      var $backTop = $(that.config.backTop)
      var showBackTop = false
      $(window).on('hashchange', $.proxy(this.updateContent, this)).on('scroll', function(){
        var sT = $(this).scrollTop()
        $backTop[sT > 0 ? 'show' : 'hide']()
      })
      $(document).on('click', 'a.section-link', function(e){
        e.preventDefault();
        var hash = this.dataset.hash
        var content = this.dataset.content
        history.pushState(null, null, '#' + hash + '#' + content);
        $('html, body').animate({
          scrollTop: $('#' + content).offset().top
        }, 300);
      }).on("click","a.go-top, #back_top", function(e){
        e.preventDefault()
        that.goTop()
      }).on("click", "#btn_menu", function(e){
        e.preventDefault()
        $(that.config.aside).parent().toggleClass("show")
      }).on("click", "#page_prev, #page_next", function(){
        var list = that.config.list
        var current = location.hash.split("#")[1] || list[0]
        var to
        if (this.id === 'page_prev') {
          to = list[list.indexOf(current) - 1] || list[0]
        } else{
          to = list[list.indexOf(current) + 1] || list.slice(-1)[0]
        }
        if (current === to) return
        return location.hash = to
      }).on("click", "li.link[data-id]", function(e){
          e.preventDefault();
          var header = $("h2#" + this.dataset.id)
          var original_color = header.css("color")
          $('html, body').animate({
            scrollTop: header.offset().top
          }, 200)

          header.animate({ color: "#ED1C24", }, 500, function() {
            $(this).animate({color: original_color}, 2500);
          });
          history.pushState(null, null, '#' + (location.hash.split('#')[1] || 'intro') + '#' + this.dataset.id);
      }).on("mouseover mouseout", this.config.content + " h2," + this.config.content + " h3," + this.config.content + " h4", function (e) {
        if (this.resetTime) clearTimeout(this.resetTime)
        if (e.type === 'mouseover') {
          $(this).find("a").show()
        } else {
          this.resetTime = setTimeout($.proxy(function(){$(this).find("a").hide()}, this), 500);
        }
      })
      return this
    },
    updateContent: function(){
      var file = location.hash.split("#")[1]
      if(!file || file.length <= 0){
        file = 'intro'
      }
      return this.renderContent(this.config.content, file)
    },
    renderContent: function(selector, file){
      if (this.config.cache[file]) {
        $(selector).html(this.config.cache[file])
        return this
      }
      return this.ajax({
        url: (file === 'es6' ? '/javascript/es6/' : '/javascript/es6/docs/') + file + '.md',
        type: 'get',
        done: function(data){
          var str = marked(data)
          var dom = $('<div class="marked-text">' + str + '</div>');
          dom.find("code").map(function(){
            Prism.highlightElement(this)
          })
          if(file !== 'es6'){
            this.createAnchors(dom)
          } else {
            this.config.list = [].slice.call(dom.find("a").map(function(){return this.href.split("#")[1]}))
          }
          this.updateCache({key: file, value: dom[0].outerHTML})
          $(selector).html(dom)
        },
        fail: function(data){
          $(selector).html(data.value)
        }
      })
    },
    createAnchors: function(dom){
      var hash = location.hash.split('#')[1] || 'intro'
      for (var i = 2, lis; i <= 4; i++) {
        if (i === 2) lis = []
        dom.find('h' + i).map(function() {
          var content = $(this).text()
          this.id = content.replace(/, /g, ',').replace(/[&\/\\#,.+=$~%'":*?<>{}\ \]\[]/g, "-").replace(/[()]/g, '')
          this.innerHTML = content +
            ' <a style="display: none" href="#' + hash + '#' + this.id + '" class="section-link" data-content="' + this.id + '" data-hash="' + hash + '">§</a> <a href="javascript:void(0)" style="display: none" class="go-top">⇧</a>'
          this.setAttribute('data-content', content)
          if(lis){
            lis.push('<li data-id="' + this.id + '" class="link"><a href="#' + hash + '#' + content + '">' + content + '</a></li>')
          }
        })
        if (lis) {
          dom.find(">h1").eq(0).after("<ol id='content-toc'>" + lis.join('') + "</ol>")
          lis = null
        }
      }
      return this
    },
    goTop: function () {
      $('html, body').animate({
        scrollTop: 0
      }, 200);
      history.pushState(null, null, '#' + (location.hash.split('#')[1] || 'intro'));
    },
    updateCache: function(opt){
      var storeCache = localStorage.getItem(this.config.cacheKey)
      if(!storeCache){
        localStorage.setItem(this.config.cacheKey, JSON.stringify(this.config.cache))
        storeCache = '{}'
      }
      storeCache = JSON.parse(storeCache)
      if (opt && typeof opt === 'object') storeCache[opt.key] = opt.value || storeCache[opt.key]
      this.config.cache = storeCache
      localStorage.setItem(this.config.cacheKey, JSON.stringify(storeCache))
      return this
    }
  }).init()
})(Marklbp)