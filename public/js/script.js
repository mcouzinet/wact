/* Author:
	name: Mickael Couzinet
	twitter: @mcouzinet
*/
$(function charge(){
/********************************
* Récupération taille document  *
********************************/	
	var height = $(window).height() - 40;
	var width = $(window).width();
	$(window).resize(function(){
		height = $(this).height() - 40;
		width = $(this).width();
	});
	
/******************
* Menu déroulant  *
******************/
	InfoCompte = $('#InfoCompte');
	InfoCompte.click(function () {
		InfoCompte.find("a:first").addClass('hover');
	    InfoCompte.find("div:first").slideToggle(100);
	});
	InfoCompte.mouseleave(function () {
		InfoCompte.find("a:first").removeClass('hover');
	    InfoCompte.find("div:first").slideUp(100);
	});
	InfoCompte.mouseenter(function () {
		InfoCompte.find("a:first").addClass('hover');
	    InfoCompte.find("div:first").slideDown(100);
	});
	
	btPartager = $('#btPartager');
	InfoCompte.click(function () {
		InfoCompte.find("a:first").addClass('hover');
	    InfoCompte.find("div:first").slideToggle(100);
	});
	InfoCompte.mouseleave(function () {
		InfoCompte.find("a:first").removeClass('hover');
	    InfoCompte.find("div:first").slideUp(100);
	});
	InfoCompte.mouseenter(function () {
		InfoCompte.find("a:first").addClass('hover');
	    InfoCompte.find("div:first").slideDown(100);
	});

/**********************************
* Déroulement changement de page  *
**********************************/	
	btPopulaire = $('#btPopulaire');
	btPopulaire.click(function(){
		$('#main').slideUp(500,function(){
			$('#main').load('/Populaire #main > *').slideDown(500);
		});
		return false;
	});
	btNouveau = $('#btNouveau');
	btNouveau.click(function(){
		$('#main').slideUp(500,function(){
			$('#main').load('/Nouveau #main > *').slideDown(500);
		});
		return false;
	});
	addLink = $('#addLink');
	addLink.click(function(){
	 	$('.lightbox').load('/addLink #main > *').slideToggle(500);
		return false;
	});
	title = $('.title');
	title.click(function(){
	 	$('iframe').slideUp(500,function(){
			$('#nouveau').slideDown(500).load('/Populaire #nouveau',function(){
			charge();	
			});
		});
		return false;
	});
/*****************************************************
* Adapter la taille de l'iframe à celle du document  *
*****************************************************/	
	$('iframe').css({height:height});
	$('#index').css({height:(height+40)});
	
/*************
* Socket.IO  *
*************/	
	 var socket = io.connect('http://localhost:3000');
	 socket.on('addLink', function (data) {
		console.log('DATA = ' +data);
		$('#main').slideDown(500).prepend('<div class="link">'+
			'<div class="score deux '+ data.catégorie +'">'+
				'<div class="titre"><a href="/Act/'+ data.title +'">'+ data.title +'</a></div>'+
				'<div class="footer-link">'+
					'<div class="postor">Par <a href="#">'+ data.author +'</a></div>'+
					'<div class="nbcom"><a href="#" title="commentaires du lien">'+ data.comments.length +' commentaires</a></div>'+
					'<span class="source">'+ data.source +'</span>'+
				'</div>'+
				'<span class="cat">'+ data.catégorie +'</span>'+
				'<span class="poid">'+ data.like +'</span></div></div>');
		
	});
});