const {select , input, checkbox}= require ("@inquirer/prompts")


let meta ={
    value: "Tomar 3l de água todo dia",
    checked: false,
}
    
let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite uma meta"})

    if(meta.length == 0){
        console.log ("A meta não pode ser vazia")
        return 
    }

    metas.push(
        {value:meta , checked: false}
    )
}

const listarMeta = async ()=>{
    const respostas = await checkbox ({
        message: " Use as setas para mudar de meta, o espaço para marcar/desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], 
        instructions: false,
    })

    metas.forEach ((m) =>{
        m.checked = false
    })

    if (respostas.length == 0){
        console.log ("Nenhuma meta foi selecionada")
        return
    }


    respostas.forEach((resposta) => {
        const meta= metas.find((m) => {
            return m.value == resposta
        })

        meta.checked=true
    })

    console.log ("Meta(s) marcadas como concluída(s)!")
}

const metasRealizadas = async () =>{
    const realizadas = metas.filter((meta)=> {
        return meta.checked
    })

    if(realizadas.length == 0){
        console.log (' Não tem nenhuma meta realizada ainda :( !')
        return
    }

    await select({
        message:"Metas Realizadas:" + realizadas.length,
        choices:[...realizadas]
    })
}
 
const metasAbertas= async () =>{
    const abertas = meta.filter((metas) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        console.log ("Não tem nenhuma meta em aberto :)!")
        return
    }

    await select({
        message: "Metas abertas:" + abertas.length,
        choices: [...abertas0]
    })
}

const deletarMetas = async () =>{
    const metasDesmarcadas = metas.map((meta) =>{
        return {value: meta.value, checked: false}
    })

    const itemADeletar = await checkbox ({
        message: "Selecione um item para deletar",
        value: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemADeletar.length== 0){
        console.log("Nenhum item para deletar!")
        return
    }

    itemADeletar.forEach((item) =>{
        metas = metas.filter((meta)=>{
            return meta.value !=item
        })
    })
    console.log("Meta(s) deletada(s) com sucesso!")
}

const start = async () => {
   
    while (true) {
        

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
                console.log (metas)
                break
            case "realizadas":
                await metasRealizadas()    
            case "abertas":
                await metasAbertas() 
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
