const ticketModel = require('../models/ticketmodel.js')
const createticket = async(req, res)=>{
    const { title, desc, price,priority,category,status,createdBy,assignedTo} = req.body
    const ticket = await ticketModel.create({
        title, desc, price,priority,category,status,createdBy,assignedTo
    })
    res.status(201).json({
        success:true,
        ticket
    })
}
const gettickets = async(req, res)=>{
    const tickets = await ticketModel.find({})
    res.status(200).json({
        success:true,
        tickets
    })
}
const getticket = async(req,res)=>{
    const id = req.params.id
    const ticket = await ticketModel.findById(id)
    res.status(200).json({
        success:true,
        ticket
    })
}
const deleteticket = async(req,res)=>{
    const id = req.params.id
    const ticket = await ticketModel.findByIdAndDelete(id)
    res.status(200).json({
        success:true,
        ticket
    })
}
const editticket = async(req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const updateticket = await ticketModel.findByIdAndUpdate(id, body, {new:true})
    res.status(200).json({
        success:true,
        msg:"ticket updated successfully",
        updateticket
    })
}
module.exports = {createticket, getticket, gettickets, deleteticket, editticket}