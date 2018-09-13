(function(context){
  return context.extend(context,{
    config: {
      elements: {
        aside: $('#aside_content'),
        content: $('#main_content'),
        backTop: $('#back_top'),
        loadText: $("#load_text"),
        progress: $("#progress")
      },
      cache: {},
      cacheKey: 'MARKLBP_ES6_HANDBOOK',
      list: [],
      videos: ["intro","let","const","array-destructuring","object-destructuring","argument-destructuring","string-api","tagged-templates","template-string","argument-default-value","rest-argument","arrow-function","function-name-attr","set","map","get-set","object-setPrototypeOf","__proto__","object-assign","object-attr","object-expression","object-is","iterator","generator","spread-operator","class","staitc","class-extends","super","module","export-import-as","export-import-default"],
      events: {
        click: 'ontouchstart' in document ? 'touchend' : 'click',
        mouseover: 'ontouchstart' in document ? 'touchstart' : 'mouseover',
        mouseout: 'ontouchstart' in document ? 'touchend' : 'mouseout',
      }
    },
    init: function (){
      this.updateCache().initEvents().renderContent(this.config.elements.aside, 'es6').updateContent()
      var file = decodeURI(location.hash.split('#')[2])
      this.config.elements.content.find('li.link[data-id=' + file + ']').trigger(this.config.events.click)
      return this
    },
    initEvents: function (){
      var that = this
      var click = this.config.events.click
      var mouseover = this.config.events.mouseover
      var mouseout = this.config.events.mouseout
      $(window).on('hashchange', $.proxy(this.updateContent, this)).on('scroll', function(){
        var sT = $(this).scrollTop()
        that.config.elements.backTop.css("display", sT > 0 ? 'inline-block' : 'none')
        var sH = document.documentElement.scrollHeight
        var cH = $(this).height()
        that.config.elements.progress.width(that.toFixed(sT/(sH - cH)*10000, 2) + '%')
      })
      $(document).on(click, 'a.section-link', function(e){
        e.preventDefault();
        var hash = this.dataset.hash
        var content = this.dataset.content
        history.pushState(null, null, '#' + hash + '#' + content);
        $('html, body').animate({
          scrollTop: $('#' + content).offset().top
        }, 300);
      }).on(click,"a.go-top, #back_top", function(e){
        e.preventDefault()
        that.goTop()
      }).on(click, "#btn_menu", function(e){
        e.preventDefault()
        that.config.elements.aside.parent().toggleClass("show")
      }).on(click, "#page_prev, #page_next", function(){
        this.clickTimeStamp = this.clickTimeStamp || 0
        if($.now() - this.clickTimeStamp < 1000)return that.modal.tip("翻页太快哦~", 500, true)
        this.clickTimeStamp = $.now()
        var list = that.config.list
        var current = location.hash.split("#")[1] || list[0]
        var to
        if (list.length <= 0) {
          list = [].slice.call(that.config.elements.aside.find("a").map(function(){return this.href.split("#")[1]}))
        }
        if (this.id === 'page_prev') {
          to = list[list.indexOf(current) - 1] || list[0]
        } else{
          to = list[list.indexOf(current) + 1] || list.slice(-1)[0]
        }
        if (current === to) return
        return location.hash = to
      }).on(click, "li.link[data-id]", function(e){
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
      }).on(mouseover + " " + mouseout, "#main_content h2,#main_content h3,#main_content h4", function (e) {
        e.preventDefault()
        if (this.resetTime) clearTimeout(this.resetTime)
        if (e.type === mouseover) {
          $(this).find("a").show()
        } else {
          this.resetTime = setTimeout($.proxy(function(){$(this).find("a").hide()}, this), e.type.indexOf("touch") > -1 ? 3000 : 300);
        }
      })
      return this
    },
    updateContent: function(){
      var file = location.hash.split("#")[1]
      if(!file || file.length <= 0){
        file = 'intro'
      }
      return this.renderContent(this.config.elements.content, file)
    },
    renderContent: function(jqInstance, file){
      this.toggleLoad(1)
      this.config.elements.backTop.trigger(this.config.events.click)
      if (this.config.cache[file]) {
        jqInstance.html(this.config.cache[file])
        this.config.elements.loadText.hide()
        return this
      }
      return this.ajax({
        url: '/study/es6/'+ file + '.md',
        type: 'get',
        always: function () {
          this.toggleLoad(0)
        },
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
          jqInstance.html(dom)
        },
        fail: function(data){
          jqInstance.html(data.value)
        }
      })
    },
    toggleLoad: function (flag) {
      this.config.elements.loadText[flag ? 'show' : 'hide']()
    },
    createAnchors: function(dom){
      var hash = location.hash.split('#')[1] || 'intro'
      for (var i = 2, lis; i <= 4; i++) {
        if (i === 2) lis = []
        dom.find('h' + i).map(function() {
          var content = $(this).text()
          this.id = content.replace(/, /g, ',').replace(/[&\/\\#,.+=$~%'":*?<>{}\ \]\[]/g, "-").replace(/[()]/g, '')
          this.innerHTML = content +
            ' <a style="display: none" href="#' + hash + '#' + this.id + '" class="section-link" data-content="' + this.id + '" data-hash="' + hash + '">🔗</a> <a href="javascript:void(0)" style="display: none" class="go-top">👆</a>'
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
        try{
          localStorage.setItem(this.config.cacheKey, JSON.stringify(this.config.cache))
        } catch (e) {
          // ios private mode browser will throw quotaExceededException error(in safari)
        }
        storeCache = '{}'
      }
      storeCache = JSON.parse(storeCache)
      if (opt && typeof opt === 'object') storeCache[opt.key] = opt.value || storeCache[opt.key]
      this.config.cache = storeCache
      try {
        localStorage.setItem(this.config.cacheKey, JSON.stringify(storeCache))
      } catch (e) {
        // ios private mode browser will throw quotaExceededException error(in safari)
      }

      return this
    }
  }).init()
})(Marklbp)