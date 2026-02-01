import express from 'express';
import { registerUser, loginUser, updateUser, getProfile} from '../controllers/userController.mjs';
import { authentication, authorization } from '../auth/authentication.mjs';
import { getNotes, createNotes, updateNotes, deleteNotes, migrateNotes } from '../controllers/notescontroller.mjs';
const router =express.Router();
router.get('/',(req, res)=>{
    res.send("Hello from the route!");})
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', authentication,authorization, updateUser);
router.get('/profile/:id', authentication, getProfile);
router.get('/notes', authentication, getNotes);
router.post('/notes', authentication, createNotes);
router.put('/notes/:id', authentication, updateNotes);
router.delete('/notes/:id', authentication, deleteNotes);
router.post('/notes/migrate', authentication, migrateNotes);
// router.post('/createbook', createBook);
// router.get('/books', getBook);

export default router;
