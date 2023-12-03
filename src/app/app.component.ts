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
  
  disciplinasConcluidas: {id_disciplina:  number, nome_disciplina: string}[] = []


  ngOnInit(){
    // this.infoInicial()
  }


  setAlunoDetails(){
    this.getDisciplina(1)

    this.alunoDetails = this.ListAlunos.filter((aluno) => this.alunoSelecionado == aluno.id_aluno)
      this.validateDisciplinasConcluidas()

    }

  getDisciplina(id: number){
    let discplina = this.ListDisciplinas.filter((d) =>id == d.id_disciplina)
    return discplina[0].nome_disciplina
  }
  
  addItemToList(disc: any){
    // puxa as informações das disciplinas selecionadas
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
        });
      }
    } else {
      const index = this.tableInfoInscricao.findIndex(p => p.id_turma === disc.id_turma);
      if (index !== -1) {
        this.tableInfoInscricao.splice(index, 1);
      }
    }

  }

  validateDisciplinasConcluidas(){
    /* 
    essa funcao verifica se as disicplinas em que o aluno foi aprovado
    estao inclusas na lista de disciplinas selecionadas por ele
    */ 

    if(this.disciplinasConcluidas.length > 0) this.disciplinasConcluidas = []

    for (const aluno of this.alunoDetails){
      for(const disciplinaAprovado of aluno.disciplinas_aprovado){
       const disciplinaSelecionada =this.ListDisciplinas.find(d => d.id_disciplina === disciplinaAprovado.id_disciplina);
       if(disciplinaSelecionada){
         this.disciplinasConcluidas.push(disciplinaSelecionada)
       }
      }
     }
 
    //  console.log("Disciplinas Concluídas: ", this.disciplinasConcluidas)
  }

  getTotalCreditosPorDisc(): number{
    const custoTotalDisciplinas = this.discipinasSelecionadas.reduce((total, disciplina) => total + disciplina.custo_credido, 0);
    const creditosDispo = this.alunoDetails[0].qtd_creditos

    return custoTotalDisciplinas
  }

  validateInscricao(){

    const custoTotalDisciplinas = this.discipinasSelecionadas.reduce((total, disciplina) => total + disciplina.custo_credido, 0);
    const creditosDispo = this.alunoDetails[0].qtd_creditos

    if(creditosDispo < custoTotalDisciplinas){
      Swal.fire({
        icon: 'warning',
        html:`
        <p>Você tem ${creditosDispo} créditos disponíveis. Por favor, verifique o custo de cada disciplina e tente realizar a inscrição novamente.</p>
        <small>A soma de crédito para as disciplinas selecionadas é <span class="danger-text">${custoTotalDisciplinas}.</span></small>
        `,
        confirmButtonText:"Entendi"
      })
    }

    console.log('resultado soma ', custoTotalDisciplinas)



    // if(this.disciplinasConcluidas.length){
    //   console.log("disciplinasCursadas",this.disciplinasConcluidas)

    //   let listCursadas = (arr) =>{
    //     let disciplinas;
    //     arr.forEach(d =>{
    //       disciplinas += `<li>${d.nome_disciplina}</li>`
    //     })
    //     return disciplinas.replace(/^undefined/, '')
    //   }
      
    //   Swal.fire({
    //     icon: 'warning',
    //     html: `
    //     <div style="text-align: left;">
    //     <p>O aluno ${this.alunoDetails[0].nome} <b>já foi aprovado</b> nas seguintes disciplinas selecionadas:</p>
    //     <uL>    
    //       ${listCursadas(this.disciplinasConcluidas)}
    //     </uL>
    //     <p>Por favor, selecione somente as disciplinas que o aluno ainda não completou.</p>
    //     </div>
    //     `,
    //     confirmButtonText:"Entendi"
    //   })
    // }


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
