const agentModel = require('../model/agent')

const createAgent = async (req, res) => {
  const { name, email, phone } = req.body
  const agent = await agentModel.create({ name, email, phone })
  res.status(201).json({
    success: true,
    agent,
  })
}


const getAgents = async (req, res) => {
  const agents = await agentModel.find({})
  res.status(200).json({
    success: true,
    agents,
  })
}


const getAgent = async (req, res) => {
  const id = req.params.id
  const agent = await agentModel.findById(id)
  res.status(200).json({
    success: true,
    agent,
  })
}


const editAgent = async (req, res) => {
  const id = req.params.id
  const body = req.body
  const updateAgent = await agentModel.findByIdAndUpdate(id, body, { new: true })
  res.status(200).json({
    success: true,
    msg: 'Agent updated successfully',
    updateAgent,
  })
}


const deleteAgent = async (req, res) => {
  const id = req.params.id
  const agent = await agentModel.findByIdAndDelete(id)
  res.status(200).json({
    success: true,
    msg: 'Agent deleted successfully',
    agent,
  })
}

module.exports = { createAgent, getAgents, getAgent, editAgent, deleteAgent }
