const express = require("express");
const exphbs = require("express-handlebars");
const sequelize = require("./config/bd");
const Usuario = require('./models/Usuario');
const Consumo = require("./models/Consumo")
const port = 3000;
const app = express();

app.use(express.static('public'));
//Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//rotas

//------------------------------------------Cadastro-------------------------------------
//------------------------------------------Cadastro-------------------------------------
//------------------------------------------Cadastro-------------------------------------

//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
    try {
        const tipoMensagem = req.query.mensagem;

        let mensagemCrud = "";

        switch (tipoMensagem) {

            case "cadastrado":
                mensagemCrud = "✅ Consumo cadastrado com sucesso!";
                break;

            case "editado":
                mensagemCrud = "✏️ Consumo atualizado com sucesso!";
                break;

            case "excluido":
                mensagemCrud = "🗑️ Consumo removido com sucesso!";
                break;

        }
        const consumos = await Consumo.findAll({
        raw: true
    });
    const anos = [...new Set(consumos.map(c => c.ano))];
    let totalAgua = 0;
    let totalEnergia = 0;

    consumos.forEach(consumo => {

        if (consumo.tipo === "Água") {
            totalAgua += consumo.valor;
        } else {
            totalEnergia += consumo.valor;
        }

    });

    // Soma total do consumo
    const consumoTotal = totalAgua + totalEnergia;

    // Classificação da eficiência
    let eficiencia = "";
    let mensagemEficiencia = "";

    if (consumoTotal <= 300) {

        eficiencia = "🟢 Excelente";
        mensagemEficiencia = "Parabéns! Seu consumo está muito baixo.";

    } else if (consumoTotal <= 700) {

        eficiencia = "🟡 Bom";
        mensagemEficiencia = "Seu consumo está dentro da média.";

    } else {

        eficiencia = "🔴 Atenção";
        mensagemEficiencia = "Seu consumo está elevado. Tente economizar água e energia.";

    }

    res.render("home", {
        consumos,
        dadosGrafico: JSON.stringify(consumos),
        anos,
        totalAgua,
        totalEnergia,
        eficiencia,
        mensagem: mensagemEficiencia,
        mensagemCrud
    });

    } catch (erro) {

        console.log("ERRO COMPLETO:");
        console.log(erro);

    }
});

//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
app.get('/usuarios/cadastrar', async (req, res) => {
    res.render('cadastrar');
});

app.post('/usuarios/add', async (req, res) => {
    const { nome, email, senha } = req.body;
    await Usuario.create({
        nome,
        email,
        senha
    });
    res.redirect("/?mensagem=cadastrado"); 
});
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.findAll({
        raw: true
    });
    res.render('usuarios', {
        usuarios
    });
});
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
app.get('/usuarios/editar/:id', async (req, res) => {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id, {
        raw: true
    });

    res.render('editar', {
        usuario
    });
});
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
app.post('/usuarios/update', async (req, res) => {

    const { id, nome, email, senha } = req.body;

    await Usuario.update(
        {
            nome,
            email,
            senha
        },
        {
            where: {
                id
            }
        }
    );

    res.redirect('/usuarios');
});
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
app.post('/usuarios/delete/:id', async (req, res) => {

    const id = req.params.id;

    await Usuario.destroy({
        where: {
            id
        }
    });

    res.redirect('/usuarios/cadastrar');
});

//----------------------------------------Grafico---------------------------------------------
//----------------------------------------Grafico---------------------------------------------
//----------------------------------------Grafico---------------------------------------------
app.get("/consumos/cadastrar", (req,res)=>{

    res.render("cadastrarConsumo");

});
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
app.post("/consumos/add", async (req,res)=>{

    const {tipo, mes, ano, valor} = req.body;

    await Consumo.create({

        tipo,
        mes,
        ano,
        valor

    });

    res.redirect("/?mensagem=cadastrado");  

});
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
app.get("/consumos/editar/:id", async (req,res)=>{

    const id = req.params.id;

    const consumo = await Consumo.findByPk(id,{
        raw:true
    });

    res.render("editarConsumo",{

        consumo

    });

});
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
app.post("/consumos/update", async (req,res)=>{

    const {

        id,
        tipo,
        mes,
        ano,
        valor

    } = req.body;

    await Consumo.update({

        tipo,
        mes,
        ano,
        valor

    },{

        where:{ id }

    });

    res.redirect("/?mensagem=editado");

});
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

app.post("/consumos/delete/:id", async (req,res)=>{

    const id = req.params.id;

    await Consumo.destroy({

        where:{ id }

    });

    res.redirect("/?mensagem=excluido");

});
//----------------------------------------Servidor----------------------------------------------
//----------------------------------------Servidor----------------------------------------------
//----------------------------------------Servidor----------------------------------------------
app.listen(port, () =>{
    console.log("Servidor ok")
})

async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();