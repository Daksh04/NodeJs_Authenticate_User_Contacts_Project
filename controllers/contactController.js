const asyncHandler = require('express-async-handler');
const Contact = require("../models/contactModel");
const { constants } = require('../constants');
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req,res)=>{
    console.log("The request generated is",req.body);
    const {name,email,phone}=req.body;
    if(!name||!email||!phone){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(201).json(contact);
});

//@desc Get individual contact
//@route Get /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(constants.NOT_FOUND);
        throw new Error ("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(constants.NOT_FOUND);
        throw new Error ("Contact not found");
    }
    
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new error("User doesn't have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true});

    res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route Delete /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(constants.NOT_FOUND);
        throw new Error ("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new error("User doesn't have permission to update other user contacts");
    }

    //await Contact.findByIdAndRemove(req.params.id);
    await Contact.deleteOne({_id:req.params.id});

    res.status(200).json(contact);
});

module.exports ={getContacts,createContact,getContact,updateContact,deleteContact};