const {select , input, checkbox}= require ("@inquirer/prompts")

const fs = require ("fs").promises

let mensagem= "Bem vindo ao App de metas..."

let metas = []

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas= JSON.parse(dados)
        console.log('opa baum',metas)
    }
    catch(error){
        console.log(error)
    }
    metas = []
}

const salvarMetas = async() =>{
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}
    

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite uma meta"})

    if(meta.length == 0){
        mensagem="A meta não pode ser vazia"
        return 
    }

    metas.push(
        {value:meta , checked: false}
    )

    mensagem= "Meta cadastrada com sucesso."
}


const listarMeta = async ()=>{
        console.log(metas)
    const respostas = await checkbox ({
        message: " Use as setas para mudar de meta, o espaço para marcar/desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], 
        instructions: false,
    })

    metas.forEach ((m) =>{
        m.checked = false
    })

    if (respostas.length == 0){
       mensagem="Nenhuma meta foi selecionada"
        return
    }


    respostas.forEach((resposta) => {
        const meta= metas.find((m) => {
            return m.value == resposta
        })

        meta.checked=true
    })

    mensagem="Meta(s) marcadas como concluída(s)!"
}

const metasRealizadas = async () =>{
    const realizadas = metas.filter((meta)=> {
        return meta.checked
    })

    if(realizadas.length == 0){
        mensagem=' Não tem nenhuma meta realizada ainda :( !'
        return
    }

    await select({
        message:"Metas Realizadas:" + realizadas.length,
        choices:[...realizadas]
    })
}
 
const metasAbertas= async () =>{
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        mensagem="Não tem nenhuma meta em aberto :)!"
        return
    }

    await select({
        message: "Metas abertas:" + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () =>{
    const metasDesmarcadas = metas.map((meta) =>{
        return {value: meta.value, checked: false}
    })

    const itemADeletar = await checkbox ({
        message: "Selecione um item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemADeletar.length== 0){
        mensagem= "Nenhum item para deletar!"
        return
    }

    itemADeletar.forEach((item) =>{
        metas = metas.filter((meta)=>{
            return meta.value !=item
        })
    })
    mensagem ="Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem= () =>{
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem= ""
    }
}

const start = async () => {
    await carregarMetas()

    while (true) {
        mostrarMensagem()
        await salvarMetas()

            const opcao = await select({
                message: "Menu>",
                choices:[
                    
                {
                    name: "Cadastrar metas",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value:"listar"
                },
                {
                    name: "Metas realizadas",
                    value:"realizadas"
                },
                {
                    name: "Metas abertas",
                    value:"abertas"
                },
                {
                    name: "Desmarcar metas",
                    value:"deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
                
            ]
         })
        



        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break
            case "realizadas":
                await metasRealizadas()   
                break 
            case "abertas":
                await metasAbertas() 
                break
            case "listar":
                await listarMeta()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima")
                return        
        }
        
    }
}

start()
