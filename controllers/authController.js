const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const path = require('path')
const logger = require('../utils/logger')
const User = require('../models/index').User

exports.register = async (req, res) => {    
    try {     
        const hashedPassword = await bcrypt.hash(
            req.body.password, 10
        )
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        res
            .status(200)
            .json({
                message: 'Success',
                user: await User.findOne({
                    where: {
                        id: user.id
                    }
                }),
            })        
    }
    catch(err){
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

exports.login = async (req, res) => {
    try{
        const user = await User.scope('withPassword').findOne({
            where: {
                email: req.body.email
            },
        })

        if(!user){
            return res
                .status(400)
                .json({
                    message: 'Invalid credentials'
                })
        }

        if (!await bcrypt.compare(
                            req.body.password,
                            user.password
                        )) {
            return res
                .status(400)
                .json({
                    message: 'Invalid credentials'
                })
        }

        const jwt = issueJWT(user)

        res.send({
            message: 'Success login',
            user: await User.findOne({
                where: {
                    id: user.id
                }
            }),
            token: jwt.token,
            expiresIn: jwt.expiresIn
        })          
    } catch (err){
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

const issueJWT = (user) => {
    try {
        const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem')
        const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8')
    
        const currentTime = Date.now()
        const expiresIn = currentTime / 1000 + (3600 * 24) // 1 day
        const expiresInTimeTamp = new Date(expiresIn * 1000)

        const expiresInTimeTampHuman = expiresInTimeTamp.toLocaleDateString()+
                                        " "+expiresInTimeTamp.getHours()+
                                        ":"+expiresInTimeTamp.getMinutes()+
                                        ":"+expiresInTimeTamp.getSeconds()

        const payload = {
            sub: user.id,
            iat: currentTime,
            exp: expiresIn
        }
        const signedToken = jwt.sign(payload, PRIV_KEY, {
            algorithm: 'RS256'
        })
        return {
            token: signedToken,
            expiresIn: expiresInTimeTampHuman
        }        
    } catch (err) {
        logger.error(err, {errObj: err})
        throw err
    }
}

exports.try = async (req, res) => {
    console.log('inside');
    res.status(200).json({
        "Running": true
    })
}