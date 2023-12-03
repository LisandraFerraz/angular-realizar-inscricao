import { Component } from '@angular/core';
import { transitionHeight } from './utils/effects';
import { ListAlunos } from './src/data/perfis-alunos';
import { IDisciplinas, ListDisciplinas } from './src/data/disciplinas';
import Swal from 'sweetalert2';
import { ITurmas, TurmasAtivas } from './src/data/turmas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [transitionHeight],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  testestyle = 20

  title = 'angular-realizar-inscricao';

  panelOpenState = false;
  firstpanelOpenState = true;

  ListAlunos = ListAlunos
  ListDisciplinas = ListDisciplinas
  ListTurmas:ITurmas[] = TurmasAtivas


  alunoSelecionado = 0
  alunoDetails: any = []
  discipinasSelecionadas:IDisciplinas[] =[]
  tableInfoInscricao: any[] = []
  
  listaEspera = []
  disciplinasConcluidas: {id_disciplina:  number, nome_disciplina: string}[] = []


  ngOnInit(){
    this.infoInicial()
  }

  // essa funcao puxa as informacoes do aluno selecionados
  setAlunoDetails(){
    this.getDisciplina(1)
    this.alunoDetails = this.ListAlunos.filter((aluno) => this.alunoSelecionado == aluno.id_aluno)
    this.validateDisciplinasConcluidas()

    console.log(this.disciplinasConcluidas.length)

    this.ListDisciplinas.filter(disciplina => disciplina.selected =false);
    this.discipinasSelecionadas =[]
    this.tableInfoInscricao = []
  }

  // essa funcao lista no html as disciplinas concluidas pelo aluno
  getDisciplina(id: number){
    let discplina = this.ListDisciplinas.filter((d) =>id == d.id_disciplina)
    return discplina[0].nome_disciplina
  }
  
  // essa funcao puxa as informações das disciplinas selecionadas
  addItemToList(disc: any){
    if(!Array.isArray(this.discipinasSelecionadas)){
      this.discipinasSelecionadas = []
    }

    const idx = this.discipinasSelecionadas.findIndex((item:any) => item.id_disciplina === disc.id_disciplina)

    if(idx === -1){
      this.discipinasSelecionadas.push(disc)
    }
    else{
      this.discipinasSelecionadas.splice(idx, 1)
    }

    // puxa as informações da turma de cada disciplina selecionada
    if (disc.selected) {
      const turma = this.ListTurmas.find(p => p.id_turma === disc.id_turma);
      if (turma) {
        this.tableInfoInscricao.push({
          id_turma: turma.id_turma,
          nome_turma: turma.nome_turma,
          professor: turma.professor,
          nome_campus: turma.nome_campus,
          qtd_vagas_max: turma.qtd_vagas_max,
          qtd_vagas_dispo: turma.qtd_vagas_dispo,
          nome_disciplina: disc.nome_disciplina,
          id_disciplina: disc.id_disciplina,
          custo_credido: disc.custo_credido,
          horario: disc.horario
        });
      }
    } else {
      const index = this.tableInfoInscricao.findIndex(p => p.id_turma === disc.id_turma);
      if (index !== -1) {
        this.tableInfoInscricao.splice(index, 1);
      }
    }

  }

  /* 
  essa funcao verifica se as disicplinas em que o aluno foi aprovado
  estao inclusas na lista de disciplinas selecionadas por ele
  */ 
  validateDisciplinasConcluidas(){
    if(this.disciplinasConcluidas.length > 0) this.disciplinasConcluidas = []

    for (const aluno of this.alunoDetails){
      for(const disciplinaAprovado of aluno.disciplinas_aprovado){
       const disciplinaSelecionada =this.ListDisciplinas.find(d => d.id_disciplina === disciplinaAprovado.id_disciplina);
       if(disciplinaSelecionada){
         this.disciplinasConcluidas.push(disciplinaSelecionada)
       }
      }
     }
 
  }

  getTotalCreditosPorDisc(): number{
    const custoTotalDisciplinas = this.discipinasSelecionadas.reduce((total, disciplina) => total + disciplina.custo_credido, 0);
    return custoTotalDisciplinas
  }
  
  /* 
  abaixo ocorre a validação de horarios. caso existam horarios iguais em dois ou mais objetos
  cria um array novo para armazenar esses objetos com o mesmo horario
  */
  setHorariosRepetidos(info){
    let horariosRepetidos
    const horariosVistos = {};
    const objetosAgrupadosPorHorario = {};
  
    for (const objeto of info) {
      const horario = objeto.horario;
  
      if (horariosVistos[horario]) {
        objetosAgrupadosPorHorario[horario].push(objeto);
      } else {
        horariosVistos[horario] = true;
        objetosAgrupadosPorHorario[horario] = [objeto];
      }
    }
    horariosRepetidos = Object.values(objetosAgrupadosPorHorario).filter(arr => info.length > 1);
    return horariosRepetidos
  }

  validateInscricao(): any{
    const custoTotalDisciplinas = this.discipinasSelecionadas.reduce((total, disciplina) => total + disciplina.custo_credido, 0);
    const creditosDispo = this.alunoDetails[0].qtd_creditos
    let horariosRepetidos = this.setHorariosRepetidos(this.tableInfoInscricao)

    // apresenta um aviso informando os horarios em choque
    if(horariosRepetidos[0]?.length >=2){

      let listRepetidos = (arr) =>{
        let disciplinas;
        arr.forEach(d =>{
          disciplinas += `<li>${d.nome_disciplina}.<b> Horário: ${d.horario}</b></li>`
        })
        return disciplinas.replace(/^undefined/, '')
      }
      
      return Swal.fire({
        icon: 'warning',
        html: `
        <div style="text-align: left;">
        <p>Houve um choque nos horarios das seguintes disciplinas selecionadas:</p>
        <uL>    
          ${listRepetidos(horariosRepetidos[0])}
        </uL>
        <p>Por favor, selecione somente as disciplinas que não tenham horários conflitantes entre as demais.</p>
        </div>
        `,
        confirmButtonText:"Entendi"
      })
    }
    // verifica se existem disciplinas sem vagas e indica a possibilidade de adicionar na fila de espera
    const result = this.tableInfoInscricao.filter(objeto => objeto.qtd_vagas_dispo === 0);
    if(result?.length){
      let listVagasIndispo = (arr) =>{
        let vagas;
        arr.forEach(d =>{
          vagas += `<li>${d.nome_disciplina}.<b> Qtd. Vagas: ${d.qtd_vagas_dispo}</b></li>`
        })
        return vagas.replace(/^undefined/, '')
      }
      
      return Swal.fire({
        icon: 'warning',
        html: `
        <div style="text-align: left;">
        <p>As seguintes disciplinas selecionadas não têm mais vagas:</p>
        <uL>    
          ${listVagasIndispo(result)}
        </uL>
        <p>Você deseja adicionar o aluno na lista de espera para futuras vagas?</p>
        </div>
        `,
        showDenyButton: true,
        confirmButtonText:"Sim",
        denyButtonText:"Não"
      }).then((res)=>{
        if(res.isConfirmed){
          this.listaEspera.push(this.alunoDetails)

          let posicao = this.listaEspera.indexOf(this.alunoDetails) + 1
          Swal.fire({
            icon: 'success',
            html: `
            <p>Aluno adicionado na lista de espera. Posição atual: ${posicao}</p>
            <small>Por favor, selecione somente as disciplinas com vagas disponíveis.</small>
            `
          })
        }
      })
    }
    // apresenta um aviso informando que a quantidade total de creditos das disicplinas é selecionadassuperior a 20
    if(custoTotalDisciplinas > 20){
      return Swal.fire({
        icon: 'warning',
        html:`
        <p>O aluno não pode se inscrever em mais disciplinas quando o custo total de créditos atinge 20.</p>
        <small>A soma de crédito para as disciplinas selecionadas é <span class="danger-text">${custoTotalDisciplinas}.</span></small>
        `,
        confirmButtonText:"Entendi"
      })
    }
    // apresenta um aviso informando a quantidade de creditos inferior ao total das disicplinas selecionadas
    if(creditosDispo < custoTotalDisciplinas){
      return Swal.fire({
        icon: 'warning',
        html:`
        <p>O aluno tem ${creditosDispo} créditos disponíveis. Por favor, verifique o custo de cada disciplina e tente realizar a inscrição novamente.</p>
        <small>A soma de crédito para as disciplinas selecionadas é <span class="danger-text">${custoTotalDisciplinas}.</span></small>
        `,
        confirmButtonText:"Entendi"
      })
    }

    // caso de sucesso e nenhum dos ifs barre o fluxo, segue cadastro normal
    let listDisciplinasInscritas = (arr) =>{
      let vagas;
      arr.forEach(d =>{
        vagas += `<li>${d.nome_disciplina}</li>`
      })
      return vagas.replace(/^undefined/, '')
    }

    Swal.fire({
      icon: 'success',
      html: `
      <div style="text-align: left;">
        <p>Aluno inscrito com sucesso nas seguintes disicplinas:</p>
        <ul>${listDisciplinasInscritas(this.tableInfoInscricao)}</ul> 
      <div>
      
      `
    })
  }

  expandNextStep(){
    this.panelOpenState = true
    
  }

  validateAlunoSelecionado(){
    if(this.alunoSelecionado ==0 ){
      Swal.fire({
        icon: "error",
        text: "Primeiro, você precisa selecionar um aluno para prosseguir com a simulação de inscrição."
      })
    }
  }

  infoInicial(){
    Swal.fire({
      icon: "info",
      iconColor:"#C6C5F5",
      html: `
        <b>Leia antes de prosseguir.</b>
        <div style="font-size: 16px">
          <p>Esta é uma simulação para contemplar o cenário de inscrição de um aluno nas disciplinas disponíveis.</p>
          <p>Para seguir com a verificação de cenários e validar regras de negócio do CSU, <b>você precisa
          selecionar um perfil de aluno que corresponde a um usuário logado no sistema</b>.</p>
          <p>Os dados apresentados a seguir estão chumbados/mockados no front-end, sem integração de APIs.</p>
        </div>
      `,
      confirmButtonText: "Entendi",
      confirmButtonColor: "#7690D2",
      cancelButtonAriaLabel: "Thumbs down"
    })
  }
}
