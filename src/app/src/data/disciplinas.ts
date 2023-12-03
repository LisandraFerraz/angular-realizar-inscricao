export interface IDisciplinas{
    id_disciplina: number
    nome_disciplina: string
    custo_credido: number
    id_turma: number
    horario: string
    selected: boolean
}

export const ListDisciplinas: IDisciplinas[] = [
    {
        id_disciplina: 1,
        nome_disciplina: 'Computação em Nuvem I',
        custo_credido: 5,
        id_turma: 1,
        horario: '11:00',
        selected: false
    },
    {
        id_disciplina: 2,
        nome_disciplina: 'Computação em Nuvem II',
        custo_credido: 10,
        id_turma: 3,
        horario: '19:00',
        selected: false
    },
    {
        id_disciplina: 3,
        nome_disciplina: 'Computação em Nuvem III',
        custo_credido: 10,
        id_turma: 1,
        horario: '07:00',
        selected: false
    },
    {
        id_disciplina: 4,
        nome_disciplina: 'Desenvolvimento Mobile I',
        custo_credido: 5,
        id_turma: 2,
        horario: '19:00',
        selected: false
    },
    {
        id_disciplina: 5,
        nome_disciplina: 'Desenvolvimento Mobile II',
        custo_credido: 8,
        horario: '09:30',
        id_turma: 2,
        selected: false
    },
    {
        id_disciplina: 6,
        nome_disciplina: 'Ética Profissional e Patente',
        custo_credido: 12,
        horario: '11:30',
        id_turma: 3,
        selected: false
    },
]