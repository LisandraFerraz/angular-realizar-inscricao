
interface IAluno{
    id_aluno: number
    nome: string
    qtd_turmas_inscritas: number
    qtd_creditos: number,
    disciplinas_aprovado: any[]
}

export const ListAlunos: IAluno[] = [
    {
        id_aluno: 1,
        nome: "Lisandra Ferraz",
        qtd_creditos: 50,
        qtd_turmas_inscritas: 0,
        disciplinas_aprovado: [
            {
                id_disciplina: 1
            },
            {
                id_disciplina: 2
            },
            {
                id_disciplina: 3
            },
            {
                id_disciplina: 4
            },
            {
                id_disciplina: 5
            },
            {
                id_disciplina: 6
            },
        ]
    },
    {
        id_aluno: 2,
        nome: "Daniela Houck",
        qtd_creditos: 50,
        qtd_turmas_inscritas: 0,
        disciplinas_aprovado: [
            {
                id_disciplina: 1
            },
            {
                id_disciplina: 2
            },
            {
                id_disciplina: 3
            },
            {
                id_disciplina: 4
            },
        ]
    },
    {
        id_aluno: 3,
        nome: "Paulo Henrique",
        qtd_creditos: 30,
        qtd_turmas_inscritas: 0,
        disciplinas_aprovado: [
            {
                id_disciplina: 1
            },
            {
                id_disciplina: 2
            },
            {
                id_disciplina: 3
            },
        ]
    },
    {
        id_aluno: 4,
        nome: "Gabriel Gozzi",
        qtd_turmas_inscritas: 0,
        qtd_creditos: 10,
        disciplinas_aprovado: [
            {
                id_disciplina: 1
            },
            {
                id_disciplina: 2
            },
        ]
    },
    {
        id_aluno: 5,
        nome: "Renan Figueredo",
        qtd_creditos: 25,
        qtd_turmas_inscritas: 0,
        disciplinas_aprovado: [
            {
                id_disciplina: 1
            },
        ]
    }
]

// export const Aluno_2: IAluno = 

// export const Aluno_3: IAluno = 

// export const Aluno_4: IAluno = 