import * as md5 from 'md5';
import { response, Router } from 'express'
import { knex } from '../db/postgre';
import { v4 as uuid } from 'uuid';
const router = Router();

// const { PG_SALT } = process.env;
const PG_SALT = 'qwe123';

const tableName = 'users';

const getPasswordHash = (password: string) => {
    return md5(password + PG_SALT);
}

router.get('/', async (req, res, next) => {

    const users = await knex(tableName)
        .select()
        
    res.json(users);
});

router.get('/login/:id', async (req, res, next) => {
    const id = req.params['id'];

    const [arrayData] = await knex(tableName)
        .select('filenames', 'projects')
        .where({ id });

    res.json(arrayData);
});

router.post('/login', async (req, res, next) => {
    const { body: {email, password } } = req;

    const passwordHash = getPasswordHash(password);

    const [user] = await knex(tableName)
        .select()
        .where({ email, passwordHash });
    

    const statusCode = user ? 200 : 403;
    const reason = user ? undefined : 'Invalid password';

    const response = {
        statusCode,
        reason,
        id: user.id
    }
  
    res.json(response);
});

router.put('/save', async (req, res, next) => {
    const {body} = req;
    const id = body.id;
    const filenames = body.filenames;
    const projects = body.projects;

    const [arrayData] = await knex(tableName)
        .select('filenames', 'projects')
        .where({ id });

    const arrayFiles = arrayData.filenames;
    const arrayProjects = arrayData.projects;

    if (arrayFiles === null) {
        await knex(tableName)
        .update({ 
            filenames: [filenames],
            projects: [projects]
        })
        .where({ id });
    } 
    else if (arrayFiles.indexOf(filenames) === -1) {
        arrayFiles.push(filenames);
        arrayProjects.push(projects);

        await knex(tableName)
        .update({ 
            filenames: arrayFiles,
            projects: arrayProjects
        })
        .where({ id });
    } 
    else {
        arrayProjects.splice(arrayProjects.indexOf(projects), 1, projects);

        await knex(tableName)
            .update({
                projects: arrayProjects
            })
            .where({ id });
    }

    const [arrayNew] = await knex(tableName)
        .select('filenames', 'projects')
        .where({ id });

    res.json(arrayNew);
});

router.post('/register', async (req, res, next) => {  
    const { body } = req;

    body.id = uuid();

    const { id, username, email, password } = body;

    const passwordHash = getPasswordHash(password);

    const [userEntered] = await knex(tableName)
        .select()
        .where({ email, passwordHash });
    
    if (!userEntered) {
        const [userRegistered] = await knex(tableName)
            .insert({ id, username, email, passwordHash })
            .returning('*');
        
    }

    const statusCode = !userEntered ? 200 : 400;
    const reason = !userEntered ? undefined : 'Email already exists';

    const response = {
        statusCode,
        reason
    }

    res.json(response);
});



export default router;