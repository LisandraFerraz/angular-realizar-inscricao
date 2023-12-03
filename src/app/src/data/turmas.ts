export interface ITurmas{
    id_turma: number
    nome_turma: string
    professor: string
    nome_campus: string
    qtd_vagas_max: number
    qtd_vagas_dispo: number
}

export const TurmasAtivas: ITurmas[] = [
    {
        id_turma: 1,
        nome_turma: "TURMA A",
        professor: "Rogerio Pereira",
        nome_campus: "CAMPUS VERDE FLORESCER",
        qtd_vagas_max: 25,
        qtd_vagas_dispo: 5
        
    },
    {
        id_turma: 2,
        nome_turma: "TURMA B",
        professor: "Jeferson Roberto de Lima",
        nome_campus: "CAMPUS AZUL SOLITÁRIO",
        qtd_vagas_max: 25,
        qtd_vagas_dispo: 0
    },
    {
        id_turma: 3,
        nome_turma: "TURMA C",
        professor: "Andreza Santos",
        nome_campus: "CAMPUS NOITES VELHAS",
        qtd_vagas_max: 25,
        qtd_vagas_dispo: 2
    }
]