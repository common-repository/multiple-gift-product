/*require([
    "jquery"
    ], function($){*/
if(typeof jQuery==="undefined"){throw new Error("jquery-confirm requires jQuery");}var jconfirm,Jconfirm;(function($,window){$.fn.confirm=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}$(this).each(function(){var $this=$(this);if($this.attr("jc-attached")){console.warn("jConfirm has already been attached to this element ",$this[0]);return;}$this.on("click",function(e){e.preventDefault();var jcOption=$.extend({},options);if($this.attr("data-title")){jcOption.title=$this.attr("data-title");}if($this.attr("data-content")){jcOption.content=$this.attr("data-content");}if(typeof jcOption.buttons=="undefined"){jcOption.buttons={};}jcOption["$target"]=$this;if($this.attr("href")&&Object.keys(jcOption.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});var firstBtn=Object.keys(buttons)[0];jcOption.buttons=buttons;jcOption.buttons[firstBtn].action=function(){location.href=$this.attr("href");};}jcOption.closeIcon=false;var instance=$.confirm(jcOption);});$this.attr("jc-attached",true);});return $(this);};$.confirm=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}if(typeof options.buttons!="object"){options.buttons={};}if(Object.keys(options.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});options.buttons=buttons;}return jconfirm(options);};$.alert=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}if(typeof options.buttons!="object"){options.buttons={};}if(Object.keys(options.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});var firstBtn=Object.keys(buttons)[0];options.buttons[firstBtn]=buttons[firstBtn];}return jconfirm(options);};$.dialog=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false,closeIcon:function(){}};}options.buttons={};if(typeof options.closeIcon=="undefined"){options.closeIcon=function(){};}options.confirmKeys=[13];return jconfirm(options);};jconfirm=function(options){if(typeof options==="undefined"){options={};}var pluginOptions=$.extend(true,{},jconfirm.pluginDefaults);if(jconfirm.defaults){pluginOptions=$.extend(true,pluginOptions,jconfirm.defaults);}pluginOptions=$.extend(true,{},pluginOptions,options);var instance=new Jconfirm(pluginOptions);jconfirm.instances.push(instance);return instance;};Jconfirm=function(options){$.extend(this,options);this._init();};Jconfirm.prototype={_init:function(){var that=this;if(!jconfirm.instances.length){jconfirm.lastFocused=$("body").find(":focus");}this._id=Math.round(Math.random()*99999);this.contentParsed=$(document.createElement("div"));if(!this.lazyOpen){setTimeout(function(){that.open();},0);}},_buildHTML:function(){var that=this;this._parseAnimation(this.animation,"o");this._parseAnimation(this.closeAnimation,"c");this._parseBgDismissAnimation(this.backgroundDismissAnimation);this._parseColumnClass(this.columnClass);this._parseTheme(this.theme);this._parseType(this.type);var template=$(this.template);template.find(".jconfirm-box").addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed);if(this.typeAnimated){template.find(".jconfirm-box").addClass("jconfirm-type-animated");}if(this.useBootstrap){template.find(".jc-bs3-row").addClass(this.bootstrapClasses.row);template.find(".jc-bs3-row").addClass("justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center");template.find(".jconfirm-box-container").addClass(this.columnClassParsed);if(this.containerFluid){template.find(".jc-bs3-container").addClass(this.bootstrapClasses.containerFluid);}else{template.find(".jc-bs3-container").addClass(this.bootstrapClasses.container);}}else{template.find(".jconfirm-box").css("width",this.boxWidth);}if(this.titleClass){template.find(".jconfirm-title-c").addClass(this.titleClass);}template.addClass(this.themeParsed);var ariaLabel="jconfirm-box"+this._id;template.find(".jconfirm-box").attr("aria-labelledby",ariaLabel).attr("tabindex",-1);template.find(".jconfirm-content").attr("id",ariaLabel);if(this.bgOpacity!==null){template.find(".jconfirm-bg").css("opacity",this.bgOpacity);}if(this.rtl){template.addClass("jconfirm-rtl");}this.$el=template.appendTo(this.container);this.$jconfirmBoxContainer=this.$el.find(".jconfirm-box-container");this.$jconfirmBox=this.$body=this.$el.find(".jconfirm-box");this.$jconfirmBg=this.$el.find(".jconfirm-bg");this.$title=this.$el.find(".jconfirm-title");this.$titleContainer=this.$el.find(".jconfirm-title-c");this.$content=this.$el.find("div.jconfirm-content");this.$contentPane=this.$el.find(".jconfirm-content-pane");this.$icon=this.$el.find(".jconfirm-icon-c");this.$closeIcon=this.$el.find(".jconfirm-closeIcon");this.$holder=this.$el.find(".jconfirm-holder");this.$btnc=this.$el.find(".jconfirm-buttons");this.$scrollPane=this.$el.find(".jconfirm-scrollpane");that.setStartingPoint();this._contentReady=$.Deferred();this._modalReady=$.Deferred();this.$holder.css({"padding-top":this.offsetTop,"padding-bottom":this.offsetBottom,});this.setTitle();this.setIcon();this._setButtons();this._parseContent();this.initDraggable();if(this.isAjax){this.showLoading(false);}$.when(this._contentReady,this._modalReady).then(function(){if(that.isAjaxLoading){setTimeout(function(){that.isAjaxLoading=false;that.setContent();that.setTitle();that.setIcon();setTimeout(function(){that.hideLoading(false);that._updateContentMaxHeight();},100);if(typeof that.onContentReady==="function"){that.onContentReady();}},50);}else{that._updateContentMaxHeight();that.setTitle();that.setIcon();if(typeof that.onContentReady==="function"){that.onContentReady();}}if(that.autoClose){that._startCountDown();}});this._watchContent();if(this.animation==="none"){this.animationSpeed=1;this.animationBounce=1;}this.$body.css(this._getCSS(this.animationSpeed,this.animationBounce));this.$contentPane.css(this._getCSS(this.animationSpeed,1));this.$jconfirmBg.css(this._getCSS(this.animationSpeed,1));this.$jconfirmBoxContainer.css(this._getCSS(this.animationSpeed,1));},_typePrefix:"jconfirm-type-",typeParsed:"",_parseType:function(type){this.typeParsed=this._typePrefix+type;},setType:function(type){var oldClass=this.typeParsed;this._parseType(type);this.$jconfirmBox.removeClass(oldClass).addClass(this.typeParsed);},themeParsed:"",_themePrefix:"jconfirm-",setTheme:function(theme){var previous=this.theme;this.theme=theme||this.theme;this._parseTheme(this.theme);if(previous){this.$el.removeClass(previous);}this.$el.addClass(this.themeParsed);this.theme=theme;},_parseTheme:function(theme){var that=this;theme=theme.split(",");$.each(theme,function(k,a){if(a.indexOf(that._themePrefix)===-1){theme[k]=that._themePrefix+$.trim(a);}});this.themeParsed=theme.join(" ").toLowerCase();},backgroundDismissAnimationParsed:"",_bgDismissPrefix:"jconfirm-hilight-",_parseBgDismissAnimation:function(bgDismissAnimation){var animation=bgDismissAnimation.split(",");var that=this;$.each(animation,function(k,a){if(a.indexOf(that._bgDismissPrefix)===-1){animation[k]=that._bgDismissPrefix+$.trim(a);}});this.backgroundDismissAnimationParsed=animation.join(" ").toLowerCase();},animationParsed:"",closeAnimationParsed:"",_animationPrefix:"jconfirm-animation-",setAnimation:function(animation){this.animation=animation||this.animation;this._parseAnimation(this.animation,"o");},_parseAnimation:function(animation,which){which=which||"o";var animations=animation.split(",");var that=this;$.each(animations,function(k,a){if(a.indexOf(that._animationPrefix)===-1){animations[k]=that._animationPrefix+$.trim(a);}});var a_string=animations.join(" ").toLowerCase();if(which==="o"){this.animationParsed=a_string;}else{this.closeAnimationParsed=a_string;}return a_string;},setCloseAnimation:function(closeAnimation){this.closeAnimation=closeAnimation||this.closeAnimation;this._parseAnimation(this.closeAnimation,"c");},setAnimationSpeed:function(speed){this.animationSpeed=speed||this.animationSpeed;},columnClassParsed:"",setColumnClass:function(colClass){if(!this.useBootstrap){console.warn("cannot set columnClass, useBootstrap is set to false");return;}this.columnClass=colClass||this.columnClass;this._parseColumnClass(this.columnClass);this.$jconfirmBoxContainer.addClass(this.columnClassParsed);},_updateContentMaxHeight:function(){var height=$(window).height()-(this.$jconfirmBox.outerHeight()-this.$contentPane.outerHeight())-(this.offsetTop+this.offsetBottom);this.$contentPane.css({"max-height":height+"px"});},setBoxWidth:function(width){if(this.useBootstrap){console.warn("cannot set boxWidth, useBootstrap is set to true");return;}this.boxWidth=width;this.$jconfirmBox.css("width",width);},_parseColumnClass:function(colClass){colClass=colClass.toLowerCase();var p;switch(colClass){case"xl":case"xlarge":p="col-md-12";break;case"l":case"large":p="col-md-8 col-md-offset-2";break;case"m":case"medium":p="col-md-6 col-md-offset-3";break;case"s":case"small":p="col-md-4 col-md-offset-4";break;case"xs":case"xsmall":p="col-md-2 col-md-offset-5";break;default:p=colClass;}this.columnClassParsed=p;},initDraggable:function(){var that=this;var $t=this.$titleContainer;this.resetDrag();if(this.draggable){$t.on("mousedown",function(e){$t.addClass("jconfirm-hand");that.mouseX=e.clientX;that.mouseY=e.clientY;that.isDrag=true;});$(window).on("mousemove."+this._id,function(e){if(that.isDrag){that.movingX=e.clientX-that.mouseX+that.initialX;that.movingY=e.clientY-that.mouseY+that.initialY;that.setDrag();}});$(window).on("mouseup."+this._id,function(){$t.removeClass("jconfirm-hand");if(that.isDrag){that.isDrag=false;that.initialX=that.movingX;that.initialY=that.movingY;}});}},resetDrag:function(){this.isDrag=false;this.initialX=0;this.initialY=0;this.movingX=0;this.movingY=0;this.mouseX=0;this.mouseY=0;this.$jconfirmBoxContainer.css("transform","translate("+0+"px, "+0+"px)");},setDrag:function(){if(!this.draggable){return;}this.alignMiddle=false;var boxWidth=this.$jconfirmBox.outerWidth();var boxHeight=this.$jconfirmBox.outerHeight();var windowWidth=$(window).width();var windowHeight=$(window).height();var that=this;var dragUpdate=1;if(that.movingX%dragUpdate===0||that.movingY%dragUpdate===0){if(that.dragWindowBorder){var leftDistance=(windowWidth/2)-boxWidth/2;var topDistance=(windowHeight/2)-boxHeight/2;topDistance-=that.dragWindowGap;leftDistance-=that.dragWindowGap;if(leftDistance+that.movingX<0){that.movingX=-leftDistance;}else{if(leftDistance-that.movingX<0){that.movingX=leftDistance;}}if(topDistance+that.movingY<0){that.movingY=-topDistance;}else{if(topDistance-that.movingY<0){that.movingY=topDistance;}}}that.$jconfirmBoxContainer.css("transform","translate("+that.movingX+"px, "+that.movingY+"px)");}},_scrollTop:function(){if(typeof pageYOffset!=="undefined"){return pageYOffset;}else{var B=document.body;var D=document.documentElement;D=(D.clientHeight)?D:B;return D.scrollTop;}},_watchContent:function(){var that=this;if(this._timer){clearInterval(this._timer);}var prevContentHeight=0;this._timer=setInterval(function(){if(that.smoothContent){var contentHeight=that.$content.outerHeight()||0;if(contentHeight!==prevContentHeight){that.$contentPane.css({height:contentHeight}).scrollTop(0);prevContentHeight=contentHeight;}var wh=$(window).height();var total=that.offsetTop+that.offsetBottom+that.$jconfirmBox.height()-that.$contentPane.height()+that.$content.height();if(total<wh){that.$contentPane.addClass("no-scroll");}else{that.$contentPane.removeClass("no-scroll");}}},this.watchInterval);},_overflowClass:"jconfirm-overflow",_hilightAnimating:false,highlight:function(){this.hiLightModal();},hiLightModal:function(){var that=this;if(this._hilightAnimating){return;}that.$body.addClass("hilight");var duration=parseFloat(that.$body.css("animation-duration"))||2;this._hilightAnimating=true;setTimeout(function(){that._hilightAnimating=false;that.$body.removeClass("hilight");},duration*1000);},_bindEvents:function(){var that=this;this.boxClicked=false;this.$scrollPane.click(function(e){if(!that.boxClicked){var buttonName=false;var shouldClose=false;var str;if(typeof that.backgroundDismiss=="function"){str=that.backgroundDismiss();}else{str=that.backgroundDismiss;}if(typeof str=="string"&&typeof that.buttons[str]!="undefined"){buttonName=str;shouldClose=false;}else{if(typeof str=="undefined"||!!(str)==true){shouldClose=true;}else{shouldClose=false;}}if(buttonName){var btnResponse=that.buttons[buttonName].action.apply(that);shouldClose=(typeof btnResponse=="undefined")||!!(btnResponse);}if(shouldClose){that.close();}else{that.hiLightModal();}}that.boxClicked=false;});this.$jconfirmBox.click(function(e){that.boxClicked=true;});var isKeyDown=false;$(window).on("jcKeyDown."+that._id,function(e){if(!isKeyDown){isKeyDown=true;}});$(window).on("keyup."+that._id,function(e){if(isKeyDown){that.reactOnKey(e);isKeyDown=false;}});$(window).on("resize."+this._id,function(){that._updateContentMaxHeight();setTimeout(function(){that.resetDrag();},100);});},_cubic_bezier:"0.36, 0.55, 0.19",_getCSS:function(speed,bounce){return{"-webkit-transition-duration":speed/1000+"s","transition-duration":speed/1000+"s","-webkit-transition-timing-function":"cubic-bezier("+this._cubic_bezier+", "+bounce+")","transition-timing-function":"cubic-bezier("+this._cubic_bezier+", "+bounce+")"};},_setButtons:function(){var that=this;var total_buttons=0;if(typeof this.buttons!=="object"){this.buttons={};}$.each(this.buttons,function(key,button){total_buttons+=1;if(typeof button==="function"){that.buttons[key]=button={action:button};}that.buttons[key].text=button.text||key;that.buttons[key].btnClass=button.btnClass||"btn-default";that.buttons[key].action=button.action||function(){};that.buttons[key].keys=button.keys||[];that.buttons[key].isHidden=button.isHidden||false;that.buttons[key].isDisabled=button.isDisabled||false;$.each(that.buttons[key].keys,function(i,a){that.buttons[key].keys[i]=a.toLowerCase();});var button_element=$('<button type="button" class="btn"></button>').html(that.buttons[key].text).addClass(that.buttons[key].btnClass).prop("disabled",that.buttons[key].isDisabled).css("display",that.buttons[key].isHidden?"none":"").click(function(e){e.preventDefault();var res=that.buttons[key].action.apply(that,[that.buttons[key]]);that.onAction.apply(that,[key,that.buttons[key]]);that._stopCountDown();if(typeof res==="undefined"||res){that.close();}});that.buttons[key].el=button_element;that.buttons[key].setText=function(text){button_element.html(text);};that.buttons[key].addClass=function(className){button_element.addClass(className);};that.buttons[key].removeClass=function(className){button_element.removeClass(className);};that.buttons[key].disable=function(){that.buttons[key].isDisabled=true;button_element.prop("disabled",true);};that.buttons[key].enable=function(){that.buttons[key].isDisabled=false;button_element.prop("disabled",false);};that.buttons[key].show=function(){that.buttons[key].isHidden=false;button_element.css("display","");};that.buttons[key].hide=function(){that.buttons[key].isHidden=true;button_element.css("display","none");};that["$_"+key]=that["$$"+key]=button_element;that.$btnc.append(button_element);});if(total_buttons===0){this.$btnc.hide();}if(this.closeIcon===null&&total_buttons===0){this.closeIcon=true;}if(this.closeIcon){if(this.closeIconClass){var closeHtml='<i class="'+this.closeIconClass+'"></i>';this.$closeIcon.html(closeHtml);}this.$closeIcon.click(function(e){e.preventDefault();var buttonName=false;var shouldClose=false;var str;if(typeof that.closeIcon=="function"){str=that.closeIcon();}else{str=that.closeIcon;}if(typeof str=="string"&&typeof that.buttons[str]!="undefined"){buttonName=str;shouldClose=false;}else{if(typeof str=="undefined"||!!(str)==true){shouldClose=true;}else{shouldClose=false;}}if(buttonName){var btnResponse=that.buttons[buttonName].action.apply(that);shouldClose=(typeof btnResponse=="undefined")||!!(btnResponse);}if(shouldClose){that.close();}});this.$closeIcon.show();}else{this.$closeIcon.hide();}},setTitle:function(string,force){force=force||false;if(typeof string!=="undefined"){if(typeof string=="string"){this.title=string;}else{if(typeof string=="function"){if(typeof string.promise=="function"){console.error("Promise was returned from title function, this is not supported.");}var response=string();if(typeof response=="string"){this.title=response;}else{this.title=false;}}else{this.title=false;}}}if(this.isAjaxLoading&&!force){return;}this.$title.html(this.title||"");this.updateTitleContainer();},setIcon:function(iconClass,force){force=force||false;if(typeof iconClass!=="undefined"){if(typeof iconClass=="string"){this.icon=iconClass;}else{if(typeof iconClass==="function"){var response=iconClass();if(typeof response=="string"){this.icon=response;}else{this.icon=false;}}else{this.icon=false;}}}if(this.isAjaxLoading&&!force){return;}this.$icon.html(this.icon?'<i class="'+this.icon+'"></i>':"");this.updateTitleContainer();},updateTitleContainer:function(){if(!this.title&&!this.icon){this.$titleContainer.hide();}else{this.$titleContainer.show();}},setContentPrepend:function(content,force){if(!content){return;}this.contentParsed.prepend(content);},setContentAppend:function(content){if(!content){return;}this.contentParsed.append(content);},setContent:function(content,force){force=!!force;var that=this;if(content){this.contentParsed.html("").append(content);}if(this.isAjaxLoading&&!force){return;}this.$content.html("");this.$content.append(this.contentParsed);setTimeout(function(){that.$body.find("input[autofocus]:visible:first").focus();},100);},loadingSpinner:false,showLoading:function(disableButtons){this.loadingSpinner=true;this.$jconfirmBox.addClass("loading");if(disableButtons){this.$btnc.find("button").prop("disabled",true);}},hideLoading:function(enableButtons){this.loadingSpinner=false;this.$jconfirmBox.removeClass("loading");if(enableButtons){this.$btnc.find("button").prop("disabled",false);}},ajaxResponse:false,contentParsed:"",isAjax:false,isAjaxLoading:false,_parseContent:function(){var that=this;var e="&nbsp;";if(typeof this.content=="function"){var res=this.content.apply(this);if(typeof res=="string"){this.content=res;}else{if(typeof res=="object"&&typeof res.always=="function"){this.isAjax=true;this.isAjaxLoading=true;res.always(function(data,status,xhr){that.ajaxResponse={data:data,status:status,xhr:xhr};that._contentReady.resolve(data,status,xhr);if(typeof that.contentLoaded=="function"){that.contentLoaded(data,status,xhr);}});this.content=e;}else{this.content=e;}}}if(typeof this.content=="string"&&this.content.substr(0,4).toLowerCase()==="url:"){this.isAjax=true;this.isAjaxLoading=true;var u=this.content.substring(4,this.content.length);$.get(u).done(function(html){that.contentParsed.html(html);}).always(function(data,status,xhr){that.ajaxResponse={data:data,status:status,xhr:xhr};that._contentReady.resolve(data,status,xhr);if(typeof that.contentLoaded=="function"){that.contentLoaded(data,status,xhr);}});}if(!this.content){this.content=e;}if(!this.isAjax){this.contentParsed.html(this.content);this.setContent();that._contentReady.resolve();}},_stopCountDown:function(){clearInterval(this.autoCloseInterval);if(this.$cd){this.$cd.remove();}},_startCountDown:function(){var that=this;var opt=this.autoClose.split("|");if(opt.length!==2){console.error("Invalid option for autoClose. example 'close|10000'");return false;}var button_key=opt[0];var time=parseInt(opt[1]);if(typeof this.buttons[button_key]==="undefined"){console.error("Invalid button key '"+button_key+"' for autoClose");return false;}var seconds=Math.ceil(time/1000);this.$cd=$('<span class="countdown"> ('+seconds+")</span>").appendTo(this["$_"+button_key]);this.autoCloseInterval=setInterval(function(){that.$cd.html(" ("+(seconds-=1)+") ");if(seconds<=0){that["$$"+button_key].trigger("click");that._stopCountDown();}},1000);},_getKey:function(key){switch(key){case 192:return"tilde";case 13:return"enter";case 16:return"shift";case 9:return"tab";case 20:return"capslock";case 17:return"ctrl";case 91:return"win";case 18:return"alt";case 27:return"esc";case 32:return"space";}var initial=String.fromCharCode(key);if(/^[A-z0-9]+$/.test(initial)){return initial.toLowerCase();}else{return false;}},reactOnKey:function(e){var that=this;var a=$(".jconfirm");if(a.eq(a.length-1)[0]!==this.$el[0]){return false;}var key=e.which;if(this.$content.find(":input").is(":focus")&&/13|32/.test(key)){return false;}var keyChar=this._getKey(key);if(keyChar==="esc"&&this.escapeKey){if(this.escapeKey===true){this.$scrollPane.trigger("click");}else{if(typeof this.escapeKey==="string"||typeof this.escapeKey==="function"){var buttonKey;if(typeof this.escapeKey==="function"){buttonKey=this.escapeKey();}else{buttonKey=this.escapeKey;}if(buttonKey){if(typeof this.buttons[buttonKey]==="undefined"){console.warn("Invalid escapeKey, no buttons found with key "+buttonKey);}else{this["$_"+buttonKey].trigger("click");}}}}}$.each(this.buttons,function(key,button){if(button.keys.indexOf(keyChar)!=-1){that["$_"+key].trigger("click");}});},setDialogCenter:function(){console.info("setDialogCenter is deprecated, dialogs are centered with CSS3 tables");},_unwatchContent:function(){clearInterval(this._timer);},close:function(){var that=this;if(typeof this.onClose==="function"){this.onClose();}this._unwatchContent();$(window).unbind("resize."+this._id);$(window).unbind("keyup."+this._id);$(window).unbind("jcKeyDown."+this._id);if(this.draggable){$(window).unbind("mousemove."+this._id);$(window).unbind("mouseup."+this._id);this.$titleContainer.unbind("mousedown");}that.$el.removeClass(that.loadedClass);$("body").removeClass("jconfirm-no-scroll-"+that._id);that.$jconfirmBoxContainer.removeClass("jconfirm-no-transition");setTimeout(function(){that.$body.addClass(that.closeAnimationParsed);that.$jconfirmBg.addClass("jconfirm-bg-h");var closeTimer=(that.closeAnimation==="none")?1:that.animationSpeed;setTimeout(function(){that.$el.remove();var l=jconfirm.instances;var i=jconfirm.instances.length-1;for(i;i>=0;i--){if(jconfirm.instances[i]._id===that._id){jconfirm.instances.splice(i,1);}}if(!jconfirm.instances.length){if(that.scrollToPreviousElement&&jconfirm.lastFocused&&jconfirm.lastFocused.length&&$.contains(document,jconfirm.lastFocused[0])){var $lf=jconfirm.lastFocused;if(that.scrollToPreviousElementAnimate){var st=$(window).scrollTop();var ot=jconfirm.lastFocused.offset().top;var wh=$(window).height();if(!(ot>st&&ot<(st+wh))){var scrollTo=(ot-Math.round((wh/3)));$("html, body").animate({scrollTop:scrollTo},that.animationSpeed,"swing",function(){$lf.focus();});}else{$lf.focus();}}else{$lf.focus();}jconfirm.lastFocused=false;}}if(typeof that.onDestroy==="function"){that.onDestroy();}},closeTimer*0.4);},50);return true;},open:function(){if(this.isOpen()){return false;}this._buildHTML();this._bindEvents();this._open();return true;},setStartingPoint:function(){var el=false;if(this.animateFromElement!==true&&this.animateFromElement){el=this.animateFromElement;jconfirm.lastClicked=false;}else{if(jconfirm.lastClicked&&this.animateFromElement===true){el=jconfirm.lastClicked;jconfirm.lastClicked=false;}else{return false;}}if(!el){return false;}var offset=el.offset();var iTop=el.outerHeight()/2;var iLeft=el.outerWidth()/2;iTop-=this.$jconfirmBox.outerHeight()/2;iLeft-=this.$jconfirmBox.outerWidth()/2;var sourceTop=offset.top+iTop;sourceTop=sourceTop-this._scrollTop();var sourceLeft=offset.left+iLeft;var wh=$(window).height()/2;var ww=$(window).width()/2;var targetH=wh-this.$jconfirmBox.outerHeight()/2;var targetW=ww-this.$jconfirmBox.outerWidth()/2;sourceTop-=targetH;sourceLeft-=targetW;if(Math.abs(sourceTop)>wh||Math.abs(sourceLeft)>ww){return false;}this.$jconfirmBoxContainer.css("transform","translate("+sourceLeft+"px, "+sourceTop+"px)");},_open:function(){var that=this;if(typeof that.onOpenBefore==="function"){that.onOpenBefore();}this.$body.removeClass(this.animationParsed);this.$jconfirmBg.removeClass("jconfirm-bg-h");this.$body.focus();that.$jconfirmBoxContainer.css("transform","translate("+0+"px, "+0+"px)");setTimeout(function(){that.$body.css(that._getCSS(that.animationSpeed,1));that.$body.css({"transition-property":that.$body.css("transition-property")+", margin"});that.$jconfirmBoxContainer.addClass("jconfirm-no-transition");that._modalReady.resolve();if(typeof that.onOpen==="function"){that.onOpen();}that.$el.addClass(that.loadedClass);},this.animationSpeed);},loadedClass:"jconfirm-open",isClosed:function(){return !this.$el||this.$el.css("display")==="";},isOpen:function(){return !this.isClosed();},toggle:function(){if(!this.isOpen()){this.open();}else{this.close();}}};jconfirm.instances=[];jconfirm.lastFocused=false;jconfirm.pluginDefaults={template:'<div class="jconfirm"><div class="jconfirm-bg jconfirm-bg-h"></div><div class="jconfirm-scrollpane"><div class="jconfirm-row"><div class="jconfirm-cell"><div class="jconfirm-holder"><div class="jc-bs3-container"><div class="jc-bs3-row"><div class="jconfirm-box-container jconfirm-animated"><div class="jconfirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1"><div class="jconfirm-closeIcon">&times;</div><div class="jconfirm-title-c"><span class="jconfirm-icon-c"></span><span class="jconfirm-title"></span></div><div class="jconfirm-content-pane"><div class="jconfirm-content"></div></div><div class="jconfirm-buttons"></div><div class="jconfirm-clear"></div></div></div></div></div></div></div></div></div></div>',title:"Hello",titleClass:"",type:"default",typeAnimated:true,draggable:true,dragWindowGap:15,dragWindowBorder:true,animateFromElement:true,alignMiddle:true,smoothContent:true,content:"",buttons:{},defaultButtons:{ok:{action:function(){}},close:{action:function(){}}},contentLoaded:function(){},icon:"",lazyOpen:false,bgOpacity:null,theme:"light",animation:"scale",closeAnimation:"scale",animationSpeed:400,animationBounce:1,escapeKey:true,rtl:false,container:"body",containerFluid:false,backgroundDismiss:false,backgroundDismissAnimation:"shake",autoClose:false,closeIcon:null,closeIconClass:false,watchInterval:100,columnClass:"col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1",boxWidth:"50%",scrollToPreviousElement:true,scrollToPreviousElementAnimate:true,useBootstrap:true,offsetTop:40,offsetBottom:40,bootstrapClasses:{container:"container",containerFluid:"container-fluid",row:"row"},onContentReady:function(){},onOpenBefore:function(){},onOpen:function(){},onClose:function(){},onDestroy:function(){},onAction:function(){}};var keyDown=false;$(window).on("keydown",function(e){if(!keyDown){var $target=$(e.target);var pass=false;if($target.closest(".jconfirm-box").length){pass=true;}if(pass){$(window).trigger("jcKeyDown");}keyDown=true;}});$(window).on("keyup",function(){keyDown=false;});jconfirm.lastClicked=false;$(document).on("mousedown","button, a",function(){jconfirm.lastClicked=$(this);});})(jQuery,window);
    jQuery(document).ready(function($) {
      $(document).on('click','.group_remove' , function(){
        var self = $(this);
         $.confirm({
                title: '',
                content: 'Are you sure to Delete Group?',
                buttons: {
                    confirm: function () {
                       var group_id = $(self).parent().attr("id");
                        $(".gift_product_list_row").each(function(){
                            if($(this).find("h4").text() == group_id){
                                $(this).remove();
                            }
                        });
                        $(self).parent().find(".group_item_list").each(function(){

                            var list_id = $(this).find(".group_item_list_id").val();
                            var list_id_hash  = "#"+list_id;
                            //console.log(list_id_hash);
                            var item_qty = $(this).find(".group_item_list_qty").val();
                            jQuery(list_id_hash).attr("disabled", false);
                            var main_qty = jQuery(list_id_hash).parent().find(".cart_item_data.qty").html();

                            jQuery(list_id_hash).parent().find(".cart_item_data.qty").html(parseFloat(main_qty) + parseFloat(item_qty));
                        });
                        
                        jQuery(".make_group .action").attr("disabled", false);
                        $(self).parent().remove();
                        $(".add_product_position_fix").css("display","none");
                         gift_wrap_charge();
                    },
                    cancel: function () {   
                    }
                }
            });         
      });
     
       $('.make_group_button').hide();
		$('.productselectbox').change(function () {
			if ($(this).prop("checked") && !$(this).attr('disabled')) {
				$(".make_group_button").css('display', 'block')
			}else if ($('.productselectbox:checked').length && !$('.productselectbox:checked').attr('disabled')) {
				$(".make_group_button").css('display', 'block')
			} else {
				$(".make_group_button").css('display', 'none')
			}
		});
        gift_wrap_charge();
     
        $(document).on('click','.add_in_group',function(){
             var checkbox_flag = 0;
             var group_content = "";
            $(".cart_products li.item_list").each(function()
            {
                if((jQuery(this).find(".productselectbox").is(":checked") == true) && (jQuery(this).find(".productselectbox").attr("disabled") != "disabled")){
                    var each_group_content = "<div class='group_item_list'>";
                    var cart_item_name = jQuery(this).find(".cart_item_data.product").html();
                    var cart_item_img = jQuery(this).find('.prod_img').attr("src");
                    //console.log(cart_item_img);
                    var gp_id = jQuery(this).find(".productselectbox").attr("id");
                    var cart_item_qty = jQuery(this).find(".cart_item_data.qty").html();
                    each_group_content = each_group_content +"<div class='cart_item_img'><img src='"+cart_item_img+"' width='50' height='50' class='prod_img' /></div><div class='cart_item_name'>"+ cart_item_name+"</div><input type='hidden' class='group_item_list_id' value='"+gp_id+"' />"+"<div class='qty-btn-function'><div class='dec button'>-</div></div><input type='number' class='group_item_list_qty' value='"+cart_item_qty+"' min='1' max='"+cart_item_qty+"'readonly /><div class='qty-btn-function'><div class='inc button'>+</div></div><div class='delete_item'> <i class='fa fa-trash' aria-hidden='true'></i></div>";
                    each_group_content = each_group_content +"</div>";
                    group_content = group_content+each_group_content;
                    jQuery(this).find(".productselectbox").attr("disabled", true);
                    jQuery(".make_group .action").attr("disabled", true);
                    checkbox_flag = 1;
                    jQuery(this).find(".cart_item_data.qty").html("0");
                }
            });
            $(".group_item_list_container").each(function(){
                var edit_id = "";
                if($(this).hasClass("working_group")){
                    var edit_id = $(this).attr("id");
                }
                if(edit_id != ""){
                    var editing_id = "#"+edit_id+" .group_action";
                    $( group_content ).insertBefore( editing_id );
                }
            });
        });
      $(document).on('click','.notify_customer',function(){
        $(this).toggleClass("active");
        if(jQuery(this).hasClass("active")){
            $(this).parent().find(".notify-customer").attr("checked", true);
        }else{
            $(this).parent().find(".notify-customer").attr("checked", false);
        }       
      });
      $(document).on('click','.gift_wrap',function(){
        $(this).toggleClass("active");
        if(jQuery(this).hasClass("active")){
            $(this).parent().find(".gift-wrap").attr("checked", true);
        }else{
            $(this).parent().find(".gift-wrap").attr("checked", false);
        }    
        gift_wrap_charge();     
      });
      $(document).on('click','.delete_item',function(){     
        var count = $(this).parent().parent().find(".group_item_list").length;
        var group_id = $(this).parent().parent().attr('id');
        console.log(group_id);
        if( count > 1){
            var self = $(this);
         $.confirm({
                title: '',
                content: 'Are you sure to Delete Product?',
                buttons: {
                    confirm: function () {
                    		var admin_url = $('.admin-url').text(); 
                            var list_id = $(self).parent().find(".group_item_list_id").val();
                            var list_id_hash  = "#"+list_id;
                            console.log(list_id);
                            var item_qty = $(self).parent().find(".group_item_list_qty").val();                            
                            jQuery(list_id_hash).attr("disabled", false);
                            var main_qty = jQuery(list_id_hash).parent().find(".cart_item_data.qty").html();
	                            $.ajax({
					                type: "POST", // use $_POST method to submit data
					                url: admin_url, // where to submit the data
					                data: {
					                    action: 'acewcgp_remove_single_product',
					                    product_id: list_id,
					                    group_id : group_id
					                },
					                success: function (data) {
					                   			               
					                },
					                error: function (errorThrown) {
					                    // console.log(errorThrown); // error
					                }
					            });
                            console.log(main_qty);
                            jQuery(list_id_hash).parent().find(".cart_item_data.qty").html(parseFloat(main_qty) + parseFloat(item_qty));
                            $(self).parent().remove();
                            gift_wrap_charge();
                    },
                    cancel: function () {   
                    }
                }
            });
            
        }else{
            $(this).parent().parent().find(".group_remove").trigger('click');           
        }       
      });
      $(document).on('click', 'a[href^="#"]', function(e) {
            // target element id
            if (typeof $(document).find('.current_active').html() != 'undefined') 
            {
				save_group();
			}
			$('.group_item_list').each(function(){
				var self = $(this);
				var group_item_name = $(self).find('.cart_item_name').text();
				$('.item_list').each(function(){
					var cart_item_name = $(this).find('.cart_item_data.product').text();
					if(cart_item_name == group_item_name)
					{
						var img = $(this).find('img').attr('src');
						$(self).find('.cart_item_img img').attr('src', img);
					}
				});
			});
            $(".group_item_list_container").css("display","none");
            $(".add_product_position_fix").css("display","block");
            $(".group_item_list_container").removeClass("working_group");
            var id = $(this).attr('href');
            $(id).addClass("current_active");
            $(id).css("display","inline-block");
            $(id).addClass("active");
             $(id).addClass("working_group");

            $(id).find(".group_item_list").each(function()
            {
                $(this).find(".group_item_list_qty").attr("max",$(this).find(".group_item_cart_qty").val());                
                $(this).find(".group_item_list_id").val();
                var group_product_id = $(this).find(".group_item_list_id").val();
                var cart_select_box = '.productselectbox#'+group_product_id;
                jQuery(cart_select_box).attr("disabled", true);
            });         
            var $id = $(id);
            if ($id.length === 0) {
                return;
            }
            e.preventDefault();
        });
      	$(document).on('click', '.qty-btn-function .button', function () {

			var $button = $(this);
			var oldValue = $button.parent().parent().find(".group_item_list_qty").val();
			var maxValue = $button.parent().parent().find(".group_item_list_qty").attr("max");
			var item_id = $button.parent().parent().find(".group_item_list_id").val();
			var newVal = parseFloat(oldValue) + 1;
			if ($button.text() == "+") {
				var flag = false;
				$(".cart_products li.item_list").each(function () {
				if ($(this).find(".productselectbox").attr("id") == item_id) {
				var main_qty = $(this).find(".cart_item_data.qty").text().replace(/\s/g, "");
				if (main_qty != "0") {
				var mainnewVal = parseFloat(main_qty) - 1;
				$(this).find(".cart_item_data.qty").html(mainnewVal);
				} else {
				flag = true;
				}
				}
				});
				if (newVal > maxValue) {
				newVal = maxValue;
				}
				if (flag == true) {
				newVal = oldValue;
				}
			} else {
			if (oldValue > 1) {
			var newVal = parseFloat(oldValue) - 1;
			$(".cart_products li.item_list").each(function () {
			if ($(this).find(".productselectbox").attr("id") == item_id) {
			var main_qty = $(this).find(".cart_item_data.qty").html();
			var mainnewVal = parseFloat(main_qty) + 1;
			$(this).find(".cart_item_data.qty").html(mainnewVal);
			}
			});
			} else {
			newVal = 1;
			}
			}
			$button.parent().parent().find(".group_item_list_qty").val(newVal);
		});
        $('.gift_product_checkout').click(function () 
        {
            var self = $(this);
            var admin_url = $('.admin-url').text(); 
            var checkout_url = $('.checkout-url').text();                            
            var length = $('.gift_product_group_list li').length;
            var flag = 0;
            var group_list = [];        
            $('.gift_product_group_list li').each(function ()
            {
                var group = {};      
                var group_id_temp = $(this).find('h3').text();          
                var group_id = $(this).find('h4').text();
                var phone_no = $(this).find('.final_phone_number').val();
                var delivery_add = $(this).find('.final_delivery_address').val();
                var postcode = $(this).find('.final_postcode').val();
                var email = $(this).find('.final_email_address').val();
                var notify = 0; 
                if($(this).find('.notify-customer').is(':checked')){
                    notify = 1;
                }
                var gift_wrap = 0;
                if($(this).find('.gift-wrap').is(':checked')){
                    gift_wrap = 1;
                }       
                if(delivery_add == ''){
                    $.alert(group_id_temp+' provide all details');
                    flag = 0;
                    return false;
                }else{ flag = 1; }              
                group['group_id'] = group_id;
                group['phone_no'] = phone_no;
                group['delivery_add'] = delivery_add;
                group['postcode'] = postcode;
                group['email'] = email;
                group['notify'] = notify;
                group['gift_wrap'] = gift_wrap;
                var find_group = '#'+group_id+' .group_item_list';
                var product_list = [];
                $(find_group).each(function ()
                {
                    var product = {};
                    var product_id = $(this).find('.group_item_list_id').val(); 
                    var product_qty = $(this).find('.group_item_list_qty').val();
                    var product_name = $(this).find('.group_item_list_name').val();
                    product['id'] = product_id;
                    product['qty'] = product_qty;
                    product['name'] = product_name;
                    product_list.push(product);
                });
                group['product_list'] = product_list;
                group_list.push(group);
            });         
            var json_group_list = JSON.stringify(group_list);
            if(flag == 1 || length == 0)
            {
                $.ajax({
                    type: "POST", 
                    url: admin_url,
                    data: {
                        action: 'acewcgp_save_checkout_details',
                        group_list : json_group_list,         
                    },
                    success: function (data) {
                       window.location.replace(checkout_url);
                    },
                    error: function (errorThrown) {
                    }
                });
            }
            else{   }
        });

        

        $('.save_details').click(function () 
        {
            var self = $(this);
            var admin_url = $('.admin-url').text(); 
            var checkout_url = $('.checkout-url').text();                            
            var length = $('.gift_product_group_list li').length;
            var flag = 0;
            var group_list = [];        
            $('.gift_product_group_list li').each(function ()
            {
                var group = {};      
                var group_id_temp = $(this).find('h3').text();          
                var group_id = $(this).find('h4').text();
                var phone_no = $(this).find('.final_phone_number').val();
                var delivery_add = $(this).find('.final_delivery_address').val();
                var postcode = $(this).find('.final_postcode').val();
                var email = $(this).find('.final_email_address').val();
                var notify = 0; 
                if($(this).find('.notify-customer').is(':checked')){
                    notify = 1;
                }
                var gift_wrap = 0;
                if($(this).find('.gift-wrap').is(':checked')){
                    gift_wrap = 1;
                }       
                if(delivery_add == ''){
                    $.alert(group_id_temp+' provide all details');
                    flag = 0;
                    return false;
                }else{ flag = 1; }              
                group['group_id'] = group_id;
                group['phone_no'] = phone_no;
                group['delivery_add'] = delivery_add;
                group['postcode'] = postcode;
                group['email'] = email;
                group['notify'] = notify;
                group['gift_wrap'] = gift_wrap;
                var find_group = '#'+group_id+' .group_item_list';
                var product_list = [];
                $(find_group).each(function ()
                {
                    var product = {};
                    var product_id = $(this).find('.group_item_list_id').val(); 
                    var product_qty = $(this).find('.group_item_list_qty').val();
                    var product_name = $(this).find('.group_item_list_name').val();
                    product['id'] = product_id;
                    product['qty'] = product_qty;
                    product['name'] = product_name;
                    product_list.push(product);
                });
                group['product_list'] = product_list;
                group_list.push(group);
            });         
            var json_group_list = JSON.stringify(group_list);
            if(flag == 1 || length == 0)
            {
                $.ajax({
                    type: "POST", 
                    url: admin_url,
                    data: {
                        action: 'acewcgp_save_checkout_details',
                        group_list : json_group_list,         
                    },
                    success: function (data) {
                     //  window.location.replace(checkout_url);
                    },
                    error: function (errorThrown) {
                    }
                });
            }
            else{   }
        });

                var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
                    if(!isMobile) {
                        var navWrap = $('.group_name_products'),
                        nav = $('.group_item_list_container'),
                        startPosition = navWrap.offset().top - 20;
                      //  console.log(startPosition);
                        $(document).scroll(function () {
                            stopPosition = ($('.cart_products').innerHeight()+$('.create_group_container').innerHeight());
                            //console.log(stopPosition);
                            //stopPosition = stopPosition + 300;
                            //stick nav to top of page
                            var y = $(this).scrollTop();
                         //   console.log(y);
                           if (y > startPosition) {
                                $('.group_item_list_container').addClass('active');
                                if (y > stopPosition) {
                                     $('.group_item_list_container').css('top', stopPosition - y);
                                } else {
                                     $('.group_item_list_container').css('top', 110);
                                }
                            }else {
                                 $('.group_item_list_container').removeClass('active');
                                 $('.group_item_list_container').css('top', 0);
                            } 
                        });
                    }

                    $(document).on('click','.group_contain span.edit',function(){
                        
                        $(this).parent().parent().find("a").trigger('click');
                    });
                    $(document).on('click','.group_contain span.close',function(){

                        var remove_id = $(this).parent().parent().find("a").attr('href');
                        console.log(remove_id);
                        remove_id = $.trim(remove_id);
                        $(remove_id).find(".group_remove").trigger('click');

                    });
                    $(document).on('click','.group_contain span.address', function(){
                        var self = $(this);
                        $.confirm({
                        title: '',
                        content: '' +
                        '<form action="" class="formName">' +
                        '<div class="form-group custom_group_details">' +
                        '<textarea placeholder="Delivery Address" class="deliveryaddress form-control" required >' +  $(self).parent().parent().find(".final_delivery_address").val() + '</textarea>' +
                        '<input type="number" placeholder="PinCode" class="pincode forn-control" value="'+  $(self).parent().parent().find(".final_postcode").val() +'" required />'+
                        '<input type="email" placeholder="Email ID" class="email forn-control" value="'+  $(self).parent().parent().find(".final_email_address").val() +'" required />'+
                        '<input type="number" placeholder="Phone No." class="phone forn-control" value="'+  $(self).parent().parent().find(".final_phone_number").val() +'" required />'+
                        '</div>' +
                        '</form>',
                        buttons: {
                            formSubmit: {
                                text: 'Submit',
                                btnClass: 'btn-blue',
                                action: function () {
                                    var deliveryaddress = this.$content.find('.deliveryaddress').val();
                                    var pincode = this.$content.find('.pincode').val();
                                    var email = this.$content.find('.email').val();
                                    var phone = this.$content.find('.phone').val();
                                    if(!deliveryaddress){
                                        $.alert('provide a valid Delivery Address');
                                        return false;
                                    }
                                     if(!pincode){
                                        $.alert('provide a valid pincode');
                                        return false;
                                    }
                                     var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                                     if(!email || regex.test(email) == false)
                                     {                              
                                        $.alert('provide a valid email id');
                                        return false;                                       
                                    }                                  
                                    if(!phone){
                                        $.alert('provide a valid phone number.');
                                        return false;
                                    }
                                    $(self).addClass("active");
                                    
                                    $(self).parent().parent().find(".final_delivery_address").val(deliveryaddress);
                                    $(self).parent().parent().find(".final_postcode").val(pincode);
                                    $(self).parent().parent().find(".final_email_address").val(email);
                                    $(self).parent().parent().find(".final_phone_number").val(phone);
                                }
                            },
                            cancel: function () {
                                //close
                            },
                        },
                        onContentReady: function () {
                            // bind to events
                            var jc = this;
                            this.$content.find('form').on('submit', function (e) {
                                // if the user submits the form by pressing enter in the field.
                                e.preventDefault();
                                jc.$$formSubmit.trigger('click'); // reference the button and click it
                            });
                        }
                    });
                    });
    });


/*});
*/
function make_group(){

	if (typeof jQuery(document).find('.current_active').html() != 'undefined') 
	{
		jQuery(document).find('.current_active').find('.save_group_button').trigger('click');
	}
	
    jQuery(".group_item_list_container").css("display","none");
    var group_no_length = jQuery('.gift_product_group_list li').length; 
    group_no = jQuery('.gift_product_group_list li:last-child').find('.group_count .number').text();
    if(group_no == ''){
        group_no = 0;
    }
    if(group_no_length > group_no){
        group_no = group_no_length;
    }
    var new_group_no = parseInt(group_no) + parseInt(1);    
    new_group_no = 'Group No '+ new_group_no;
     var timestamp = new Date().getTime();
     var checkbox_flag = 0;
    var group_id = "Group_"+timestamp.toString().slice(-10);
    var classname_group = "";
        var scroll = jQuery(window).scrollTop();
        if(scroll > 250){
            var classname_group = "group_item_list_container current_active active working_group";
        }else{
            var classname_group = "group_item_list_container current_active working_group";
        }
    var group_content ="<div class='"+classname_group+"' id='"+group_id+"'><h3>"+new_group_no+"</h3><h2 hidden>"+group_id+"</h2><i class='fa fa-close action group_remove'></i>";
    if(jQuery(".productselectbox").is(":checked") == true){
            jQuery(".cart_products li.item_list").each(function(){
                if((jQuery(this).find(".productselectbox").is(":checked") == true) && (jQuery(this).find(".productselectbox").attr("disabled") != "disabled")){
                    var each_group_content = "<div class='group_item_list'>";
                    var cart_item_image = jQuery(this).find(".prod_img").attr("src");
                    var cart_item_name = jQuery(this).find(".cart_item_data.product").html();
                    cart_item_name = jQuery.trim(cart_item_name);
                    var gp_id = jQuery(this).find(".product_id").val();
                    var cart_item_qty = jQuery(this).find(".cart_item_data.qty").html();
                    each_group_content = each_group_content +"<div class='cart_item_img'><img src='"+cart_item_image+"'></img></div><div class='cart_item_name'>"+ cart_item_name+"</div><input type='hidden' class='group_item_list_id' value='"+gp_id+"' /><input type='hidden' class='group_item_list_name' value='"+cart_item_name+"' />"+"<div class='qty-btn-function'><div class='dec button'>-</div></div><input type='number' class='group_item_list_qty' value='"+cart_item_qty+"' min='1' max='"+cart_item_qty+"'readonly /><div class='qty-btn-function'><div class='inc button'>+</div></div><div class='delete_item'> <i class='fa fa-trash' aria-hidden='true'></i></div>";
                    each_group_content = each_group_content +"</div>";
                    group_content = group_content+each_group_content;
                    jQuery(this).find(".productselectbox").attr("disabled", true);
                    jQuery(".make_group .action").attr("disabled", true);
                    checkbox_flag = 1;
                    jQuery(this).find(".cart_item_data.qty").html("0");
                }
            });
            
            if(checkbox_flag == 1){
                group_content +="<div class='group_action' > <a href='javascript:void(0);' onClick='save_group()' class='action primary'> Save </a> </div>";    
                jQuery(".group_name_products").prepend(group_content);
                 jQuery(".add_product_position_fix").css("display","block");
            }else{

                alert("Please Select Product");
            }
            
    }else{
        alert("Please Select Product");
    }
}

function save_group()
{

    jQuery(".add_product_position_fix").css("display","none");
    var create_group_container = jQuery(".create_group_container").offset().top-50;
    jQuery('body, html').animate({scrollTop: create_group_container});

    var group_id = jQuery(".group_name_products .group_item_list_container:first").attr("id");
    jQuery(".group_name_products .group_item_list_container:first").removeClass('current_active');
    var group_id_prefix = "#"+group_id;
    jQuery(".group_item_list_container").css("display","none");
    var deliveryaddress = '';
    var pincode = '';
    var email = '';
    var phone =  '';
    var active_address = '';
    var active_notify_customer = '';
    var checkbox_check = '';
    var active_gift_wrap = '';
    var gift_wrap_checkbox_check = '';
    var group_no_length = jQuery('.gift_product_group_list li').length; 
    var group_no = jQuery('.gift_product_group_list li:last-child').find('.group_count .number').text();
    if(group_no == ''){
        group_no = 0;
    }
    if(group_no_length > group_no)
    {
        group_no = group_no_length;
    }
    group_no = parseInt(group_no) + parseInt(1);
    jQuery(".group_product_list_container .gift_product_group_list .gift_product_list_row").each(function(){
        if(jQuery(this).find("h4").text() == group_id)
        {
            deliveryaddress = jQuery(this).find('.final_delivery_address').val();
            pincode = jQuery(this).find('.final_postcode').val();
            email = jQuery(this).find('.final_email_address').val();
            phone = jQuery(this).find('.final_phone_number').val();
            group_no = jQuery(this).find('a .group_count .number').text();
            if(deliveryaddress != "")
            {
                active_address = "active";
            }

            if(jQuery(this).find(".notify-customer").attr('checked') == "checked"){
            active_notify_customer = "active";
            checkbox_check = "checked='checked'";
            }
            if(jQuery(this).find(".gift_wrap").hasClass('active')){
            active_gift_wrap = "active";
            gift_wrap_checkbox_check = "checked='checked'";
            }
            jQuery(this).remove();
        }
    });
   	jQuery('.make_group_button').hide();
    var gift_product_group = "<li class='gift_product_list_row'><a href='"+group_id_prefix+"' ><h4 hidden>"+group_id+"</h4><h3 class='group_count'>Group No <span class='number'>"+group_no+"</span></h3></a><input type='hidden' class='final_delivery_address' value='"+deliveryaddress+"' /><input type='hidden' class='final_postcode'  value='"+pincode+"' /><input type='hidden' class='final_email_address' value='"+email+"' /><input type='hidden' class='final_phone_number'  value='"+phone+"' />";
    gift_product_group += "<span class='group_contain'><input type='checkbox' name='gift-wrap' class='gift-wrap' "+gift_wrap_checkbox_check+" style='display:none'><span class='gift_wrap tooltip "+active_gift_wrap+"'><i class='fa fa-gift' aria-hidden='true' style='font-size:25px'></i><span class='tooltiptext'>If Enable it than wrap charges will apply to your product.</span></span><input type='checkbox' name='notify-customer' class='notify-customer' "+checkbox_check+" style='display:none' /><span class='notify_customer tooltip "+active_notify_customer+"'><i class='fa fa-bell' aria-hidden='true'  style='font-size:25px'></i> <span class='tooltiptext'>If Enable it than Order detail information will sent to the customer.</span></span> <span class='address tooltip "+active_address+"'><i class='fa fa-address-card' aria-hidden='true'  style='font-size:25px'></i> <span class='tooltiptext'>Add Delivery Address and information of customer that received</span></span> <span class='edit tooltip'><i class='fa fa-edit' style='font-size:25px'></i> <span class='tooltiptext'>Edit Group products</span></span><span class='close tooltip'><i class='fa fa-window-close'  style='font-size:25px'></i> <span class='tooltiptext'>This will remove Group</span></span> </span> </li>";
    jQuery(".group_product_list_container .gift_product_group_list").append(gift_product_group);
    jQuery(".cart_products li.item_list").each(function(){

        if(jQuery(this).find(".productselectbox").attr("disabled") != "disabled")
        {
            jQuery(".make_group .action").attr("disabled", false);
        }else if((jQuery(this).find(".productselectbox").attr("disabled") == "disabled") && (jQuery(this).find(".cart_item_data.qty").text() != "0")){
            jQuery(".make_group .action").attr("disabled", false);
            jQuery(this).find(".productselectbox").attr("disabled",false);
        }else{

        }
    });
     gift_wrap_charge();
    


}
function gift_wrap_charge()
{
    var giftwrap_charge = jQuery('.giftwrap_charge').text();
        var charge = 0;
        jQuery(".group_name_products .group_item_list_container").each(function(){              
            var self = jQuery(this);
            var group_id = jQuery(self).find('h2').text();          
            jQuery(".group_product_list_container .gift_product_group_list .gift_product_list_row").each(function(){
                var gorupID = jQuery(this).find("h4").text();
                if(gorupID == group_id)
                {                   
                    if(jQuery(this).find('.gift-wrap').is(':checked'))
                    {
                        jQuery(self).find('.group_item_list').each(function()
                        {       
                            var prouct_qty = jQuery(this).find('.group_item_list_qty').val();
                            charge = charge + parseInt(giftwrap_charge) * prouct_qty;                           
                        });
                    }
                }
                             
            });
        });
    jQuery('.wrap_charge .price').text(charge);

     if(charge == 0){
        jQuery('.wrap_charge').css('display','none');
     }
     else{
        jQuery('.wrap_charge').css('display','block');
     }

}

