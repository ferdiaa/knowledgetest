const models = require('../models/index')
const User = models.User
const Transaction = models.Transaction
const Joi = require('joi')
const filterKeys= require('../utils/filterKeys')
const logger = require('../utils/logger')
const idDate = require('../helpers/id_date')

exports.get = async (req, res) => {
    try{        
        // Get user
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        // Get transaction
        const transaction = await Transaction.findAll({
                                                where: {
                                                    userId: req.user.id
                                                }
                                            })   

        res.json({
            transaction: transaction,
            message: `Success retrieve all transaction by ${user.name}`
        })
    } catch(err) {
        logger.error(err, {
            errorObj: err
        })

        res
            .status(500)
            .json({
                message: err.message
            })
    }  
}

exports.getPerDate = async (req, res) => {
    try {        
        const {values, errMsg} = await validateInput(req, [
                                                'tanggal_transaksi',
                                            ]) 
        if(errMsg){
        return res
                .status(400)
                .json({
                message: errMsg
            })
        }
        
        // Get user
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        // Get transaction
        const transaction = await Transaction.findAll({
                                                where: {
                                                    tanggal_transaksi: values.tanggal_transaksi
                                                }
                                            })   

        res.json({
            message: `Success retrieve transaction by ${user.name} in ${idDate(values.tanggal_transaksi)}`,
            transaction: transaction
        })
    } catch(err) {
        logger.error(err, {
            errorObj: err
        })

        res
            .status(500)
            .json({
                message: err.message
            })
    }  
}

exports.post = async (req, res) => {
    try{
        // Validate the input
        const {values, errMsg} = await validateInput(req, [
                                    'tanggal_transaksi',
                                    'daftar_item',
                                    'jumlah_harga',
                                    'status_pembayaran'
                                ]) 
        if(errMsg){
            return res
                .status(400)
                .json({
                    message: errMsg
                })
        }

        // Get user
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        // Post the transaction
        const transaction = await Transaction.create({
            tanggal_transaksi: values.tanggal_transaksi,
            daftar_item: values.daftar_item,
            jumlah_harga: values.jumlah_harga,
            status_pembayaran: values.status_pembayaran,
            userId: user.id
        })

        res.json({
            transaction: transaction,
            message: `Success create transaction for ${user.name}`
        })
    } catch(err) {
        logger.error(err, {
            errorObj: err
        })

        res
            .status(500)
            .json({
                message: err.message
            })
    }  
}

exports.put = async (req, res) => {
    try{
        // Validate the input
        const {values, errMsg} = await validateUpdateInput(req, [
                                    'tanggal_transaksi',
                                    'daftar_item',
                                    'jumlah_harga',
                                    'status_pembayaran'
                                ]) 
        if(errMsg){
            return res
                .status(400)
                .json({
                    message: errMsg
                })
        }

        // Get user
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        // Get transaction by id
        const transactionById = await Transaction.findOne({
            where: {
                id: req.params.transactionId
            }
        })

        // Update the transaction
        transactionById.tanggal_transaksi = values.tanggal_transaksi
        transactionById.daftar_item = values.daftar_item
        transactionById.jumlah_harga = values.jumlah_harga
        transactionById.status_pembayaran = values.status_pembayaran

        await transactionById.save()

        res.json({
            transaction: transactionById,
            message: `Success update transaction for ${user.name}`
        })
    } catch(err) {
        logger.error(err, {
            errorObj: err
        })

        res
            .status(500)
            .json({
                message: err.message
            })
    }  
}

exports.destroy = async (req, res) => {
    try{
        // Get user
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        // Get transaction by id
        await Transaction.destroy({
            where: {
                id: req.params.transactionId
            }
        })

        res.json({
            transaction: 'transaction deleted',
            message: `Success delete transaction for ${user.name}`
        })
    } catch(err) {
        logger.error(err, {
            errorObj: err
        })

        res
            .status(500)
            .json({
                message: err.message
            })
    }  
}

const validateInput = async (req, inputKeys) => {
    try {
        const input = filterKeys(req.body, inputKeys)
        const rules = {         
            tanggal_transaksi: Joi
                                .date()
                                .required(),
            
            daftar_item: Joi
                            .string()
                            .required()
                            .trim()
                            .allow('', null),

            jumlah_harga: Joi
                            .number()
                            .required(),
            
            status_pembayaran: Joi
                            .string()
                            .required()
                            .trim()
                            .allow('', null)
        }
        
        // Create the schema based on the input key
        const schema = {}
        for(const key in input){
            if (rules.hasOwnProperty(key)){
                schema[key] = rules[key]
            }
        }        
        // Validate the input
        const values = await Joi
                        .object(schema)
                        .validateAsync(input)

        return {
            values: values
        }
    } catch (err) {
        return {
            errMsg: err.message
        }
    }    
}

const validateUpdateInput = async (req, inputKeys) => {
    try {
        const input = filterKeys(req.body, inputKeys)
        const rules = {         
            tanggal_transaksi: Joi
                                .date(),
            
            daftar_item: Joi
                            .string()
                            .trim()
                            .allow('', null),

            jumlah_harga: Joi
                            .number(),
            
            status_pembayaran: Joi
                            .string()
                            .trim()
                            .allow('', null)
        }
        
        // Create the schema based on the input key
        const schema = {}
        for(const key in input){
            if (rules.hasOwnProperty(key)){
                schema[key] = rules[key]
            }
        }        
        // Validate the input
        const values = await Joi
                        .object(schema)
                        .validateAsync(input)

        return {
            values: values
        }
    } catch (err) {
        return {
            errMsg: err.message
        }
    }    
}