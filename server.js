import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'

const app = Fastify({ logger: true })

let pacientes = [
  {
    id: "1",
    nome: "Lucas Silva Souza",
    cpf: "416.XXX.XXX-92",
    idade: 21, // Ajuste conforme necessário
    alturaCm: 165,
    pesoKg: 80,
    bpm: 74, // BPM estável
    especialidade: "Clínica Médica",
    setor: "Clínica Médica",
    leito: "459",
    statusLeito: "Internado",
    estadoClinico: "Estável",
    observacoes: "Paciente sob monitoramento contínuo de rotina, sinais vitais dentro da normalidade.",
    cadastradoEm: new Date().toISOString()
  }
]

app.get('/', async (request, reply) => {
  return { 
    sistema: "API Hospitalar - TI Health",
    status: "Online",
    endpoints: "/pacientes" 
  }
})

app.post('/pacientes', async (request, reply) => {
  const { nome, cpf, idade, alturaCm, pesoKg, bpm, especialidade, setor, leito, statusLeito, estadoClinico, observacoes } = request.body

  if (!nome || !especialidade) {
    return reply.status(400).send({ 
      erro: 'Campos obrigatórios ausentes: nome e especialidade são necessários.' 
    })
  }

  const novoPaciente = {
    id: randomUUID(),
    nome,
    cpf: cpf || 'Não informado',
    idade: idade || 0,
    alturaCm: alturaCm || 0,
    pesoKg: pesoKg || 0,
    bpm: bpm || 75,
    especialidade,
    setor: setor || 'Geral',
    leito: leito || 'N/A',
    statusLeito: statusLeito || 'Em Triagem',
    estadoClinico: estadoClinico || 'Estável',
    observacoes: observacoes || '',
    cadastradoEm: new Date().toISOString()
  }

  pacientes.push(novoPaciente)

  return reply.status(201).send({
    mensagem: "Paciente cadastrado com sucesso no sistema hospitalar.",
    paciente: novoPaciente
  })
})

app.get('/pacientes', async (request, reply) => {
  const { nome, especialidade } = request.query

  let resultado = pacientes

  if (nome) {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()))
  }

  if (especialidade) {
    resultado = resultado.filter(p => p.especialidade.toLowerCase().includes(especialidade.toLowerCase()))
  }

  return { total: resultado.length, pacientes: resultado }
})

app.get('/pacientes/:id', async (request, reply) => {
  const { id } = request.params
  const paciente = pacientes.find(p => p.id === id)

  if (!paciente) {
    return reply.status(404).send({ erro: 'Registro de paciente não encontrado.' })
  }

  return paciente
})

app.put('/pacientes/:id', async (request, reply) => {
  const { id } = request.params
  const dados = request.body

  const index = pacientes.findIndex(p => p.id === id)

  if (index === -1) {
    return reply.status(404).send({ erro: 'Registro de paciente não encontrado para atualização.' })
  }

  pacientes[index] = {
    ...pacientes[index],
    ...dados,
    atualizadoEm: new Date().toISOString()
  }

  return reply.send({
    mensagem: "Prontuário/Dados atualizados com sucesso.",
    paciente: pacientes[index]
  })
})

app.delete('/pacientes/:id', async (request, reply) => {
  const { id } = request.params
  const index = pacientes.findIndex(p => p.id === id)

  if (index === -1) {
    return reply.status(404).send({ erro: 'Registro não encontrado.' })
  }

  pacientes.splice(index, 1)

  return reply.status(204).send()
})

const start = async () => {
  try {
    await app.listen({ port: 3333 })
    console.log('Servidor da API Hospitalar rodando na porta 3333...')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()