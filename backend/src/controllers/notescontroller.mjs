import notesModel from '../models/notesmodel.mjs';

const getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await notesModel.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).send({ status: 'success', data: notes });
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: 'Internal server error' });
  }
};

const createNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content } = req.body;
    const note = await notesModel.create({ title, content, userId });
    return res.status(201).send({ status: 'success', data: note });
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: 'Internal server error' });
  }
};

const updateNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const note = await notesModel.findOne({ _id: req.params.id, userId });
    if (!note) {
      return res.status(403).send({ status: 'failed', message: 'You can only update your own notes' });
    }
    const { title, content } = req.body;
    const updated = await notesModel.findByIdAndUpdate(
      req.params.id,
      { ...(title != null && { title }), ...(content != null && { content }) },
      { new: true }
    );
    return res.status(200).send({ status: 'success', data: updated });
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: 'Internal server error' });
  }
};

const deleteNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const note = await notesModel.findOne({ _id: req.params.id, userId });
    if (!note) {
      return res.status(403).send({ status: 'failed', message: 'You can only delete your own notes' });
    }
    await notesModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: 'success', data: note });
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: 'Internal server error' });
  }
};

const migrateNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await notesModel.updateMany(
      { $or: [{ userId: { $exists: false } }, { userId: null }] },
      { $set: { userId } }
    );
    return res.status(200).send({
      status: 'success',
      message: `Migrated ${result.modifiedCount} note(s) to your account`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    return res.status(500).send({ status: 'failed', message: 'Internal server error' });
  }
};

export { getNotes, createNotes, updateNotes, deleteNotes, migrateNotes };