/* Author:
	name: Mickael Couzinet
	twitter: @mcouzinet
*/

$(function(){
	var navSite = $('#navSite');
	var navLink = $('#navLink');
	var main =$('#main');
    var iframe = false;
	addEvent();
	$.extend({
	  getUrlVars: function(){
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	      hash = hashes[i].split('=');
	      vars.push(hash[0]);
	      vars[hash[0]] = hash[1];
	    }
	    return vars;
	  },
	  getUrlVar: function(name){
	    return $.getUrlVars()[name];
	  }
	});
	
	url = $.getUrlVar('lien');
	if(url){
		lien = ('<iframe src='+url+' width="100%" height="3000px"></iframe>');
		main.hide();
		navSite.hide();
		navLink.show();
		iframe = true;
		$('body').append(lien);
	}else{
		$.getJSON('json/articles.json', function(data) {
			length = data.articles.length;
			main = $('#main');
			for(var i=0;i<length;i++){
				art = data.articles[i];
				var sc = (art.score <10) ? 'un' : (art.score <20) ? 'deux': (art.score <30) ? 'trois': (art.score <40) ? 'quatre':'cinq';
				main.append('<div class="link">'+
					'<div class="score '+sc+' cat3">'+
					'	<div class="titre"><a href="'+art.url+'" title=""</a>'+art.title+'</div>'+
					'	<div class="footer-link">'+
							'<div class="postor">Par <a href="#">Mikado</a> il y a 50 minutes</div>'+
							'<div class="nbcom"><a href="#" title="commentaires du lien">'+art.commentaires.length+' commentaires</a></div>'+
						'	<span class="source">lemonde.fr</span>'+
					'	</div>'+
						'<span class="cat">'+art.catégorie+'</span>'+
					'	<span class="poid">'+art.score+'</span>'+
				'	</div>'+
				'</div>');	
			}
			addEvent();
		});
	}

	//Recupération de la hauteur du document
	var height = $(window).height() - 40;
	var width = $(window).width();
	$(window).resize(function(){
		height = $(this).height() - 40;
		width = $(this).width();
	})
	function addEvent(){

// CLICK LIEN
	$('.titre a').click(function(){
		var $this=$(this);
		lien = ('<iframe src='+$this.attr('href')+' width="100%" height="3000px"></iframe>');
		main.hide();	
		navSite.animate({'margin-top':'-50px'},400,function(){
			$(this).hide();
			navLink.css({'margin-top':'-50px'}).show();
			navLink.animate({'margin-top':'0px'},400,function(){
				return true;
			});
		});
		$('body').append(lien);
		$('iframe').css({height:height});
		iframe = true;
		return false;
	});

// BOUTON RETOUR
	$('a h1').click(function(){
		var $this=$(this);
		if(iframe){
			$('iframe').animate({opacity:0},400,function(){
				$(this).remove();
				main.css({opacity:0}).show();
				main.animate({opacity:1},400,function(){
					iframe = false;
					return true;
				});
			});
			navLink.animate({'margin-top':'-50px'},400,function(){
				$(this).hide();
				navSite.css({'margin-top':'-50px'}).show();
				navSite.animate({'margin-top':'0px'},400,function(){
					return true;
				});
			});
		}
		return false;
	});

// BOUTON RETOUR
	$('#btCom').click(function(){
		var $this=$(this);
		$('#commentaires').css({height:height});
		if(iframe){
			$('iframe').animate({'margin-left':(-width-20)},400,function(){
				
			});
			
		}
		return false;
	});

// BOUTON PARTAGER	
	$('#btPartager').click(function(){
		var $this=$(this);
		$this.append('')
		return false;
	});
	
// BOUTON ADDLINK
	$('#addLink').click(function(){
		var $this=$(this);
		$this.append('')
		return false;
	});

 	}
});




















/*



*/