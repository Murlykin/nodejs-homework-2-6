const {
    listContacts,

} = require('../models/contacts');



const getContact = async (req, res) => {
    try {
        const result = await listContacts();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};



module.exports = {
    getContact,

};
