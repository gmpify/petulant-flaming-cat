function show_configs() {

	$('.config-screen').addClass('mostrar-config');

}

function hide_configs() {

	$('.config-screen').addClass('esconder');

}

function show_container_configs(clicked) {

	$('.top-screen-config').removeClass('esconder');
	$('.' + clicked).removeClass('esconder');

}

function hide_container_configs() {

	$('.top-screen-config').addClass('esconder');
	$('.container-utm').addClass('esconder');

}

function show_metricas(clicked) {

	$(clicked).css('overflow', 'auto');
	$(clicked).addClass('mostrar-metricas');
	if ($(clicked).parents('.metricas').length > 0) {
		$(clicked).parents('.metricas').css('overflow', '');
	};

}

function hide_dados(clicked) {

	if ($(clicked).parents('.metricas').length > 0) {
		$(clicked).parent().children('.table-metricas').find('.dados').addClass('esconder');
	};

}

function hide_metricas(clicked) {

	$(clicked).parent().parent().css('overflow', '');
	$(clicked).parent().removeClass('metricas-ativas');
	$(clicked).parent().parent().addClass('esconder');
	if ($(clicked).parent().hasClass('dados-metricas')) {
		$(clicked).parent().find('.metricas-estagio3').css('overflow', '');
		$(clicked).parent().find('.metricas-estagio3').addClass('esconder');
		$(clicked).parent().find('.metricas-estagio3').removeClass('mostrar-metricas');
		$(clicked).parent().find('.metricas-estagio3').children().removeClass('mostrar-ativas');
	}
	else {
		$(clicked).parents('.metricas').css('overflow', 'auto');
	};

}

function treat_sum_and_percentage(group) {
		
		var soma = 0;

		$(group).children('.table-metricas').find('.dados').each(function() {
			soma = soma + parseInt($(this).find('.metrica-valor').text().remove(/\./g));
		});

		$(group).children('.table-metricas').find('.dados').each(function() {
			var relacao = parseInt($(this).find('.metrica-valor').text().remove(/\./g)) / soma;
			var porcentagem = (100 * relacao).format(2, '.', ',');
			$(this).children('.col-1').children('.metrica-porcentagem').text(porcentagem);
		});

		soma = soma.format(0, '.', ',');

		$(group).children('.table-metricas').find('.header').find('.metrica-valor').text(soma);

		return soma;
}

function sum_metricas() {
	
	var soma = 0;
	var grupo = null;

	//Cada nível do funil
	$('.dados-metricas').each(function() {
		
		//Dentro de cada nível, cada grupo
		$('.dados-metricas-estagio3').each(function() {
		
			soma = treat_sum_and_percentage(this);
			grupo = $(this).children('.dados-tit').text();
			$(this).parent().siblings('.table-metricas').find('.dados:contains("' + grupo + '")').find('.metrica-valor').text(soma);

		});

		soma = treat_sum_and_percentage(this);
		grupo = $(this).attr('class').remove(/dados-metricas |funil-.*/g).replace(/dados/, 'passo');
		$('.' + grupo + ' .metrica-valor').text(soma);

	});
}

function load_metricas() {

	var passo_anterior = null;
	var passo = null;
	var porcentagem_barra_anterior = 0;

	$('.funil-passo').each(function() {
		if (passo_anterior != null) {

			passo = $(this).attr('class').replace(/ /g,'.');

			var passo_anterior_valor = parseInt($('.' + passo_anterior + '>.metrica-passo>.metrica-valor').text().remove(/\./g));
			var passo_valor = parseInt($('.' + passo + '>.metrica-passo>.metrica-valor').text().remove(/\./g));

			//Calcula a porcentagem
			var relacao = passo_valor / passo_anterior_valor;
			var porcentagem_valor = (100 * relacao).format(2, '.', ',');
			$('.' + passo + '>.metrica-passo>.metrica-porcentagem').text(porcentagem_valor);
			
			//Calcula o tamanho das barras
			var porcentagem_barra = (relacao * porcentagem_barra_anterior).format(2, ',', '.');
			$('.' + passo + '>.metrica-grafico').width(porcentagem_barra + '%');

			passo_anterior = passo;
			porcentagem_barra_anterior = porcentagem_barra;

		}
		else {

			passo_anterior = $(this).attr('class').replace(/ /g,'.');
			porcentagem_barra_anterior = 100;
			
		};
	});

}

$(function() {

	//Funções automáticas
	sum_metricas();
	load_metricas();

	//Funções dependendetes de eventos	
	var second = 1000; //1 segundo

	//Clicar em algum item da configuração
	$('.menu-config-options>a').click(function() {

		//Verifica a necesside de transição, caso a tela já esteja aberta ou não
		var time_modifier = $('.config-screen').is('.esconder') ? 1 : 0;

		//Trata os botões
		$('.menu-config-options').removeClass('ativo');
		var clicked_button = $(this).attr('class').replace(/option/, 'menu-configs');
		$('.' + clicked_button).addClass('ativo');

		//Trata o topo
		if ($(this).attr('class') == 'option-visualizar-utm') {
			$('.top-screen-config>ul.titulo>li').removeClass("esconder");
		}
		else {
			$('.top-screen-config>ul.titulo>li:not(.titulo-lista)').addClass("esconder");
		};
		
		//Trata o filtro de data
		$('.input-periodo-avaliacao').prop('disabled', true);

		//Trata a tela
		hide_container_configs();
		$('.config-screen').removeClass('esconder');
		var clicked_screen = $(this).attr('class').replace(/option/, 'container');
		setTimeout(function() { show_configs() }, 0.1*time_modifier*second);
		setTimeout(function() { show_container_configs(clicked_screen) }, 0.6*time_modifier*second); // 0.1 do timeout + 0.5 do transition no css

	});

	//Clicar em fechar tela de configuração
	$('.bt-voltar-funil').click(function() {

		//Trata os botões
		$('.menu-config-options').removeClass('ativo');

		//Trata o filtro de data
		$('.input-periodo-avaliacao').prop('disabled', false);

		//Trata a tela
		hide_container_configs();
		$('.config-screen').removeClass('mostrar-config');
		setTimeout(function() { hide_configs() }, 0.6*second);

	});

	//Clicar em algum nível do funil
	$('.funil-passo').click(function() {

		$('.metricas>div').removeClass('metricas-ativas');
		$('.metricas').removeClass('esconder');

		var clicked = $(this).attr('class').replace(/.*passo-/, 'dados-');
		$('.' + clicked).addClass('metricas-ativas');

		setTimeout(function() { show_metricas('.metricas') }, 0.1*second);

	});

	//Clicar em fechar alguma camada
	$('.fechar-metrica').click(function() {
		
		var clicked = this;
		$(this).parent().parent().removeClass('mostrar-metricas');
		$(this).parents('.dados-metricas').children('.table-metricas').find('.dados').removeClass('esconder');
		setTimeout(function() { hide_metricas(clicked) }, 0.6*second); // 0.1 do timeout + 0.5 do transition no css

	});
	
	//Clicar em algum tipo, dentro do nível do funil
	$('.dados-metricas>.table-metricas .dados').click(function() {

		var clicked = $(this).find('.metrica-nome').text();
		if ($(this).parents('.table-metricas').siblings('.metricas-estagio3').find('.dados-tit:contains("' + clicked + '")').length > 0) {
			$(this).parents('.table-metricas').siblings('.metricas-estagio3').children().removeClass('metricas-ativas');
			$(this).parents('.table-metricas').siblings('.metricas-estagio3').removeClass('esconder');
			$(this).parents('.table-metricas').siblings('.metricas-estagio3').find('.dados-tit:contains("' + clicked + '")').parent().addClass('metricas-ativas').length
			var classe = '.' + $(this).parents('.table-metricas').siblings('.metricas-estagio3').attr('class').replace(/ /g,'.');
			setTimeout(function() { show_metricas(classe) }, 0.1*second);
			setTimeout(function() { hide_dados(classe) }, 0.6*second);
		};

	});

	//Abrir menus dropdown
	$('.sub').hover(function() {

		$(this).toggleClass('open');
		$(this).children('ul').toggle();

	});

	//Selecionar opção dos menus dropdown
	$('.select-funil>li').click(function() {

		var chosen = $(this).text();
		$(this).parents('.sub').children('span').text(chosen);

		//Carrega os dados -----------------------------------------------------------------------------------------------------------------------------------------

	});

	//Preencher formulário
	$('.container-utm.container-lote-utm :input').change(function() {
		$(this).parents('.line').next().removeClass('esconder');
	});

	//Submeter formulário TEMP
	$('.container-utm.container-lote-utm :submit').click(function() {
		$(this).parents('.container-utm').children('.line').addClass('esconder');
		$(this).parents('.container-utm').children('.line:first').removeClass('esconder');
		$('.menu-config-options>a.option-visualizar-utm').click();
	});
});