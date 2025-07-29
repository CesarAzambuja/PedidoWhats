$(document).ready(function () {
    cardapio.eventos.init();

});

var cardapio = {};
var MEU_CARRINHO = [];
var MEU_ENDERECO = null;
var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 12;
var CELULAR_EMPRESA = '5511992830070';
var WHATSAPP_EMPRESA = `https://wa.me/${CELULAR_EMPRESA}`;
var FACEBOOK_EMPRESA = '';
var INSTAGRAM_EMPRESA = 'http://www.instagram.com/queroseuboga';

cardapio.eventos = {
    init: () => {
        cardapio.metodos.obterItenscardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarbotaoLigar();
        cardapio.metodos.carregarBotoesSociais();
    }

}

cardapio.metodos = {

    //Obtem a lista de itens do cardápio
    obterItenscardapio: (categoria = 'pizzas', vermais = false) => {
        var filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais){
            $("#itensCardapio").html('');
            $('#btnVerMais').removeClass('hidden')
        }

        $("#itensCardapio").html('');

        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${dsc}/g, e.dsc)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${precoOld}/g, e.OldPrice.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id);

            // Botão ver mais foi clicado (12Itens)
            if(vermais && i >= i < 12){
                $("#itensCardapio").append(temp)
            }
            //paginação inicial (8Itens)
            if (!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }
            

        })

        //Remove ativo
        $(".container-menu a").removeClass('active'),

        //Adicionar avito
        $("#menu-" +categoria).addClass('active')
    },
    //Clicar no botão ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //[menu-][burgers]
        cardapio.metodos.obterItenscardapio(ativo, true)

        $('#btnVerMais').addClass('hidden')

       
    }, 
    //Diminui a Quantidade do cardápio
    dininuirQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },
    //Aumenta a Quantidade do cardápio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

            $("#qntd-" + id).text(qntdAtual + 1)
        
    },

    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){

            //Obter categoria Ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            //Obter a lista de itens
            let filtro = MENU[categoria];
            //Obter o item
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if(item.length > 0){

                //Validar se o item já existe ao carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //Caso já exista só alterar a quantidade  
                if(existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                    } else{
                        item[0].qntd = qntdAtual;
                        MEU_CARRINHO.push(item[0]);
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();
            }

        }

    },

    atualizarBadgeTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
        }
        else{
            $(".botao-carrinho").addClass('hidden')   
            $(".container-total-carrinho").addClass('hidden')   
        }

        $(".badge-total-carrinho").html(total)
    },

    //Abrir Modal de Carrinho
    abrirCarrinho: (abrir) =>{
        if(abrir){
            $('#modalCarrinho').removeClass('hidden');
            cardapio.metodos.carregarCarrinho()
        }
        else{
            $('#modalCarrinho').addClass('hidden')
        }
    },
    //Altera os textos e exibe os botões
    carregarEtapa: (etapa) => {
      if (etapa === 1) {
        $("#lblTituloEtapa").text('Seu Carrinho')
        $("#itensCarrinho").removeClass('hidden')
        $("#LocalEntrega").addClass('hidden')
        $("#resumoCarrinho").addClass('hidden')


        $(".etapa").removeClass('active')
        $(".etapa1").addClass('active')

        $("#btnEtapaPedido").removeClass('hidden')
        $("#btnEtapaEndereco").addClass('hidden')
        $("#btnEtapaResumo").addClass('hidden')
        $("#btnVoltar").addClass('hidden')
      }

      if (etapa == 2) {
        $("#lblTituloEtapa").text('Endereço de Entrega')
        $("#itensCarrinho").addClass('hidden')
        $("#LocalEntrega").removeClass('hidden')
        $("#resumoCarrinho").addClass('hidden')


        $(".etapa").removeClass('active')
        $(".etapa1").addClass('active')
        $(".etapa2").addClass('active')

        $("#btnEtapaPedido").addClass('hidden')
        $("#btnEtapaEndereco").removeClass('hidden')
        $("#btnEtapaResumo").addClass('hidden')
        $("#btnVoltar").removeClass('hidden')
      }
      if (etapa == 3) {
        $("#lblTituloEtapa").text('Resumo do Pedido')
        $("#itensCarrinho").addClass('hidden')
        $("#LocalEntrega").addClass('hidden')
        $("#resumoCarrinho").removeClass('hidden')


        $(".etapa").removeClass('active')
        $(".etapa1").addClass('active')
        $(".etapa2").addClass('active')
        $(".etapa3").addClass('active')

        $("#btnEtapaPedido").addClass('hidden')
        $("#btnEtapaEndereco").addClass('hidden')
        $("#btnEtapaResumo").removeClass('hidden')
        $("#btnVoltar").removeClass('hidden')
      }  
    },

    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
        
    },

    //Carrega os itens dos carrinho dinamicamente
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0){
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);

                if((i + 1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores()
                }

            })
        }
        else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio</p>');
            cardapio.metodos.carregarValores();
        }
    },
    //Diminuir a Quantidade do item do carrinho
    dininuirQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1){
            $("#qntd-carrinho-" + id).text(qntdAtual - 1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        } else{
            cardapio.metodos.removerItemCarrinho(id)
        }
    },
    //Aumenta a Quantidade do item do carrinho
    aumentarQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },
    //Botao para remover item do carrinho
    removerItemCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {return e.id != id});
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();
    },
    //Atualiza o carrinho com a quantidade Atual
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão do carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.carregarValores();
    },
    // Carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {
            
                VALOR_CARRINHO += parseFloat(e.price * e.qntd);

                if((i + 1) == MEU_CARRINHO.length){ 
                    $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                    $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')} `);
                    $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')} `);
            }
        })

    },

    //Carrega a etapa endereço
    carregarEndereco: () => {
        if(MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem("Seu carrinho está vazio.")
            return;
        }

        cardapio.metodos.carregarEtapa(2)
    },

    //API ViaCEP
    buscarCep: () => {

        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != ""){

            //Expressão regular para validar CEP
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){
                $.getJSON("https://viacep.com.br/ws/" + cep +"/json/?callback=?", function(dados){

                    if(!("erro" in dados)){

                        //Atualizar os campos com os valores retornados da API

                        $("#txtCEP").val(dados.cep);
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else{
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente');
                        $("#txtEndereco").focus();
                    }

                })
            }
            else{
                cardapio.metodos.mensagem('Formato do CEP Invalido');
                $("#txtCEP").focus();
            }
        }
        else{
            cardapio.metodos.mensagem('Informe o CEP');
            $("#txtCEP").focus();
        }

    },

    //Validação de campos de endereço antes de ir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if(cep.length <= 0){
            cardapio.metodos.mensagem('Informe o CEP');
            $("#txtCEP").focus();
            return;
        }
        if(endereco.length <= 0){
            cardapio.metodos.mensagem('Informe o Endereço');
            $("#txtEndereco").focus();
            return;
        }
        if(bairro.length <= 0){
            cardapio.metodos.mensagem('Informe o Bairro');
            $("#txtBairro").focus();
            return;
        }
        if(cidade.length <= 0){
            cardapio.metodos.mensagem('Informe o Cidade');
            $("#txtCidade").focus();
            return;
        }
        if(uf == -1){
            cardapio.metodos.mensagem('Informe a UF');
            $("#ddlUf").focus();
            return;
        }
        if(numero.length <= 0){
            cardapio.metodos.mensagem('Informe o Numero');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento    
        } 

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${qntd}/g, e.qntd)

                $("#listaItensResumo").append(temp);
        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / CEP: ${MEU_ENDERECO.cep} | ${MEU_ENDERECO.complemento}`)

        cardapio.metodos.finalizarPedido();
    },
    //Atualiza o link do whatsApp
    finalizarPedido: () => {

        if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){

          var texto = `Olá Gostaria de fazer um pedido!\n`;
            texto += `\n*Itens do pedido:* \n\n\${itens}`;
            texto += `\n*Endereço de Entrega:*`;
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro} `;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / CEP: ${MEU_ENDERECO.cep} | ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*TOTAL (Com Entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;

            var itens = ''

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd} x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.',',')} \n`;

                if((i + 1)  == MEU_CARRINHO.length){
                    texto = texto.replace(/\${itens}/g, itens)

                    //converter URL para encode
                    let encode = encodeURI(texto);

                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

                    $('#btnEtapaResumo').attr('href', URL)

                }
            })
        }

    },

    carregarBotaoReserva: () => {

        var texto = 'Olá Gostaria de Fazer uma *reserva*';
        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $('#btnReserva').attr('href', URL)

    },

    carregarbotaoLigar: () => {
        $('#btnLigar').attr('href', `tel:${CELULAR_EMPRESA}` )

    },

    carregarBotoesSociais: () => {
        $('.btnInstagram').attr('href', `${INSTAGRAM_EMPRESA}`);
        $('.btnFacebook').attr('href', `${FACEBOOK_EMPRESA}`);
        $('.btnWhatsapp').attr('href', `${WHATSAPP_EMPRESA}`);

    }, 

    abrirDepoimento: (depoimento) => {
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');


        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $('#depoimento-' + depoimento).removeClass('hidden')
        $("#btnDepoimento-" + depoimento).addClass('active');

    },


    mensagem: (texto, cor = 'red', tempo = 2000) => {

        let id = Math.floor(Date.now() * Math.random()).toString()

        let msg = `<div id="msg-${id}" class=" animated fadeInDown toast ${cor}">${texto}</div>`
        
        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo);
    },

}

cardapio.templates = {
    item: `
        <div class="col-12 col-lg-6 col-dm-6 col-sm-6 mb-5 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto text-center">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="dsc-produto text-sm">
                    \${dsc}
                </p>
                <div class=" flex">
                    <p class="price-produto-old text-center">
                        <b>R$ \${precoOld}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${preco}</b>
                    </p>
                </div>

                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.dininuirQuantidade('\${id}')"><i class=" fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" alt="">
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.dininuirQuantidadeCarrinho('\${id}')"><i class=" fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-trash"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" alt="">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>

        </div>
    `

}