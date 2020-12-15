//____________________________________________________Início_____________________________________________________
function iniciar() {  
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, Largura, Altura);  
    bolinha();
    barrinha();
    bloquinhos();
    colisaoBlocos();
    pontuacao();
    vidasRestantes();
}
var atualiza = setInterval(iniciar, 10);

//Variáveis da tela
var Largura = 1350;  
var Altura = 640;   

//Variáveis da bola
var tamBolinha = 22;
var bolinhax = Largura/2;    
var bolinhay = Altura-30;   
var vx = 3;      
var vy = -3;    

//Variáveis da barra
var altBarra = 15;
var largBarra = 180;
var barrax = (Largura-largBarra)/2; 
var teclaDireita = false;
var teclaEsquerda = false;
document.addEventListener("keydown", setaPressionada, false);                   
document.addEventListener("keyup", setaNpressionada, false);
document.addEventListener("mousemove", mouseBarra, false);

//Variáveis dos bloquinhos
var linhasBlocos = 6;   
var colunasBlocos = 12;
var largBlocos = 90;
var altBlocos = 30;
var espacamento = 15;      
var bordaSuperior = 48;   
var bordaEsquerda = 48;  

//Variável da pontuação
var pontos = 0;

//Variável das vidas
var vidas = 5;

//Variáveis para pausar o jogo
var teclaPause = false;
document.addEventListener("keydown", espacoPressionado, false);                   
document.addEventListener("keyup", espacoNpressionado, false);


//_________________________Desenhando a bola e verificando colisão nas paredes_________________________________
function bolinha() {
    ctx.beginPath();
    ctx.arc(bolinhax, bolinhay, tamBolinha, 0, Math.PI*2);
    ctx.fillStyle = "#18305e";
    ctx.fill();
    ctx.closePath();
//Colisão nas paredes, ou seja, não saindo dos limites
    if(bolinhax + vx > Largura-tamBolinha || bolinhax + vx < tamBolinha) {  //Bordas direita e esquerda
        vx = -vx;
    }
    if(bolinhay + vy < tamBolinha) {  //Borda superior
        vy = -vy;
    }
    else if(bolinhay + vy > Altura-tamBolinha) {   //Borda inferior
        if(bolinhax > barrax && bolinhax < barrax + largBarra) {   //Verificando se a bola colidiu na barra
            vy = -vy;                                             
        }
        else {                       
            vidas--;                                                         
            if(!vidas) {
                alert("Suas vidas chegaram ao fim :( Pontos: " + pontos); 
                document.location.reload();
                clearInterval(atualiza);  
            }
            else {                       //Se ainda tiver vidas restantes, a bola volta para sua posição inicial
                bolinhax = Largura/2;
                bolinhay = Altura-30;
                vx = 3;
                vy = -3;
            }
        }
    }
    bolinhax += vx;  
    bolinhay += vy;
}

//______________________Desenhando a barra e verificando teclas e mouse para poder movê-la__________________
function barrinha() {
    ctx.beginPath();
    ctx.rect(barrax, Altura-altBarra, largBarra, altBarra);
    ctx.fillStyle = "#040e21";
    ctx.fill();
    ctx.closePath();
//Movendo a barra com as teclas
    if(teclaDireita) {
        barrax += 7;   
        if (barrax + largBarra > Largura){
            barrax = Largura - largBarra; 
        }
    }
    else if(teclaEsquerda) {
        barrax -= 7;   
        if (barrax < 0){
            barrax = 0;  
        }
    }
}

//Teclas para mover a barra
function setaPressionada(evt) {
    if(evt.keyCode == 39) {   //seta para direita
        teclaDireita = true;
    }
    else if(evt.keyCode == 37) {  //seta para esquerda
        teclaEsquerda = true;
    }
}

function setaNpressionada(evt) {
    if(evt.keyCode == 39) {
        teclaDireita = false;
    }
    else if(evt.keyCode == 37) {
        teclaEsquerda = false;
    }
}

//Mover a barra com o mouse
function mouseBarra(evt) {
    var posMouse = evt.clientX - canvas.offsetLeft;
    if(posMouse > 0 && posMouse < Largura) { 
        barrax = posMouse - largBarra/2;
    }
}

//________________________________________Matriz para fazermos os blocos_________________________________________________
var criaBlocos = [];
for(var colunas = 0; colunas < colunasBlocos; colunas++) {
    criaBlocos[colunas] = [];
    for(var linhas = 0; linhas < linhasBlocos; linhas++) {
        criaBlocos[colunas][linhas] = {x: 0, y: 0, status: 1};  //definimos o status dos bloquinhos
    }
}

//Desenhando os blocos
function bloquinhos() {
    for(var colunas = 0; colunas < colunasBlocos; colunas++) {
        for(var linhas = 0; linhas < linhasBlocos; linhas++) {
            if(criaBlocos[colunas][linhas].status == 1) {   //verificamos o status de cada bloquinho antes de desenhá-lo
                var blocox = (colunas * (largBlocos + espacamento)) + bordaEsquerda;   
                var blocoy = (linhas * (altBlocos + espacamento)) + bordaSuperior;
                criaBlocos[colunas][linhas].x = blocox;
                criaBlocos[colunas][linhas].y = blocoy;
                ctx.beginPath();
                ctx.rect(blocox, blocoy, largBlocos, altBlocos);
                ctx.fillStyle = 'rgb(0,0,' + Math.floor(245 - 40 * linhas) + ',' + Math.floor(245 - 40 * linhas) + ')';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Verificando se a bolinha colidiu nos bloquinhos, se sim, muda a direção da bola e o status do bloquinho é 0                   
function colisaoBlocos() {
    for(var colunas = 0; colunas < colunasBlocos; colunas++) {
        for(var linhas = 0; linhas < linhasBlocos; linhas++) {
            var bloquinhos = criaBlocos[colunas][linhas];  
            if(bloquinhos.status == 1) {   
                if(bolinhax > bloquinhos.x && bolinhax < bloquinhos.x + largBlocos && bolinhay > bloquinhos.y && bolinhay < bloquinhos.y + altBlocos) { 
                    vy = -vy;                     
                    bloquinhos.status = 0; 
                    pontos++;      
                    if(pontos == linhasBlocos * colunasBlocos) {  
                        alert("Parabéns! Você destruiu todos os bloquinhos :) Pontos: " + pontos);  
                        document.location.reload(); 
                        clearInterval(atualiza); 
                    }
                }  
            }
        }
    }
}

//___________________Pontuação_____________________
function pontuacao() {
    ctx.font = "26px Georgia";
    ctx.fillStyle = "#040e21";
    ctx.fillText("Pontos: " + pontos, 15, 33);
}

//____________________Vidas________________________
function vidasRestantes() {
    ctx.font = "26px Georgia";
    ctx.fillStyle = "#040e21";
    ctx.fillText("Vidas: " + vidas, Largura-110, 33);
}

//__________________________________________Pausando o jogo________________________________________________
function pausa(){
    alert("O jogo foi pausado!");
}

function espacoPressionado(evt) {
    if(evt.keyCode == 32) {   //tecla de espaço
        teclaPause = true;
        pausa();
    }
}

function espacoNpressionado(evt) {
    if(evt.keyCode == 32) {
        teclaPause = false;
    }
}