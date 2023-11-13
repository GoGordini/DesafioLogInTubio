import { Router } from 'express';
import usersModel from '../dao/dbManager/models/users.model.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name:firstName, last_name:lastName, email, age, password } = req.body;

        if (!firstName|| !lastName || !email || !age || !password) {
            return res.status(422).send({ status: 'error', message: 'incomplete values' });
        }//problemas con el body es 422.

        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'user already exists' });
        }
       //const role=(email=="adminCoder@coder.com");

        await usersModel.create({
            first_name: firstName,
            last_name: lastName,
            email,
            age,
            password
         //   isAdmin:role
        })

        res.status(201).send({ status: 'success', message: 'user registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await usersModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'incorrect credentials' });
        }
        const role=(user.email=="adminCoder@coder.com");

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            isAdmin: role

        } //seteo el atributo user en la session, sin datos sensibles.

        res.send({ status: 'success', message: 'login success' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/'); //vuelve al login.
    })
})

export default router;